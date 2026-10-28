/**
 * dsh-yorha-ui — browser half (self-contained).
 *
 * Ships to the DSH Web GUI through the package `exports["./client"]` and is
 * activated because the package declares `dsh.client` (platform "web") and a
 * loader entry named `dsh-yorha-ui` exists in the profile roster.
 *
 * IMPORTANT: the DSH client loader executes this file as a classic script
 * inside a shared combo bundle. The served file must therefore be a single
 * self-registering unit — the build wraps the compiled CommonJS output in
 * `window.__ModuleLoader__.load({ id, factory })` — and it must not contain
 * any runtime `import`/`require` of relative modules. Everything (palette,
 * CSS, logic) lives in this one file and is inlined by the build.
 *
 * What the plugin does:
 *  1. Stacks the YoRHa alias-token layer through the `theme` service. The
 *     `ui-theme` presenter re-applies it as inline custom properties on
 *     `<body>` on every theme/change, so the layer survives the light/dark
 *     switch and the presenter's own repaints (the dynamic-package façade
 *     pins the layer's source to this package id).
 *  2. Mounts the strict-geometry stylesheet (radius 0 / no shadows / mono
 *     data fonts) under a marker class while this plugin is mounted.
 */

export type TokenPair = { light: string; dark: string };
export type TokenOverrides = Record<string, TokenPair>;

/** Monospace stack used for data, timestamps, hashes and system logs. */
const CODE_FONT =
  "'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SF Mono', 'Menlo', 'DejaVu Sans Mono', monospace";

/** Terminal-flavoured UI face (latin glyphs). Remove this pair to keep the stock UI font. */
const UI_FONT =
  "'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'Segoe UI', system-ui, sans-serif";

/** Invisible box-shadow (used to neutralise elevation shadows without invalidating composed lists). */
const NO_SHADOW = '0 0 0 0 transparent';

/** Crisp 0.5px registration-line "elevation" used instead of soft shadows. */
const REGISTRATION_LINE = '0 0 0 0.5px var(--dsw-elevation-stroke-color)';

/** Public source repository opened from the fixed footer signature. */
const REPOSITORY_URL = 'https://github.com/MrmoLabs/dsh-yorha-ui';

/**
 * Full alias-layer override for the DeepSeek Harness Web shell.
 * Left column = light scheme, right column = `body[data-ds-dark-theme]`.
 */
