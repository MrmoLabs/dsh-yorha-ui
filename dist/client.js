window.__ModuleLoader__.load({id:"dsh-yorha-ui",factory:(require)=>{var module={exports:{}};var exports=module.exports;"use strict";
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
 *  3. Rebrands the blank-session hero and the sidebar rail: registers YoRHa
 *     marks (traced from the fan-made YoRHaLogo vector — see the constants)
 *     into the `conversation.hero.brand.mark` / `sidebar.brand.mark` slots,
 *     and swaps the hero headline text for the YoRHa motto via a CSS
 *     `::after` substitution (the locale service forbids overriding
 *     registered dictionaries).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.inject = exports.YORHA_STRICT_CSS = exports.YORHA_TOKENS = void 0;
// `react` is a platform seed word: the host module table resolves this
// require to the shell's own React instance at runtime (build keeps it
// external — see scripts/build.mjs).
const react_1 = require("react");
/** Monospace stack used for data, timestamps, hashes and system logs. */
const CODE_FONT = "'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SF Mono', 'Menlo', 'DejaVu Sans Mono', monospace";
/** Terminal-flavoured UI face (latin glyphs). Remove this pair to keep the stock UI font. */
const UI_FONT = "'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'Segoe UI', system-ui, sans-serif";
/** Invisible box-shadow (used to neutralise elevation shadows without invalidating composed lists). */
const NO_SHADOW = '0 0 0 0 transparent';
/** Crisp 0.5px registration-line "elevation" used instead of soft shadows. */
const REGISTRATION_LINE = '0 0 0 0.5px var(--dsw-elevation-stroke-color)';
/** Public source repository opened from the fixed footer signature. */
const REPOSITORY_URL = 'https://github.com/MrmoLabs/dsh-yorha-ui';
/** Hero headline substitution: the YoRHa salute in the game's English spelling. */
const YORHA_MOTTO = 'FOR THE GLORY OF MANKIND';
/**
 * YoRHa full lockup (mark + YORHA letterforms) traced from the fan-made
 * vector at https://github.com/gigsoll/YoRHaLogo (`YORHA_clear.svg`, fills
 * recolored to `currentColor`). The tall viewBox centers the lockup so a
 * CSS rotateY reads as the Bunker-screen spin.
 */
const YORHA_EMBLEM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-33.6 -83.6 167.2 269.6" fill="currentColor" aria-hidden="true"><title>${YORHA_MOTTO}</title><path d="m 95.079985,132.58209 c -2.580343,-0.0109 -5.932081,1.26379 -6.148643,3.46421 2.777788,0.86585 5.612383,0.89795 8.288812,4.38776 1.936407,3.07299 2.406784,5.9612 2.251294,8.87982 -0.0688,5.23057 -0.64279,9.66102 -4.890141,9.56738 -0.20017,2.01928 0.225783,3.79605 3.118673,4.61677 2.475,0.46215 3.98241,-0.84066 3.44733,1.88774 -0.42914,1.29882 -1.12861,2.43437 -2.874755,3.72019 -2.22923,0.2332 -2.108006,-0.9213 -3.383256,-0.22531 -1.28246,0.7463 -0.932114,3.6478 0.526066,3.50211 2.88673,0.34831 5.530375,1.68364 5.756755,3.53312 0.80779,5.74277 2.18428,7.51541 3.56567,9.63765 0.0631,0.0917 0.16067,0.0892 0.23823,0.003 1.3814,-2.12225 2.75788,-3.89437 3.56568,-9.63714 0.22638,-1.84948 2.87002,-3.18533 5.75675,-3.53364 1.45818,0.14569 1.80853,-2.75581 0.52607,-3.50211 -1.27525,-0.69599 -1.15403,0.45851 -3.38326,0.22531 -1.74614,-1.28582 -2.44562,-2.42137 -2.87476,-3.72019 -0.53508,-2.7284 0.97233,-1.42559 3.44733,-1.88774 2.89289,-0.82072 3.31936,-2.59749 3.11919,-4.61677 -4.64516,0.83793 -4.82185,-4.3368 -4.89065,-9.56737 -0.15549,-2.91862 0.41754,-5.85816 2.52077,-8.84132 3.74153,-4.11861 5.84467,-3.26475 8.27598,-4.29742 -0.2475,-2.51477 -4.92551,-3.98869 -7.43572,-3.50004 -3.86828,0.86464 -7.24336,4.84153 -7.28379,6.86366 -0.0344,2.08813 -0.48499,3.30371 -1.45314,3.4339 -0.98141,-0.1166 -1.43766,-1.3346 -1.47226,-3.43648 -0.0404,-1.28677 -3.415517,-5.99902 -7.283797,-6.86366 -0.313777,-0.0611 -0.661808,-0.0915 -1.030428,-0.093 z"/><path d="m 104.85251,47.189368 c -5.024563,10.976357 -6.567578,23.469306 -7.102404,43.109513 -0.167668,6.157211 -0.184549,13.609469 -0.163814,20.520199 -6.22e-4,-0.002 -8.79e-4,-0.003 -0.0016,-0.005 -0.38648,0.89141 -1.512867,0.89354 -1.979207,-0.0279 -0.424903,-10.24105 -2.294059,-19.448855 -3.890719,-22.000205 -1.512018,2.373457 -2.911669,9.77615 -3.596679,16.441895 -0.0153,0.98578 -0.05049,1.42454 0.332279,1.81332 1.724557,1.28679 3.469553,0.75862 5.620846,6.64559 0.308855,3.00104 -0.317144,7.56663 -1.382862,7.58455 -1.368162,-0.30407 -2.225731,-0.92023 -4.483964,-1.15807 -1.834774,-0.11891 -1.509173,1.082 -1.099157,3.11506 0.273587,1.35658 1.560865,3.25691 3.431315,4.28087 1.908358,0.87316 4.092913,-1.15158 5.547465,-4.92114 0.423367,-1.03004 1.377627,-0.93634 1.468127,0.032 0.0075,-0.0655 0.197921,7.33443 0.197921,7.33443 3.283403,1.47161 4.760943,2.82973 6.360333,4.9289 0.49055,0.64384 1.06527,0.68894 1.72651,0 2.14892,-2.23895 4.14218,-3.72007 6.41253,-5.26324 0,0 0.0446,-2.95928 0.0873,-6.86057 0.0132,0.12056 0.0209,0.21952 0.0351,0.34417 0.0905,-0.96838 0.47796,-0.9539 1.14877,0 1.79082,3.14144 4.04528,5.26152 5.95364,4.38836 1.77528,-1.34754 2.86352,-3.01854 3.43183,-4.28036 0.49583,-1.10088 0.20232,-3.03347 -1.09967,-3.11557 -1.30198,-0.0821 -3.50315,1.39229 -4.77955,1.43609 -0.88382,0.0303 -2.16746,-5.05418 -1.37666,-7.80986 2.60695,-5.9746 4.30835,-5.37594 5.91023,-6.69778 0.38277,-0.38878 0.34758,-0.82807 0.33228,-1.81385 -0.68501,-6.66572 -2.08466,-14.068431 -3.59668,-16.441888 -1.59666,2.55135 -3.3335,11.466618 -4.18321,22.028628 -0.46634,0.92147 -1.63131,0.83615 -1.6862,0 -0.0102,0.14795 -0.11345,-14.414397 -0.38344,-21.266401 -0.50969,-14.192962 -1.25084,-31.349261 -7.19078,-42.341601 z m 0.81701,7.299296 c 0.20038,-0.01855 0.41636,0.08192 0.47852,0.377238 5.09413,24.787349 3.10209,33.823196 4.10776,73.692138 -1.32091,0.75336 -2.58475,1.64406 -3.65145,2.72594 -0.55852,0.47895 -1.48963,0.59285 -1.44023,-0.44804 l 0.11938,-75.867719 c 4.7e-4,-0.299888 0.18564,-0.461004 0.38602,-0.479557 z"/><path d="m 76.588393,21.344109 c -8.666286,21.554031 -8.401596,57.483924 -9.251115,83.196991 7.341572,2.02288 9.310543,6.63577 9.310543,6.63577 0,0 1.376075,-4.45447 9.092985,-6.30556 C 85.152515,79.17568 84.898354,42.734623 76.588393,21.344109 Z m 0.551905,9.08265 c 0.1902,0.0075 0.397931,0.157351 0.467155,0.427364 4.022837,15.691329 6.355607,41.586433 5.967594,71.525347 -2.156973,1.2823 -4.00076,2.90625 -5.903516,4.46588 -0.558518,0.47895 -0.943422,0.52464 -0.894002,-0.51625 V 30.854123 c 0,-0.299889 0.172569,-0.434833 0.362769,-0.427364 z"/><path d="m 133.50612,21.583608 c -8.66629,21.554031 -8.4016,57.483924 -9.25112,83.196992 7.34158,2.02288 9.31055,6.63577 9.31055,6.63577 0,0 1.37607,-4.45447 9.09298,-6.30556 -0.58829,-25.695631 -0.84245,-62.136688 -9.15241,-83.527202 z m 0.5519,9.08265 c 0.1902,0.0075 0.39794,0.157351 0.46716,0.427364 4.02284,15.691329 6.35561,41.586433 5.96759,71.525348 -2.15697,1.2823 -4.00076,2.90625 -5.90351,4.46588 -0.55852,0.47895 -0.94342,0.52464 -0.894,-0.51625 V 31.093622 c 0,-0.299889 0.17256,-0.434833 0.36276,-0.427364 z"/><path d="m 84.377279,108.53601 c -1.858524,0.0408 -3.786836,1.19991 -5.878195,4.96611 -0.624914,1.63998 -0.601964,4.63237 -2.048453,4.58576 -1.555201,-0.0226 -1.188505,-2.97202 -1.906861,-4.53615 -2.407259,-5.53199 -4.891616,-5.33888 -8.130253,-4.5372 -0.884604,0.28105 -4.709192,0.83968 -5.464782,7.0156 -0.03707,1.22861 -0.05107,1.67139 0.553971,1.66139 1.081827,-0.0161 1.623154,-0.63947 4.541325,-0.23512 3.319149,0.50574 5.924826,3.57795 6.986653,7.01714 0.224924,1.12316 -2.810261,2.78279 -3.057177,3.82199 0.778816,5.24871 0.703812,10.00606 10.82983,20.63957 -1.001687,2.5171 -3.76949,2.71609 -6.548955,9.36221 -0.812322,1.40418 0.245944,7.0992 5.735568,7.46828 1.066496,0.10774 4.933391,-1.36513 4.256071,-2.44584 -2.319526,-3.46466 -1.424222,-8.20131 0.02635,-10.17199 0.798246,-1.0021 1.436009,-0.61953 2.319239,-0.15296 2.468546,1.4889 4.939526,2.80936 7.366992,3.26285 0.739057,0.15281 1.530044,0.3475 1.937349,-0.9431 l 0.899687,-3.27163 c -5.541886,-2.68983 -16.712503,-6.24118 -21.120675,-20.86126 -0.57486,-1.48326 2.251115,-2.2965 2.78536,-0.13436 3.407153,10.45889 12.791084,16.15305 17.307988,17.38498 0.651892,0.19901 0.744672,-0.14599 0.764811,-0.68833 -0.06428,-1.48444 0.386738,-3.02817 -1.453141,-4.30774 -11.910041,-6.90695 -11.460599,-11.96595 -12.566675,-17.25735 -0.174976,-0.68841 -3.60263,-1.02323 -3.33313,-1.90686 1.442422,-3.83941 4.26831,-6.11816 6.186186,-6.56084 2.744112,-0.5349 4.678544,-0.23727 5.760371,-0.22117 0.605037,0.01 0.59104,-0.43331 0.553972,-1.66192 -0.75559,-6.17592 -4.580179,-6.73402 -5.464783,-7.01507 -0.607427,-0.17968 -1.219139,-0.2906 -1.838647,-0.27699 z"/><path d="m 125.46677,108.72482 c 1.85852,0.0408 3.78684,1.19991 5.8782,4.96611 0.62491,1.63998 0.60196,4.63237 2.04845,4.58576 1.5552,-0.0226 1.1885,-2.97202 1.90686,-4.53615 2.40726,-5.53199 4.89162,-5.33888 8.13025,-4.5372 0.88461,0.28105 4.7092,0.83968 5.46479,7.0156 0.0371,1.22861 0.0511,1.67139 -0.55397,1.66139 -1.08183,-0.0161 -1.62316,-0.63947 -4.54133,-0.23512 -3.31915,0.50574 -5.92483,3.57795 -6.98665,7.01714 -0.22493,1.12316 2.81026,2.78279 3.05717,3.82199 -0.77881,5.24871 -0.70381,10.00606 -10.82983,20.63957 1.00169,2.5171 3.76949,2.71609 6.54896,9.36221 0.81232,1.40418 -0.24595,7.0992 -5.73557,7.46828 -1.0665,0.10774 -4.93339,-1.36513 -4.25607,-2.44584 2.31952,-3.46466 1.42422,-8.20131 -0.0263,-10.17199 -0.79825,-1.0021 -1.43601,-0.61953 -2.31924,-0.15296 -2.46855,1.4889 -4.93953,2.80936 -7.36699,3.26285 -0.73906,0.15281 -1.53005,0.3475 -1.93735,-0.9431 l -0.89969,-3.27163 c 5.54189,-2.68983 16.7125,-6.24118 21.12068,-20.86126 0.57486,-1.48326 -2.25112,-2.2965 -2.78536,-0.13436 -3.40716,10.45889 -12.79109,16.15305 -17.30799,17.38498 -0.6519,0.19901 -0.74468,-0.14599 -0.76481,-0.68833 0.0643,-1.48444 -0.38674,-3.02817 1.45314,-4.30774 11.91004,-6.90695 11.4606,-11.96595 12.56667,-17.25735 0.17498,-0.68841 3.60263,-1.02323 3.33313,-1.90686 -1.44242,-3.83941 -4.26831,-6.11816 -6.18618,-6.56084 -2.74411,-0.5349 -4.67855,-0.23727 -5.76037,-0.22117 -0.60504,0.01 -0.59104,-0.43331 -0.55398,-1.66192 0.75559,-6.17592 4.58018,-6.73402 5.46479,-7.01507 0.60742,-0.17968 1.21914,-0.2906 1.83864,-0.27699 z"/><path d="m 55.129968,135.85631 5.17e-4,5.1e-4 c -0.982025,-0.0155 -2.071325,0.0628 -3.27887,0.25425 -2.976172,0.41131 -3.346134,3.17829 -3.398759,5.22759 -0.06537,2.54557 1.370459,7.5153 1.370459,7.5153 0.792032,3.39965 1.448603,5.84805 1.333252,8.77001 -0.681666,5.20523 -2.548261,6.09375 -4.12843,8.02587 l 0.128158,5.07721 -30.429667,10.53217 c -1.361441,0.4712 -1.656743,-0.0714 -0.238746,-0.89038 l 28.591537,-16.51373 c 3.449636,-2.32344 4.447454,-6.31866 3.384806,-11.71866 -0.861072,-3.42984 -2.910529,-7.35206 -2.694409,-10.09551 0.04756,-0.46422 -0.71585,-0.29549 -0.949296,0.10336 -2.32553,3.97322 -1.01196,7.05627 0.366386,11.54089 0.719586,3.3348 -1.518147,4.18369 -4.95422,2.28048 C 29.00907,164.81656 17.899177,175.84588 6.6755615,185.95092 21.206477,181.53011 35.927725,177.21829 49.42179,172.20499 l 0.717785,-3.05097 0.237712,-0.42788 c 6.133485,-0.003 12.042836,2.23423 16.19436,10.5916 0.6111,1.33291 -1.760315,2.58624 -6.960299,3.56619 -5.76851,16.4525 -10.988578,33.2498 -16.146818,49.60059 11.39395,-12.75136 30.903793,-34.67044 34.181893,-38.254 0.31003,-0.49214 0.561796,-1.27232 -0.497644,-3.04632 -1.116492,-3.81302 -0.276293,-4.74737 0.304891,-4.98006 10.296578,-2.99546 13.283406,-0.64875 18.80402,3.07268 4.47809,3.23715 -1.861253,6.92403 -2.938838,8.28683 3.820327,18.35137 6.492371,36.44418 11.582758,55.07778 l 11.40395,-54.65972 c -2.06442,-2.74522 -7.27234,-4.89399 -2.87114,-8.50749 8.89021,-6.23253 14.39502,-4.55227 18.71204,-3.41219 0,0 3.30464,1.02204 0.50022,5.28185 -1.05944,1.774 -0.80767,2.55418 -0.49764,3.04632 3.2781,3.58356 22.78794,25.50315 34.18189,38.25451 -5.15824,-16.35079 -10.25221,-32.69127 -16.02072,-49.14377 -3.59201,-0.90074 -6.95853,-1.74761 -7.33341,-3.54965 l 0.0284,-0.0171 c 1.23212,-5.85768 9.80758,-11.01471 15.96957,-11.40292 1.2285,1.18722 1.26848,2.52221 1.2945,4.08657 13.49406,5.0133 28.21532,9.32564 42.74623,13.74645 -10.78501,-10.56452 -22.66769,-20.67488 -33.55713,-29.98525 -3.79113,2.07029 -5.86138,1.51372 -5.1418,-1.82108 1.37835,-4.48462 2.5686,-8.07032 0.35553,-12.10727 -0.20492,-0.37379 -0.50456,-0.41301 -0.57464,-0.0444 -0.0943,5.05795 -5.92213,14.03644 -0.81081,17.85886 0.61421,0.422 5.43614,-2.28734 6.92775,-0.786 l 21.29844,18.89084 c 1.52127,1.34932 0.17418,1.22339 -0.71262,0.76171 l -25.62169,-13.33924 c -11.13284,-5.86729 -5.13791,-14.70749 -3.70934,-23.99336 -0.14966,-3.06062 -0.65357,-4.86331 -3.62975,-5.27462 -1.20754,-0.1914 -2.28616,-0.27359 -3.25148,-0.26406 -4.18305,0.0413 -6.23779,1.7996 -7.42694,3.80442 -0.15237,0.29155 2.31674,2.00232 2.87941,3.55327 1.15455,2.81359 2.40631,5.94369 1.00459,10.65981 -1.8584,6.25265 -6.17032,11.17175 -8.5788,14.04462 -4.95391,6.4936 -3.52773,13.99865 -2.29753,14.57844 2.38012,1.12174 7.26829,2.14147 7.26829,2.14147 1.50432,0.44318 1.60764,0.62096 1.83916,1.41749 3.5266,10.94633 10.63748,32.16053 10.73578,32.47863 0.30508,0.98736 -0.63027,0.87664 -0.87437,0.48266 -2.77387,-3.70102 -4.72987,-7.28302 -6.90759,-11.02258 -3.12981,-5.73728 -11.89711,-17.74353 -15.35978,-26.25835 -1.00872,-4.21893 -0.29578,-9.96313 1.13533,-12.22664 3.18384,-4.44943 8.79651,-10.80906 10.35492,-14.79341 1.50914,-4.24499 0.57971,-10.82567 -1.92133,-11.79825 -2.26488,-0.52957 -7.36378,0.67665 -7.26364,2.56315 0.0645,1.21554 0.41241,4.17675 0.0894,4.80436 -0.52389,1.24547 -0.76738,2.94629 -1.57199,3.73621 -0.88556,0.7292 -0.35308,1.8574 -0.14831,2.31303 0,0 2.90397,4.76608 -2.15388,9.89294 -6.70331,4.75793 -12.3765,-0.93741 -12.3765,-0.93741 l -4.98833,2.18384 0.2868,3.82148 c 0.10686,1.42213 -1.33245,3.12709 -3.27525,3.39514 -1.39397,0.1306 -3.22474,0.23084 -3.85506,2.78743 -1.27278,6.59136 -4.99498,11.81605 -4.95835,12.13207 0.0883,0.76221 4.72083,5.38834 7.06313,7.27759 0.55656,0.44891 1.04568,0.51367 0.73432,2.01538 l -8.22068,39.64823 c -0.14448,0.69683 -0.83909,1.20442 -0.83509,0 l 0.15606,-47.42243 c -3.34622,-3.98256 -5.316243,-8.71664 -6.344833,-13.78727 -0.63032,-2.55659 -2.461096,-2.65683 -3.855062,-2.78743 -1.942804,-0.26805 -3.236799,-0.99022 -3.587895,-2.37246 l 0.414962,-4.74442 -4.803841,-2.28358 c 0,0 -5.672679,5.69534 -12.375989,0.93741 -5.057852,-5.12686 -2.154391,-9.89293 -2.154391,-9.89293 0.204771,-0.45563 0.737246,-1.58384 -0.148311,-2.31304 -0.804608,-0.78992 -1.047592,-2.49074 -1.57148,-3.73621 -0.323056,-0.62761 0.02436,-3.5883 0.08888,-4.80384 0.100141,-1.8865 -4.998245,-3.09272 -7.263122,-2.56315 -2.50104,0.97258 -3.430982,7.55326 -1.921847,11.79825 1.558413,3.98435 7.171086,10.34346 10.354924,14.79289 0.729574,1.13741 2.446862,6.70136 1.800406,12.30468 -0.942193,4.5763 -0.43974,5.30338 1.288811,9.69553 0.41217,0.95762 0.879683,1.41141 -0.694532,3.03237 l -25.393798,29.2468 c -0.739685,0.85193 -1.312593,0.73678 -0.631486,-0.5054 9.090242,-16.57847 21.114468,-33.66318 22.965006,-41.88013 0.568231,-4.47919 -0.254,-8.8209 -3.391524,-12.93358 -4.018625,-4.38044 -7.304614,-10.07681 -9.251115,-14.87351 -1.053218,-4.80597 -0.14996,-7.84622 1.00459,-10.65981 0.63205,-1.29325 3.324269,-3.15734 3.171899,-3.44889 -1.189139,-2.00482 -3.436597,-3.83183 -7.692037,-3.89898 z"/></svg>`;
/**
 * YoRHa crest traced from the same source (mark-only paths, re-viewBoxed
 * to a 120-unit square). Used where the shell asks for a small square brand
 * mark (sidebar rail).
 */
const YORHA_CREST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 -10 120 120" fill="currentColor" aria-hidden="true"><title>YoRHa</title><path d="m 104.85251,47.189368 c -5.024563,10.976357 -6.567578,23.469306 -7.102404,43.109513 -0.167668,6.157211 -0.184549,13.609469 -0.163814,20.520199 -6.22e-4,-0.002 -8.79e-4,-0.003 -0.0016,-0.005 -0.38648,0.89141 -1.512867,0.89354 -1.979207,-0.0279 -0.424903,-10.24105 -2.294059,-19.448855 -3.890719,-22.000205 -1.512018,2.373457 -2.911669,9.77615 -3.596679,16.441895 -0.0153,0.98578 -0.05049,1.42454 0.332279,1.81332 1.724557,1.28679 3.469553,0.75862 5.620846,6.64559 0.308855,3.00104 -0.317144,7.56663 -1.382862,7.58455 -1.368162,-0.30407 -2.225731,-0.92023 -4.483964,-1.15807 -1.834774,-0.11891 -1.509173,1.082 -1.099157,3.11506 0.273587,1.35658 1.560865,3.25691 3.431315,4.28087 1.908358,0.87316 4.092913,-1.15158 5.547465,-4.92114 0.423367,-1.03004 1.377627,-0.93634 1.468127,0.032 0.0075,-0.0655 0.197921,7.33443 0.197921,7.33443 3.283403,1.47161 4.760943,2.82973 6.360333,4.9289 0.49055,0.64384 1.06527,0.68894 1.72651,0 2.14892,-2.23895 4.14218,-3.72007 6.41253,-5.26324 0,0 0.0446,-2.95928 0.0873,-6.86057 0.0132,0.12056 0.0209,0.21952 0.0351,0.34417 0.0905,-0.96838 0.47796,-0.9539 1.14877,0 1.79082,3.14144 4.04528,5.26152 5.95364,4.38836 1.77528,-1.34754 2.86352,-3.01854 3.43183,-4.28036 0.49583,-1.10088 0.20232,-3.03347 -1.09967,-3.11557 -1.30198,-0.0821 -3.50315,1.39229 -4.77955,1.43609 -0.88382,0.0303 -2.16746,-5.05418 -1.37666,-7.80986 2.60695,-5.9746 4.30835,-5.37594 5.91023,-6.69778 0.38277,-0.38878 0.34758,-0.82807 0.33228,-1.81385 -0.68501,-6.66572 -2.08466,-14.068431 -3.59668,-16.441888 -1.59666,2.55135 -3.3335,11.466618 -4.18321,22.028628 -0.46634,0.92147 -1.63131,0.83615 -1.6862,0 -0.0102,0.14795 -0.11345,-14.414397 -0.38344,-21.266401 -0.50969,-14.192962 -1.25084,-31.349261 -7.19078,-42.341601 z m 0.81701,7.299296 c 0.20038,-0.01855 0.41636,0.08192 0.47852,0.377238 5.09413,24.787349 3.10209,33.823196 4.10776,73.692138 -1.32091,0.75336 -2.58475,1.64406 -3.65145,2.72594 -0.55852,0.47895 -1.48963,0.59285 -1.44023,-0.44804 l 0.11938,-75.867719 c 4.7e-4,-0.299888 0.18564,-0.461004 0.38602,-0.479557 z"/><path d="m 76.588393,21.344109 c -8.666286,21.554031 -8.401596,57.483924 -9.251115,83.196991 7.341572,2.02288 9.310543,6.63577 9.310543,6.63577 0,0 1.376075,-4.45447 9.092985,-6.30556 C 85.152515,79.17568 84.898354,42.734623 76.588393,21.344109 Z m 0.551905,9.08265 c 0.1902,0.0075 0.397931,0.157351 0.467155,0.427364 4.022837,15.691329 6.355607,41.586433 5.967594,71.525347 -2.156973,1.2823 -4.00076,2.90625 -5.903516,4.46588 -0.558518,0.47895 -0.943422,0.52464 -0.894002,-0.51625 V 30.854123 c 0,-0.299889 0.172569,-0.434833 0.362769,-0.427364 z"/><path d="m 133.50612,21.583608 c -8.66629,21.554031 -8.4016,57.483924 -9.25112,83.196992 7.34158,2.02288 9.31055,6.63577 9.31055,6.63577 0,0 1.37607,-4.45447 9.09298,-6.30556 -0.58829,-25.695631 -0.84245,-62.136688 -9.15241,-83.527202 z m 0.5519,9.08265 c 0.1902,0.0075 0.39794,0.157351 0.46716,0.427364 4.02284,15.691329 6.35561,41.586433 5.96759,71.525348 -2.15697,1.2823 -4.00076,2.90625 -5.90351,4.46588 -0.55852,0.47895 -0.94342,0.52464 -0.894,-0.51625 V 31.093622 c 0,-0.299889 0.17256,-0.434833 0.36276,-0.427364 z"/><path d="m 84.377279,108.53601 c -1.858524,0.0408 -3.786836,1.19991 -5.878195,4.96611 -0.624914,1.63998 -0.601964,4.63237 -2.048453,4.58576 -1.555201,-0.0226 -1.188505,-2.97202 -1.906861,-4.53615 -2.407259,-5.53199 -4.891616,-5.33888 -8.130253,-4.5372 -0.884604,0.28105 -4.709192,0.83968 -5.464782,7.0156 -0.03707,1.22861 -0.05107,1.67139 0.553971,1.66139 1.081827,-0.0161 1.623154,-0.63947 4.541325,-0.23512 3.319149,0.50574 5.924826,3.57795 6.986653,7.01714 0.224924,1.12316 -2.810261,2.78279 -3.057177,3.82199 0.778816,5.24871 0.703812,10.00606 10.82983,20.63957 -1.001687,2.5171 -3.76949,2.71609 -6.548955,9.36221 -0.812322,1.40418 0.245944,7.0992 5.735568,7.46828 1.066496,0.10774 4.933391,-1.36513 4.256071,-2.44584 -2.319526,-3.46466 -1.424222,-8.20131 0.02635,-10.17199 0.798246,-1.0021 1.436009,-0.61953 2.319239,-0.15296 2.468546,1.4889 4.939526,2.80936 7.366992,3.26285 0.739057,0.15281 1.530044,0.3475 1.937349,-0.9431 l 0.899687,-3.27163 c -5.541886,-2.68983 -16.712503,-6.24118 -21.120675,-20.86126 -0.57486,-1.48326 2.251115,-2.2965 2.78536,-0.13436 3.407153,10.45889 12.791084,16.15305 17.307988,17.38498 0.651892,0.19901 0.744672,-0.14599 0.764811,-0.68833 -0.06428,-1.48444 0.386738,-3.02817 -1.453141,-4.30774 -11.910041,-6.90695 -11.460599,-11.96595 -12.566675,-17.25735 -0.174976,-0.68841 -3.60263,-1.02323 -3.33313,-1.90686 1.442422,-3.83941 4.26831,-6.11816 6.186186,-6.56084 2.744112,-0.5349 4.678544,-0.23727 5.760371,-0.22117 0.605037,0.01 0.59104,-0.43331 0.553972,-1.66192 -0.75559,-6.17592 -4.580179,-6.73402 -5.464783,-7.01507 -0.607427,-0.17968 -1.219139,-0.2906 -1.838647,-0.27699 z"/><path d="m 125.46677,108.72482 c 1.85852,0.0408 3.78684,1.19991 5.8782,4.96611 0.62491,1.63998 0.60196,4.63237 2.04845,4.58576 1.5552,-0.0226 1.1885,-2.97202 1.90686,-4.53615 2.40726,-5.53199 4.89162,-5.33888 8.13025,-4.5372 0.88461,0.28105 4.7092,0.83968 5.46479,7.0156 0.0371,1.22861 0.0511,1.67139 -0.55397,1.66139 -1.08183,-0.0161 -1.62316,-0.63947 -4.54133,-0.23512 -3.31915,0.50574 -5.92483,3.57795 -6.98665,7.01714 -0.22493,1.12316 2.81026,2.78279 3.05717,3.82199 -0.77881,5.24871 -0.70381,10.00606 -10.82983,20.63957 1.00169,2.5171 3.76949,2.71609 6.54896,9.36221 0.81232,1.40418 -0.24595,7.0992 -5.73557,7.46828 -1.0665,0.10774 -4.93339,-1.36513 -4.25607,-2.44584 2.31952,-3.46466 1.42422,-8.20131 -0.0263,-10.17199 -0.79825,-1.0021 -1.43601,-0.61953 -2.31924,-0.15296 -2.46855,1.4889 -4.93953,2.80936 -7.36699,3.26285 -0.73906,0.15281 -1.53005,0.3475 -1.93735,-0.9431 l -0.89969,-3.27163 c 5.54189,-2.68983 16.7125,-6.24118 21.12068,-20.86126 0.57486,-1.48326 -2.25112,-2.2965 -2.78536,-0.13436 -3.40716,10.45889 -12.79109,16.15305 -17.30799,17.38498 -0.6519,0.19901 -0.74468,-0.14599 -0.76481,-0.68833 0.0643,-1.48444 -0.38674,-3.02817 1.45314,-4.30774 11.91004,-6.90695 11.4606,-11.96595 12.56667,-17.25735 0.17498,-0.68841 3.60263,-1.02323 3.33313,-1.90686 -1.44242,-3.83941 -4.26831,-6.11816 -6.18618,-6.56084 -2.74411,-0.5349 -4.67855,-0.23727 -5.76037,-0.22117 -0.60504,0.01 -0.59104,-0.43331 -0.55398,-1.66192 0.75559,-6.17592 4.58018,-6.73402 5.46479,-7.01507 0.60742,-0.17968 1.21914,-0.2906 1.83864,-0.27699 z"/></svg>`;
/**
 * Full alias-layer override for the DeepSeek Harness Web shell.
 * Left column = light scheme, right column = `body[data-ds-dark-theme]`.
 */
exports.YORHA_TOKENS = {
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
exports.YORHA_STRICT_CSS = `
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
  color: var(--yorha-ink-soft);
  font: 600 9px/1.2 var(--ds-font-family-code, monospace);
  letter-spacing: 0.18em;
  text-decoration: none;
  text-transform: uppercase;
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

/* Blank-session hero rebrand — Bunker-screen layout: the row becomes a
   column (emblem on top, motto beneath, composer below via the host's own
   stack order). The headline span collapses to zero width (its text stays in
   the accessibility tree) and a ::after paints the YoRHa salute. Anchors are
   attribute-substring matches — never build-hashed class names. */
body.dsh-plugin-yorha [class*="_headline"] {
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  margin-bottom: 18px;
}

body.dsh-plugin-yorha [class*="_headline"] [class*="_titleGroup"] > span:first-child {
  display: inline-block;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
}

body.dsh-plugin-yorha [class*="_headline"] [class*="_titleGroup"] > span:first-child::after {
  /* Literal CSS: must stay byte-identical to YORHA_MOTTO (build does not interpolate). */
  content: 'FOR THE GLORY OF MANKIND';
  display: inline-block;
  font-family: var(--ds-font-family-code, monospace);
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  text-shadow: 1px 1px 0 color-mix(in srgb, var(--yorha-paper) 65%, transparent);
}

/* The YoRHa emblem arrives through the hero brand-mark slot; these rules
   size it up (the owner passes 34, CSS wins with !important) and run the
   Bunker-screen rotateY. transform-style + centered viewBox keep the spin
   about the emblem's own axis; honors reduced motion. */
body.dsh-plugin-yorha [class*="_headline"] .dsh-yorha-hero-mark {
  perspective: 640px;
}

body.dsh-plugin-yorha [class*="_headline"] .dsh-yorha-hero-mark svg {
  display: block;
  width: 104px !important;
  height: 104px !important;
  color: var(--dsw-alias-label-primary);
  opacity: 0.94;
  transform-style: preserve-3d;
  animation: dsh-yorha-emblem-spin 7s linear infinite;
}

@keyframes dsh-yorha-emblem-spin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  body.dsh-plugin-yorha [class*="_headline"] .dsh-yorha-hero-mark svg {
    animation: none;
  }
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

`.trim();
/** Service surface this browser plugin requires (`theme` = UI theme seat, `slots` = hero brand mark). */
exports.inject = ['theme', 'slots'];
/** Marker class scoping the strict geometry stylesheet. */
const MARKER_CLASS = 'dsh-plugin-yorha';
/** Shared by every Cordis effect instance created from this browser module. */
const decorationMount = {
    references: 0,
    style: null,
    repositoryLink: null,
    readyListener: null,
    observer: null,
};
function cancelPendingDecorationMount() {
    if (typeof document !== 'undefined' && decorationMount.readyListener) {
        document.removeEventListener('DOMContentLoaded', decorationMount.readyListener);
    }
    decorationMount.readyListener = null;
    decorationMount.observer?.disconnect();
    decorationMount.observer = null;
}
function mountDecorations() {
    if (decorationMount.references === 0 ||
        typeof document === 'undefined' ||
        !document.head ||
        !document.body) {
        return false;
    }
    if (!decorationMount.style) {
        const style = document.createElement('style');
        style.dataset.plugin = 'dsh-yorha-ui';
        style.dataset.pluginCss = 'dsh-yorha-ui/strict';
        style.textContent = exports.YORHA_STRICT_CSS;
        document.head.appendChild(style);
        decorationMount.style = style;
    }
    if (!decorationMount.repositoryLink) {
        const repositoryLink = document.createElement('a');
        repositoryLink.className = 'dsh-yorha-repository-link';
        repositoryLink.href = REPOSITORY_URL;
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
function scheduleDecorationMount() {
    if (mountDecorations() || typeof document === 'undefined' || decorationMount.readyListener)
        return;
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
function acquireDecorations() {
    decorationMount.references += 1;
    scheduleDecorationMount();
    let released = false;
    return () => {
        if (released)
            return;
        released = true;
        decorationMount.references = Math.max(0, decorationMount.references - 1);
        if (decorationMount.references > 0)
            return;
        cancelPendingDecorationMount();
        decorationMount.repositoryLink?.remove();
        decorationMount.style?.remove();
        decorationMount.repositoryLink = null;
        decorationMount.style = null;
        if (typeof document !== 'undefined')
            document.body?.classList.remove(MARKER_CLASS);
    };
}
function apply(ctx) {
    // 1. Color / typography / elevation layer through the theme registry.
    ctx.effect(() => ctx.theme.overrideTokens('yorha-palette', exports.YORHA_TOKENS), 'dsh-yorha-ui: YoRHa alias-token layer');
    // 2. Strict geometric rules (radius 0, flat shadows, industrial focus).
    ctx.effect(acquireDecorations, 'dsh-yorha-ui: strict geometry stylesheet');
    // 3. Blank-session hero brand mark: the YoRHa emblem replaces the whale.
    //    Do NOT pass `priority` — the browser-half facade assigns dynamic
    //    packages one lower than every shipped entry, so this registration
    //    shadows the official brand mark by contract (slot-catalog notes).
    //    React is a platform seed word, required as a module at runtime.
    ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register({ name: 'conversation.hero.brand.mark', id: 'dsh-yorha-ui' }, (props) => {
        const { size = 34, className } = props ?? {};
        const elementProps = {
            className: ['dsh-yorha-hero-mark', className].filter(Boolean).join(' '),
            // Rest size from the host; the hero CSS enlarges the emblem.
            dangerouslySetInnerHTML: {
                __html: YORHA_EMBLEM_SVG.replace('<svg ', `<svg width="${size}" height="${size}" `)
            }
        };
        return (0, react_1.createElement)('span', elementProps);
    }));
    // 4. Sidebar rail brand mark: the traced YoRHa crest at shell scale.
    ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.register({ name: 'sidebar.brand.mark', id: 'dsh-yorha-ui' }, (props) => {
        const { size = 24, className } = props ?? {};
        const elementProps = {
            className: ['dsh-yorha-sidebar-mark', className].filter(Boolean).join(' '),
            dangerouslySetInnerHTML: {
                __html: YORHA_CREST_SVG.replace('<svg ', `<svg width="${size}" height="${size}" `)
            }
        };
        return (0, react_1.createElement)('span', elementProps);
    }));
}
exports.apply = apply;
return module.exports;}});