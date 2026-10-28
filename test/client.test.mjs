import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

class FakeClassList {
  #values = new Set();

  add(value) {
    this.#values.add(value);
  }

  remove(value) {
    this.#values.delete(value);
  }

  contains(value) {
    return this.#values.has(value);
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.classList = new FakeClassList();
    this.dataset = {};
    this.parentNode = null;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (!this.parentNode) return;
    const index = this.parentNode.children.indexOf(this);
    if (index >= 0) this.parentNode.children.splice(index, 1);
    this.parentNode = null;
  }
}

class FakeDocument {
  constructor({ ready = true } = {}) {
    this.documentElement = new FakeElement('html');
    this.head = ready ? new FakeElement('head') : null;
    this.body = ready ? new FakeElement('body') : null;
    this.listeners = new Map();
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  removeEventListener(type, listener) {
    if (this.listeners.get(type) === listener) this.listeners.delete(type);
  }
}

class FakeMutationObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.disconnected = false;
    FakeMutationObserver.instances.push(this);
  }

  observe() {}

  disconnect() {
    this.disconnected = true;
  }
}

async function loadClient(document = new FakeDocument()) {
  FakeMutationObserver.instances = [];
  const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8');
  let registration;
  const context = {
    document,
    MutationObserver: FakeMutationObserver,
    window: {
      __ModuleLoader__: {
        load(value) {
          registration = value;
        }
      }
    }
  };

  vm.runInNewContext(source, context, { filename: 'dist/client.js' });
  assert.ok(registration, 'client bundle must self-register');
  return { client: registration.factory(() => assert.fail('bundle must not require runtime modules')), document, registration };
}

function applyClient(client) {
  const effects = [];
  const tokenLayers = [];
  const ctx = {
    theme: {
      overrideTokens(source, tokens) {
        tokenLayers.push({ source, tokens });
        return () => {};
      }
    },
    effect(callback, label) {
      effects.push({ label, cleanup: callback() });
    }
  };

  client.apply(ctx);
  return { effects, tokenLayers };
}

function decorationCleanup(effects) {
  const effect = effects.find(({ label }) => label.includes('strict geometry'));
  assert.equal(typeof effect?.cleanup, 'function');
  return effect.cleanup;
}

test('bundle registers the canonical package contract', async () => {
  const { client, registration } = await loadClient();

  assert.equal(registration.id, 'dsh-yorha-ui');
  assert.equal(typeof client.apply, 'function');
  assert.deepEqual(Array.from(client.inject), ['theme']);
});

test('apply mounts one token layer and shared decorations until the last cleanup', async () => {
  const { client, document } = await loadClient();
  const first = applyClient(client);
  const second = applyClient(client);

  assert.equal(first.tokenLayers.length, 1);
  assert.equal(first.tokenLayers[0].source, 'yorha-palette');
  assert.equal(Object.keys(first.tokenLayers[0].tokens).length, 114);
  assert.equal(document.head.children.length, 1);
  assert.equal(document.body.children.length, 1);
  assert.equal(document.head.children[0].dataset.plugin, 'dsh-yorha-ui');
  assert.equal(document.body.children[0].className, 'dsh-yorha-repository-link');
  assert.equal(document.body.children[0].ariaLabel, 'Open the dsh-yorha-ui source repository');
  assert.equal(document.body.children[0].rel, 'noreferrer');
  assert.ok(document.body.classList.contains('dsh-plugin-yorha'));

  decorationCleanup(first.effects)();
  assert.equal(document.head.children.length, 1, 'first cleanup must preserve shared decorations');
  assert.equal(document.body.children.length, 1);

  decorationCleanup(second.effects)();
  assert.equal(document.head.children.length, 0);
  assert.equal(document.body.children.length, 0);
  assert.ok(!document.body.classList.contains('dsh-plugin-yorha'));
});

test('decoration mounting retries when head and body appear after apply', async () => {
  const document = new FakeDocument({ ready: false });
  const { client } = await loadClient(document);
  const { effects } = applyClient(client);

  assert.ok(document.listeners.has('DOMContentLoaded'));
  assert.equal(FakeMutationObserver.instances.length, 1);

  document.head = new FakeElement('head');
  document.body = new FakeElement('body');
  FakeMutationObserver.instances[0].callback();

  assert.equal(document.head.children.length, 1);
  assert.equal(document.body.children.length, 1);
  assert.ok(!document.listeners.has('DOMContentLoaded'));
  assert.ok(FakeMutationObserver.instances[0].disconnected);

  decorationCleanup(effects)();
  assert.equal(document.head.children.length, 0);
  assert.equal(document.body.children.length, 0);
});