export const YORHA_TOKENS: TokenOverrides = {
  // — backgrounds ---------------------------------------------------------
  '--dsw-alias-bg-base': { light: '#C9C5B4', dark: '#23211C' },
  '--dsw-alias-bg-layer-1': { light: '#D2CEBE', dark: '#2B2823' },
  '--dsw-alias-bg-layer-2': { light: '#DBD8CA', dark: '#333029' },
  '--dsw-alias-bg-layer-3': { light: '#E4E1D4', dark: '#3B3830' },
  '--dsw-alias-bg-module-platform': { light: '#D2CEBE', dark: '#2B2823' },
  '--dsw-alias-bg-multi-select': { light: '#DDD9C9', dark: '#2E2B25' },
  '--dsw-alias-bg-overlay': { light: '#EFECDF', dark: '#3B3830' },
  '--dsw-alias-bg-skeleton': { light: 'rgba(60, 57, 51, 0.09)', dark: 'rgba(255, 255, 255, 0.05)' },
  '--dsw-alias-bg-mask-1': { light: 'rgba(35, 32, 27, 0.55)', dark: 'rgba(0, 0, 0, 0.6)' },
  '--dsw-alias-bg-mask-2': { light: 'rgba(35, 32, 27, 0.32)', dark: 'rgba(0, 0, 0, 0.4)' },
  '--dsw-alias-bg-mask-3': { light: 'rgba(20, 18, 15, 0.72)', dark: 'rgba(0, 0, 0, 0.75)' },
  '--dsw-alias-bg-mask-drop': { light: 'rgba(240, 237, 223, 0.92)', dark: 'rgba(255, 251, 235, 0.88)' },
  '--dsw-alias-bg-mask-photo': { light: 'rgba(18, 16, 13, 0.86)', dark: 'rgba(0, 0, 0, 0.85)' },
  // — borders -------------------------------------------------------------
  '--dsw-alias-border-l1': { light: 'rgba(63, 60, 54, 0.14)', dark: 'rgba(233, 229, 215, 0.12)' },
  '--dsw-alias-border-l2': { light: 'rgba(63, 60, 54, 0.24)', dark: 'rgba(233, 229, 215, 0.22)' },
  '--dsw-alias-border-l2-darkmode-thin': { light: 'rgba(255, 255, 255, 0.1)', dark: 'rgba(255, 255, 255, 0.08)' },
  '--dsw-alias-border-l3': { light: 'rgba(63, 60, 54, 0.34)', dark: 'rgba(233, 229, 215, 0.34)' },
  '--dsw-alias-border-l4': { light: 'rgba(63, 60, 54, 0.52)', dark: 'rgba(233, 229, 215, 0.55)' },
  '--dsw-alias-border-inverted': { light: 'rgba(35, 32, 27, 0.16)', dark: 'rgba(233, 229, 215, 0.2)' },
  '--dsw-alias-border-inverted2': { light: 'rgba(35, 32, 27, 0.1)', dark: 'rgba(233, 229, 215, 0.12)' },
  // — brand / buttons -----------------------------------------------------
  '--dsw-alias-brand-primary': { light: '#3C3933', dark: '#E9E5D6' },
  '--dsw-alias-brand-primary-invert': { light: '#F2EFE2', dark: '#23211C' },
  '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#C17B1A', dark: '#E58D28' },
  '--dsw-alias-brand-text': { light: '#3C3933', dark: '#E9E5D6' },
  '--dsw-alias-button-contrast-fill': { light: '#3C3933', dark: '#DCD8C8' },
  '--dsw-alias-button-elevated-fill': { light: '#EFECDF', dark: '#3B3830' },
  '--dsw-alias-button-floating-fill': { light: '#EFECDF', dark: '#332F29' },
  '--dsw-alias-button-floating-hover': { light: '#E5E2D3', dark: '#3B3830' },
  '--dsw-alias-button-ghost-active-border': { light: 'rgba(63, 60, 54, 0.55)', dark: 'rgba(233, 229, 215, 0.5)' },
  '--dsw-alias-button-ghost-active-fill': { light: '#E0DCCE', dark: '#3B3830' },
  '--dsw-alias-button-ghost-active-hover': { light: '#D5D1C1', dark: '#45413A' },
  '--dsw-alias-button-info-fill': { light: '#C17B1A', dark: '#C17B1A' },
  '--dsw-alias-button-info-hover': { light: '#A96D10', dark: '#DE9A3C' },
  '--dsw-alias-button-primary-dimmed': { light: 'rgba(60, 57, 51, 0.12)', dark: 'rgba(233, 229, 215, 0.14)' },
  '--dsw-alias-button-primary-fill': { light: '#3C3933', dark: '#E9E5D6' },
  '--dsw-alias-button-primary-hover': { light: '#2B2823', dark: '#FFFDF2' },
  '--dsw-alias-button-tool-bar-fill': { light: 'rgba(60, 57, 51, 0.26)', dark: 'rgba(233, 229, 215, 0.16)' },
  '--dsw-alias-button-tool-bar-fill-invisible': { light: 'rgba(60, 57, 51, 0.1)', dark: 'rgba(233, 229, 215, 0.07)' },
  '--dsw-alias-button-tool-bar-hover': { light: 'rgba(60, 57, 51, 0.36)', dark: 'rgba(233, 229, 215, 0.24)' },
  // — interactive ---------------------------------------------------------
  '--dsw-alias-interactive-bg-active': { light: 'rgba(193, 123, 26, 0.16)', dark: 'rgba(222, 154, 60, 0.18)' },
  '--dsw-alias-interactive-bg-hover': { light: 'rgba(63, 60, 54, 0.06)', dark: 'rgba(255, 255, 255, 0.05)' },
  '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(193, 123, 26, 0.12)', dark: 'rgba(222, 154, 60, 0.12)' },
  '--dsw-alias-interactive-bg-hover-danger': { light: 'rgba(179, 57, 39, 0.08)', dark: 'rgba(217, 72, 52, 0.1)' },
  '--dsw-alias-interactive-bg-hover-solid': { light: '#D5D1C1', dark: '#45413A' },
  // — text -----------------------------------------------------------------
  '--dsw-alias-label-primary': { light: '#26231E', dark: '#ECE8D9' },
  '--dsw-alias-label-secondary': { light: '#5C574B', dark: '#C6C1B1' },
  '--dsw-alias-label-tertiary': { light: '#8B8576', dark: '#A29D8D' },
  '--dsw-alias-label-caption': { light: '#8B8576', dark: '#8F8A7C' },
  '--dsw-alias-label-dimmed': { light: '#B0AA9A', dark: '#56524A' },
  '--dsw-alias-label-primary-bluish': { light: '#3C3933', dark: '#E2DECF' },
  '--dsw-alias-label-primary-dimmed': { light: '#6F6A5D', dark: '#9A9587' },
  '--dsw-alias-label-primary-foreground': { light: '#F2EFE2', dark: '#23211C' },
  '--dsw-alias-label-primary-inverted': { light: '#EFECDF', dark: '#201E1A' },
  // — markdown / code ------------------------------------------------------
  '--dsw-alias-markdown-citation': { light: '#DBD7C7', dark: '#2E2B25' },
  '--dsw-alias-markdown-code-block': { light: '#CFCBBB', dark: '#1B1915' },
  '--dsw-alias-markdown-code-block-banner': { light: '#C7C2B1', dark: '#26231F' },
  '--dsw-alias-markdown-code-segment-selected': { light: '#E6E3D4', dark: '#332F29' },
  '--dsw-alias-markdown-code-segment-unselected': { light: '#DBD7C7', dark: '#2E2B25' },
  '--dsw-alias-markdown-inline-code': { light: '#DBD7C7', dark: '#332F29' },
  '--dsw-alias-markdown-placeholder': { light: '#D2CEBE', dark: '#26231F' },
  '--dsw-alias-markdown-tag': { light: '#D2CEBE', dark: '#332F29' },
  // — scrollbars -----------------------------------------------------------
  '--dsw-alias-scrollbar-bg-l1': { light: '#C2BDAB', dark: '#3E3A33' },
  '--dsw-alias-scrollbar-bg-l2': { light: '#C2BDAB', dark: '#3E3A33' },
  '--dsw-alias-scrollbar-hover-l1': { light: '#A49E8C', dark: '#5A554B' },
  '--dsw-alias-scrollbar-hover-l2': { light: '#A49E8C', dark: '#5A554B' },
  // — status ---------------------------------------------------------------
  '--dsw-alias-state-business-primary': { light: '#B96A0F', dark: '#DE9A3C' },
  '--dsw-alias-state-business-tertiary': { light: '#EFDFBE', dark: '#40311B' },
  '--dsw-alias-state-error-primary': { light: '#B33927', dark: '#E4573C' },
  '--dsw-alias-state-error-secondary': { light: '#D94834', dark: '#F06A50' },
  '--dsw-alias-state-success-primary': { light: '#5C7A45', dark: '#8FAD63' },
  '--dsw-alias-state-success-secondary': { light: '#7FA45C', dark: '#A8C684' },
  '--dsw-alias-state-success-tertiary': { light: '#DCE4C8', dark: '#24301C' },
  '--dsw-alias-state-warn-label': { light: '#8F5F0F', dark: '#E0A94E' },
  '--dsw-alias-state-warn-primary': { light: '#C17B1A', dark: '#E58D28' },
  '--dsw-alias-state-warn-secondary': { light: '#E58D28', dark: '#C17B1A' },
  '--dsw-alias-state-warn-tertiary': { light: '#EFDFBE', dark: '#40311B' },
  // — floating chrome ------------------------------------------------------
  '--dsw-alias-toast-bg': { light: '#201D19', dark: '#0F0E0B' },
  '--dsw-alias-tooltip-bg': { light: '#201D19', dark: '#0F0E0B' },
  // — feature-specific surfaces ---------------------------------------------
  '--dsw-specific-bubble': { light: '#EFECDF', dark: '#2E2B25' },
  '--dsw-specific-bubble-highlight': { light: '#E2DED0', dark: '#39362F' },
  '--dsw-specific-input-major': { light: '#E8E5D6', dark: '#211F1A' },
  '--dsw-specific-login-input': { light: '#E2DED0', dark: '#211F1A' },
  '--dsw-specific-menu': { light: '#EFECDF', dark: '#332F29' },
  '--dsw-specific-selector': { light: '#E2DED0', dark: '#39362F' },
  '--dsw-specific-sidebar-fill': { light: '#C0BBA9', dark: '#1E1C18' },
  '--dsw-specific-sidebar-nav-item-active': { light: '#F0EDE0', dark: '#39362F' },
  '--dsw-specific-sidebar-nav-item-active-accent': { light: '#C17B1A', dark: '#E58D28' },
  '--dsw-specific-sidebar-nav-item-hover': { light: '#D6D2C2', dark: '#2B2823' },
  '--dsw-specific-tip': { light: '#E2DED0', dark: '#332F29' },
  // — fonts ----------------------------------------------------------------
  '--dsw-font-family': { light: UI_FONT, dark: UI_FONT },
  '--ds-font-family-code': { light: CODE_FONT, dark: CODE_FONT },
  // — typography gradients (used by the "thinking" fade) --------------------
  '--dsw-linear-gradient-think': {
    light: 'linear-gradient(180deg, #C9C5B4 20%, rgba(201, 197, 180, 0) 100%)',
    dark: 'linear-gradient(180deg, #23211C 20%, rgba(35, 33, 28, 0) 100%)'
  },
  '--dsw-linear-think-select': {
    light: 'linear-gradient(180deg, #DBD8CA 20%, rgba(219, 216, 202, 0) 100%)',
    dark: 'linear-gradient(180deg, #2B2823 20%, rgba(43, 40, 35, 0) 100%)'
  },
  // — shadows / blur / elevation: flat industrial rendering ------------------
  '--dsw-mask-blur': { light: 'blur(0px)', dark: 'blur(0px)' },
  '--dsw-shadow-lv1': { light: NO_SHADOW, dark: NO_SHADOW },
  '--dsw-shadow-lv1-blur': { light: NO_SHADOW, dark: NO_SHADOW },
  '--dsw-shadow-lv2': { light: NO_SHADOW, dark: NO_SHADOW },
  '--dsw-shadow-lv3': { light: NO_SHADOW, dark: NO_SHADOW },
  '--dsw-elevation-stroke-color': { light: 'rgba(63, 60, 54, 0.55)', dark: 'rgba(233, 229, 215, 0.4)' },
  '--dsw-elevation-stroke': { light: REGISTRATION_LINE, dark: REGISTRATION_LINE },
  '--dsw-elevation-panel': { light: REGISTRATION_LINE, dark: REGISTRATION_LINE },
  '--dsw-elevation-prominent': { light: REGISTRATION_LINE, dark: REGISTRATION_LINE },
  '--dsw-elevation-soft': { light: REGISTRATION_LINE, dark: REGISTRATION_LINE },
  // — syntax highlighting (Shiki), tuned for the sand/charcoal palettes -------
  '--shiki-foreground': { light: '#26231E', dark: '#E5E1D2' },
  '--shiki-background': { light: '#CFCBBB', dark: '#1B1915' },
  '--shiki-token-comment': { light: '#7A7465', dark: '#77705F' },
  '--shiki-token-constant': { light: '#8F5F0F', dark: '#E2B055' },
  '--shiki-token-string': { light: '#6F5A2F', dark: '#C8C2B0' },
  '--shiki-token-string-expression': { light: '#6F5A2F', dark: '#C8C2B0' },
  '--shiki-token-keyword': { light: '#7C1F12', dark: '#E4573C' },
  '--shiki-token-function': { light: '#403D36', dark: '#E9C98A' },
  '--shiki-token-parameter': { light: '#5C4A1E', dark: '#D9B27C' },
  '--shiki-token-punctuation': { light: '#5F5A4E', dark: '#8F8A7C' },
  '--shiki-token-link': { light: '#3C3933', dark: '#E5E1D2' }
};

