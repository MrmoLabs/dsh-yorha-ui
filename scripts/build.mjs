/**
 * Build dsh-yorha-ui (pure node — no external bundler).
 *
 * The browser half (`exports["./client"]`) MUST be a single self-registering
 * file that calls `window.__ModuleLoader__.load({ id, factory })` with every
 * dependency inlined: the DSH Web client loader runs these as classic scripts
 * inside shared combo bundles, so raw ESM `import`s or extra relative files
 * abort the whole combo. `src/client.ts` is therefore self-contained and is
 * compiled to CommonJS (`tsconfig.client.json`), then wrapped with the same
 * preamble/footer the reference plugin `dsh-mermaid` and the built-in client
 * modules use.
 *
 * The host half (`exports["."]`) is emitted as plain ESM for the node loader.
 */
import { spawnSync } from 'node:child_process';
import { rm, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const { name: NAME } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

if (typeof NAME !== 'string' || NAME.length === 0) {
  throw new Error('package.json must declare a non-empty package name');
}

function runTsc(config) {
  const result = spawnSync(process.execPath, [tsc, '-p', config], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`tsc -p ${config} failed (${result.status})`);
    process.exit(result.status ?? 1);
  }
}

await rm('dist', { recursive: true, force: true });
await rm('.build', { recursive: true, force: true });

// Host half: ESM plugin module for the node loader.
runTsc('tsconfig.esm.json');

// Browser half: CommonJS, then wrap for the DSH client module loader.
runTsc('tsconfig.client.json');

await mkdir('dist', { recursive: true });
const raw = await readFile(join(root, '.build', 'client', 'client.js'), 'utf8');
const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const requires = [...code.matchAll(/require\("([^"]+)"\)/g)].map((match) => match[1]);
const EXTERNALS = ['react']; // platform seed words resolved by the host module table
if (/\bimport\b/.test(code) || requires.some((specifier) => !EXTERNALS.includes(specifier))) {
  throw new Error(`client bundle must not contain runtime imports (requires found: ${requires.join(', ') || 'none'})`);
}
const banner = `window.__ModuleLoader__.load({id:"${NAME}",factory:(require)=>{var module={exports:{}};var exports=module.exports;`;
const footer = 'return module.exports;}});';
await writeFile(join(root, 'dist', 'client.js'), banner + raw + footer, 'utf8');
await rm(join(root, '.build'), { recursive: true, force: true });

const client = await readFile(join(root, 'dist', 'client.js'), 'utf8');
if (!client.startsWith(`window.__ModuleLoader__.load({id:"${NAME}",`)) {
  throw new Error('dist/client.js does not register the expected ModuleLoader id');
}

console.log('built dist/index.js (host ESM) + dist/client.js (wrapped browser bundle)');