/**
 * Strict geometric rules that CSS tokens alone cannot express (the shell hard
 * codes some radii/shadow literals). Applied as one extra stylesheet while the
 * plugin is mounted, scoped under a marker class so removal is instantaneous.
 */
export const YORHA_STRICT_CSS = `
body.dsh-plugin-yorha {
  --yorha-ink: #35322c;
  --yorha-ink-soft: rgba(53, 50, 44, 0.44);
  --yorha-paper: #c9c5b4;
  --yorha-paper-raised: #e8e4d6;
  --yorha-accent: #c17b1a;
  --yorha-grid: rgba(53, 50, 44, 0.055);
  --yorha-hatch: rgba(53, 50, 44, 0.095);
  letter-spacing: 0.012em;
}

body.dsh-plugin-yorha[data-ds-dark-theme] {
  --yorha-ink: #e9e5d6;
  --yorha-ink-soft: rgba(233, 229, 214, 0.34);
  --yorha-paper: #23211c;
  --yorha-paper-raised: #353129;
  --yorha-accent: #e58d28;
  --yorha-grid: rgba(233, 229, 214, 0.035);
  --yorha-hatch: rgba(233, 229, 214, 0.075);
}

body.dsh-plugin-yorha,
body.dsh-plugin-yorha *,
body.dsh-plugin-yorha *::before,
body.dsh-plugin-yorha *::after {
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Fine paper grain + terminal registration grid. */
body.dsh-plugin-yorha [class*="_frame"],
body.dsh-plugin-yorha [class*="_centerCol"],
body.dsh-plugin-yorha [class*="_scrollBody"] {
  background-image:
    radial-gradient(circle at 18% 24%, var(--yorha-grid) 0 0.7px, transparent 0.8px),
    radial-gradient(circle at 71% 63%, var(--yorha-grid) 0 0.65px, transparent 0.75px),
    linear-gradient(90deg, transparent 0 31px, var(--yorha-grid) 32px, transparent 33px),
    linear-gradient(0deg, transparent 0 31px, var(--yorha-grid) 32px, transparent 33px) !important;
  background-size: 19px 23px, 29px 31px, 32px 32px, 32px 32px !important;
}

/* Top registration rule: a persistent mechanical-system signature. */
body.dsh-plugin-yorha #root::before {
  content: '';
  position: fixed;
  z-index: 2147482000;
  inset: 0 0 auto;
  height: 6px;
  pointer-events: none;
  background:
    linear-gradient(90deg,
      var(--yorha-ink) 0 7%,
      transparent 7% 8%,
      var(--yorha-accent) 8% 18%,
      transparent 18% 18.5%,
      var(--yorha-ink) 18.5% 68%,
      transparent 68% 69%,
      var(--yorha-ink) 69% 91%,
      var(--yorha-accent) 91% 100%);
}

body.dsh-plugin-yorha .dsh-yorha-repository-link {
  position: fixed;
  z-index: 2147481999;
  right: 22px;
  bottom: 12px;
  color: var(--yorha-ink);
  font: 600 10px/1.4 var(--ds-font-family-code, monospace);
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

body.dsh-plugin-yorha .dsh-yorha-repository-link:hover,
body.dsh-plugin-yorha .dsh-yorha-repository-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Three-column chassis: hard dividers and an amber activity notch. */
body.dsh-plugin-yorha [class*="_sidebarCol"] {
  position: relative;
  border-right: 1px solid var(--yorha-ink-soft) !important;
  background-color: color-mix(in srgb, var(--dsw-specific-sidebar-fill) 94%, var(--yorha-paper-raised)) !important;
}

body.dsh-plugin-yorha [class*="_sidebarCol"]::after {
  content: '';
  position: absolute;
  z-index: 4;
  top: 92px;
  right: -2px;
  width: 3px;
  height: 76px;
  background: var(--yorha-accent);
}

body.dsh-plugin-yorha [class*="_detailsCol"] {
  border-left: 1px solid var(--yorha-ink-soft) !important;
}

body.dsh-plugin-yorha [class*="_logoRow"] {
  border-bottom: 1px solid var(--yorha-ink-soft);
}

/* Classic YoRHa navigation language for the workspace/session tree. */
body.dsh-plugin-yorha [class*="_sidebarCol"] {
  background-image:
    linear-gradient(90deg, transparent 0 calc(100% - 10px), var(--yorha-hatch) calc(100% - 10px) 100%),
    repeating-linear-gradient(0deg, transparent 0 23px, var(--yorha-grid) 23px 24px) !important;
}

body.dsh-plugin-yorha [class*="_sidebarCol"] button[class$="_newSession"] {
  border: 1px solid var(--yorha-ink-soft) !important;
  border-left: 5px solid var(--yorha-ink) !important;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--yorha-paper-raised) 86%, transparent), transparent) !important;
  font-weight: 600;
  letter-spacing: 0.06em;
}

body.dsh-plugin-yorha [class*="_sectionHeader"] {
  margin-top: 8px;
  padding-bottom: 9px !important;
  border-bottom: 3px double var(--yorha-ink-soft);
}

body.dsh-plugin-yorha [class*="_sectionHeader"]::before {
  content: '';
  width: 6px;
  height: 6px;
  margin-right: 7px;
  background: var(--yorha-accent);
  transform: rotate(45deg);
}

body.dsh-plugin-yorha [class*="_listArea"] {
  margin-top: 8px;
  padding: 5px 7px 12px 10px;
  border-left: 1px solid var(--yorha-ink-soft);
}

body.dsh-plugin-yorha [class*="_groupSection"] {
  position: relative;
  margin-bottom: 9px;
}

body.dsh-plugin-yorha [class*="_projectRow"] {
  position: relative;
  min-height: 34px;
  padding-left: 27px !important;
  border-top: 1px solid transparent;
  border-bottom: 1px solid var(--yorha-ink-soft);
  color: var(--yorha-ink);
  background: linear-gradient(90deg, var(--yorha-hatch), transparent 74%) !important;
  font-weight: 700;
  letter-spacing: 0.035em;
}

body.dsh-plugin-yorha [class*="_projectRow"]::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 50%;
  width: 7px;
  height: 7px;
  border: 1px solid var(--yorha-ink-soft);
  background: transparent;
  transform: translateY(-50%) rotate(45deg);
}

body.dsh-plugin-yorha [class*="_projectRow"][aria-expanded="true"] {
  border-top-color: var(--yorha-ink);
  border-bottom-color: var(--yorha-ink);
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--yorha-ink) 12%, transparent), transparent 76%) !important;
}

body.dsh-plugin-yorha [class*="_projectRow"][aria-expanded="true"]::before {
  border-color: var(--yorha-accent);
  background: var(--yorha-accent);
  animation: yorha-directory-confirm 120ms steps(2, end) both;
}

@keyframes yorha-directory-confirm {
  0% { background: transparent; border-color: var(--yorha-ink-soft); }
  100% { background: var(--yorha-accent); border-color: var(--yorha-accent); }
}

body.dsh-plugin-yorha [class*="_sessionRow"] {
  position: relative;
  min-height: 32px;
  margin: 2px 0 2px 17px;
  padding-left: 22px !important;
  border-left: 1px solid var(--yorha-ink-soft);
  color: var(--yorha-ink);
  letter-spacing: 0.02em;
}

body.dsh-plugin-yorha [class*="_sessionRow"]::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  width: 5px;
  height: 5px;
  border: 1px solid var(--yorha-ink-soft);
  transform: translateY(-50%);
}

body.dsh-plugin-yorha [class*="_sessionRow"]:hover {
  border-left-color: var(--yorha-accent);
  background: linear-gradient(90deg, color-mix(in srgb, var(--yorha-accent) 15%, transparent), transparent 82%) !important;
}

body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"] {
  padding-right: 13px !important;
  border-left: 5px solid var(--yorha-accent) !important;
  color: var(--yorha-paper-raised) !important;
  background: var(--yorha-ink) !important;
  clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%);
}

body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"] * {
  color: inherit !important;
}

body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"]::before {
  border-color: var(--yorha-accent);
  background: var(--yorha-accent);
}

/* One-shot target acquisition: the persistent left rail still identifies selection. */
body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"]::after {
  content: '';
  position: absolute;
  inset: auto 9px 1px 0;
  height: 1px;
  background: var(--yorha-accent);
  pointer-events: none;
  transform-origin: left center;
  animation: yorha-target-lock 140ms steps(5, end) both;
}

@keyframes yorha-target-lock {
  0% { transform: scaleX(0); opacity: 1; }
  80% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

body.dsh-plugin-yorha [class*="_triggerRow"] {
  border-top: 3px double var(--yorha-ink-soft);
  background: linear-gradient(90deg, var(--yorha-hatch), transparent) !important;
}

/* Central command seat. */
body.dsh-plugin-yorha [class*="_composerHero"] {
  position: relative;
}

body.dsh-plugin-yorha [class*="_composerHero"]::before {
  content: '';
  display: block;
  width: min(100%, 712px);
  margin: 0 auto 10px;
  border-bottom: 3px double var(--yorha-ink-soft);
}

body.dsh-plugin-yorha [class*="_headlineText"] {
  letter-spacing: 0.06em;
  text-shadow: 1px 1px 0 color-mix(in srgb, var(--yorha-paper) 65%, transparent);
}

/* Composer reads as a physical terminal panel rather than a floating card. */
body.dsh-plugin-yorha [class*="_composerStack"] [class*="_card"] {
  border: 1px solid var(--yorha-ink-soft) !important;
  border-top: 5px solid var(--yorha-ink) !important;
  background:
    linear-gradient(135deg, var(--yorha-hatch) 0 1px, transparent 1px 7px) 0 0 / 8px 8px,
    var(--dsw-specific-input-major) !important;
}

body.dsh-plugin-yorha [contenteditable="true"],
body.dsh-plugin-yorha textarea,
body.dsh-plugin-yorha input {
  font-family: var(--ds-font-family-code, monospace) !important;
  letter-spacing: 0.02em;
}

/* Controls and list rows gain the flat high-contrast feedback of the game UI. */
body.dsh-plugin-yorha button:not(:disabled):hover {
  color: var(--dsw-alias-label-primary) !important;
  background-color: color-mix(in srgb, var(--yorha-accent) 14%, transparent) !important;
  outline: 1px solid color-mix(in srgb, var(--yorha-accent) 72%, transparent);
  outline-offset: -1px;
}

body.dsh-plugin-yorha [role="dialog"],
body.dsh-plugin-yorha [role="menu"],
body.dsh-plugin-yorha [role="listbox"] {
  border: 1px solid var(--yorha-ink-soft) !important;
  border-top: 4px solid var(--yorha-ink) !important;
}

body.dsh-plugin-yorha hr {
  border: 0 !important;
  border-top: 3px double var(--yorha-ink-soft) !important;
}

body.dsh-plugin-yorha *:focus-visible {
  outline: 1px solid var(--dsw-alias-brand-primary-new-colorprimary-new-color);
  outline-offset: 1px;
}

body.dsh-plugin-yorha textarea,
body.dsh-plugin-yorha input,
body.dsh-plugin-yorha [contenteditable="true"] {
  caret-color: var(--dsw-alias-brand-primary-new-colorprimary-new-color);
}

body.dsh-plugin-yorha ::selection {
  background: var(--dsw-alias-brand-primary-new-colorprimary-new-color);
  color: var(--dsw-alias-label-primary-inverted);
}

@media (max-width: 900px) {
  body.dsh-plugin-yorha .dsh-yorha-repository-link,
  body.dsh-plugin-yorha [class*="_composerHero"]::before {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  body.dsh-plugin-yorha [class*="_projectRow"][aria-expanded="true"]::before {
    animation: none;
  }

  body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"]::after {
    display: none;
  }
}

@media print {
  body.dsh-plugin-yorha #root::before,
  body.dsh-plugin-yorha [class*="_sidebarCol"]::after,
  body.dsh-plugin-yorha [class*="_sessionRow"][aria-selected="true"]::after,
  body.dsh-plugin-yorha .dsh-yorha-repository-link {
    display: none !important;
  }

  body.dsh-plugin-yorha [class*="_frame"],
  body.dsh-plugin-yorha [class*="_centerCol"],
  body.dsh-plugin-yorha [class*="_scrollBody"],
  body.dsh-plugin-yorha [class*="_sidebarCol"] {
    background-image: none !important;
  }
}

`.trim();

/** Service surface this browser plugin requires (`theme` is the UI theme seat). */
export const inject = ['theme'];

/** Minimal structural view of the client-side theme service. */
interface ThemeService {
  /**
   * Stack a token override layer on top of the active theme.
   * @param source - layer identity (the façade pins it to this package id).
   * @param tokens - token-name → `{ light, dark }` value pairs.
   */
  overrideTokens(source: string, tokens: TokenOverrides): () => void;
}

/** Minimal structural view of the dynamic client cordis context. */
interface ClientCtx {
  effect(callback: () => (() => void) | void, label?: string): void;
  theme: ThemeService;
}

/** Marker class scoping the strict geometry stylesheet. */
const MARKER_CLASS = 'dsh-plugin-yorha';

interface DecorationMountState {
  references: number;
  style: HTMLStyleElement | null;
  repositoryLink: HTMLAnchorElement | null;
  readyListener: (() => void) | null;
  observer: MutationObserver | null;
}

/** Shared by every Cordis effect instance created from this browser module. */
const decorationMount: DecorationMountState = {
  references: 0,
  style: null,
  repositoryLink: null,
  readyListener: null,
  observer: null,
};

function cancelPendingDecorationMount(): void {
  if (typeof document !== 'undefined' && decorationMount.readyListener) {
    document.removeEventListener('DOMContentLoaded', decorationMount.readyListener);
  }
  decorationMount.readyListener = null;
  decorationMount.observer?.disconnect();
  decorationMount.observer = null;
}

function mountDecorations(): boolean {
  if (
    decorationMount.references === 0 ||
    typeof document === 'undefined' ||
    !document.head ||
    !document.body
  ) {
    return false;
  }

  if (!decorationMount.style) {
    const style = document.createElement('style');
    style.dataset.plugin = 'dsh-yorha-ui';
    style.dataset.pluginCss = 'dsh-yorha-ui/strict';
    style.textContent = YORHA_STRICT_CSS;
    document.head.appendChild(style);
    decorationMount.style = style;
  }

  if (!decorationMount.repositoryLink) {
    const repositoryLink = document.createElement('a');
    repositoryLink.className = 'dsh-yorha-repository-link';
    repositoryLink.href = REPOSITORY_URL;
    repositoryLink.ariaLabel = 'Open the dsh-yorha-ui source repository';
    repositoryLink.target = '_blank';
    repositoryLink.rel = 'noreferrer';
    repositoryLink.textContent = 'YoRHa // TACTICAL INTERFACE  11945';
    document.body.appendChild(repositoryLink);
    decorationMount.repositoryLink = repositoryLink;
  }

  document.body.classList.add(MARKER_CLASS);
  cancelPendingDecorationMount();
  return true;
}

function scheduleDecorationMount(): void {
  if (mountDecorations() || typeof document === 'undefined' || decorationMount.readyListener) return;

  const retry = () => {
    mountDecorations();
  };
  decorationMount.readyListener = retry;
  document.addEventListener('DOMContentLoaded', retry);

  if (document.documentElement && typeof MutationObserver !== 'undefined') {
    decorationMount.observer = new MutationObserver(retry);
    decorationMount.observer.observe(document.documentElement, { childList: true, subtree: true });
  }
}

function acquireDecorations(): () => void {
  decorationMount.references += 1;
  scheduleDecorationMount();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    decorationMount.references = Math.max(0, decorationMount.references - 1);
    if (decorationMount.references > 0) return;

    cancelPendingDecorationMount();
    decorationMount.repositoryLink?.remove();
    decorationMount.style?.remove();
    decorationMount.repositoryLink = null;
    decorationMount.style = null;
    if (typeof document !== 'undefined') document.body?.classList.remove(MARKER_CLASS);
  };
}

export function apply(ctx: ClientCtx): void {
  // 1. Color / typography / elevation layer through the theme registry.
  ctx.effect(
    () => ctx.theme.overrideTokens('yorha-palette', YORHA_TOKENS),
    'dsh-yorha-ui: YoRHa alias-token layer'
  );

  // 2. Strict geometric rules (radius 0, flat shadows, industrial focus).
  ctx.effect(acquireDecorations, 'dsh-yorha-ui: strict geometry stylesheet');

}
