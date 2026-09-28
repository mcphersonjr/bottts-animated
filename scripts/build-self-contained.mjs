#!/usr/bin/env node
/**
 * Build the self-contained demo at demo/index.html (v6.2.1).
 * Random panel + eyes, mouths, and skin sections + animateTexture/Talk.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { buildSync } from 'esbuild';
import { OPTION_NAMES } from '../src/createAvatar.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const EYES = OPTION_NAMES.eyes;
const MOUTHS = OPTION_NAMES.mouth;
const SKINS = OPTION_NAMES.texture;

const bundle = buildSync({
  entryPoints: [join(root, 'src/createAvatar.js')],
  bundle: true,
  format: 'iife',
  globalName: 'BotttsLib',
  write: false,
  platform: 'browser',
}).outputFiles[0].text;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Bottts-Neutral Animated</title>
<style>
:root {
  --bg: #0f1419; --panel: #1a222c; --text: #e8eef4; --muted: #8b9aab;
  --accent: #448ef4; --border: #2a3542; --radius: 12px;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
}
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; color: var(--text);
  background: radial-gradient(1200px 600px at 20% -10%, #1a2a44 0%, var(--bg) 55%);
  line-height: 1.45;
}
header { padding: 1.5rem 1.25rem 0.5rem; max-width: 1200px; margin: 0 auto; }
header h1 { margin: 0 0 0.35rem; font-size: 1.45rem; font-weight: 650; }
header p { margin: 0; color: var(--muted); font-size: 0.95rem; max-width: 72ch; }
.badge {
  display: inline-block; margin-left: 0.4rem; padding: 0.1rem 0.45rem;
  font-size: 0.7rem; font-weight: 700; border-radius: 999px; background: #2a6df0; color: #fff;
}
.controls {
  display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: center;
  max-width: 1200px; margin: 1rem auto 0; padding: 0 1.25rem;
}
.controls label { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.9rem; color: var(--muted); }
.controls select, .controls button, .random-panel button, .controls input[type="number"] {
  background: var(--panel); color: var(--text); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.4rem 0.7rem; font: inherit; cursor: pointer;
}
.controls input[type="range"] { width: 140px; accent-color: var(--accent); cursor: pointer; }
.controls input[type="number"] { width: 4.5rem; cursor: text; }
.controls button.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.controls input[type="checkbox"] { width: 1rem; height: 1rem; accent-color: var(--accent); }
.scale-hint { font-size: 0.75rem; color: var(--muted); }
.scale-hint button {
  background: transparent; border: 1px dashed var(--border); color: var(--accent);
  border-radius: 6px; padding: 0.15rem 0.45rem; font: inherit; cursor: pointer; font-size: 0.75rem;
}
.random-panel {
  max-width: 1200px; margin: 1rem auto 0; padding: 1rem 1.25rem;
  display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;
  background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);
}
.random-panel .preview {
  width: 120px; height: 120px; border-radius: 16px; overflow: hidden; background: #0002;
}
.random-panel img { width: 120px; height: 120px; display: block; }
.random-panel .actions { display: flex; flex-direction: column; gap: 0.5rem; }
.random-meta { color: var(--muted); font-size: 0.8rem; font-family: ui-monospace, Menlo, monospace; }
main { max-width: 1200px; margin: 0 auto; padding: 1.25rem; }
h2.section-title {
  font-size: 0.8rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--muted); margin: 1.75rem 0 0.35rem;
}
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
.card {
  background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.75rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
}
.card .avatar-wrap { width: 120px; height: 120px; border-radius: 16px; overflow: hidden; background: #0002; }
.card img { width: 120px; height: 120px; display: block; }
.card .meta { font-size: 0.72rem; color: var(--muted); text-align: center; }
.card .meta strong { display: block; color: var(--text); font-size: 0.85rem; margin-bottom: 0.15rem; font-family: ui-monospace, Menlo, monospace; }
.section-lead { margin: -0.25rem 0 0.75rem; color: var(--muted); font-size: 0.85rem; }
.jump { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0 0 0.25rem; }
.jump a {
  color: var(--accent); text-decoration: none; font-size: 0.8rem; font-weight: 650;
  border: 1px solid var(--border); border-radius: 999px; padding: 0.2rem 0.65rem;
}
.notes { max-width: 1200px; margin: 0 auto; padding: 0 1.25rem 1rem; color: var(--muted); font-size: 0.85rem; }
footer { max-width: 1200px; margin: 0 auto; padding: 0.5rem 1.25rem 2rem; color: var(--muted); font-size: 0.8rem; }
code { font-size: 0.85em; }
</style>
</head>
<body>
<header>
  <h1>Bottts-Neutral Animated <span class="badge">v6.2.1</span></h1>
  <p>
    Official eyes, mouths, and skin textures. Each section changes one feature and holds the rest of the face still.
  </p>
</header>
<section class="random-panel" aria-label="Random avatar generator">
  <div class="preview"><img id="random-img" alt="Random Bottts avatar" width="120" height="120"/></div>
  <div class="actions">
    <button type="button" id="btn-random">Random avatar</button>
    <p class="random-meta" id="random-meta">Click Random for a new seed + options.</p>
  </div>
</section>
<div class="controls">
  <label>Speed
    <select id="speed">
      <option value="none">none</option>
      <option value="slowest">slowest</option>
      <option value="slower">slower</option>
      <option value="slow">slow</option>
      <option value="medium" selected>medium</option>
      <option value="fast">fast</option>
      <option value="fastest">fastest</option>
    </select>
  </label>
  <label>Compare
    <button type="button" id="btnAnim" class="active">Animated</button>
    <button type="button" id="btnStatic">Static</button>
  </label>
  <label title="Uniform face scale around canvas center (DiceBear core). Background stays full square.">
    Scale
    <input type="range" id="scaleRange" min="0" max="2.5" step="0.05" value="1"/>
    <input type="number" id="scaleNum" min="0" max="10" step="0.05" value="1"/>
  </label>
  <span class="scale-hint">
    <button type="button" id="btnScale1" title="Default">1</button>
    <button type="button" id="btnScale125" title="DiceBear Close Up">1.25 Close Up</button>
  </span>
  <label title="When off, texture stays put; eyes and mouth still animate">
    <input type="checkbox" id="animTex" checked/>
    Animate texture
  </label>
  <label title="When off, mouth stays still; eyes still animate">
    <input type="checkbox" id="animTalk" checked/>
    Animate talk
  </label>
</div>
<main>
  <nav class="jump" aria-label="Avatar sections">
    <a href="#eyes">Eyes</a>
    <a href="#mouths">Mouths</a>
    <a href="#skin">Skin</a>
  </nav>
  <section id="eyes">
    <h2 class="section-title">Eyes</h2>
    <p class="section-lead">Mouth <code>smile01</code> · skin <code>dots</code> · <code>#448ef4</code></p>
    <div class="grid" id="eyes-grid"></div>
  </section>
  <section id="mouths">
    <h2 class="section-title">Mouths</h2>
    <p class="section-lead">Eyes <code>round</code> · skin <code>dots</code> · <code>#448ef4</code></p>
    <div class="grid" id="mouths-grid"></div>
  </section>
  <section id="skin">
    <h2 class="section-title">Skin</h2>
    <p class="section-lead">Eyes <code>round</code> · mouth <code>smile01</code> · <code>#448ef4</code>. Skin is the texture overlay.</p>
    <div class="grid" id="skin-grid"></div>
  </section>
</main>
<div class="notes">
  <strong>v6.2.1:</strong>
  <ul>
    <li><code>scale</code> (0–10, default 1) — face content around (60,60); background stays a full square. Close Up = <code>1.25</code></li>
    <li><code>size</code> — optional SVG <code>width</code>/<code>height</code></li>
    <li>Resting pose (<code>animationVariant: 'none'</code>) skips motion wraps so size matches the official art</li>
    <li><code>animateTexture</code> / <code>animateTalk</code> — freeze texture or mouth independently</li>
    <li>Official eye and mouth translucency is preserved. Texture stays translucent.</li>
  </ul>
</div>
<footer>
  Animation layer © McPherson Media, LLC. Bottts art by Pablo Stanley (bottts.com) — free for personal and commercial use.
</footer>
<script>
${bundle}
const EYES = ${JSON.stringify(EYES)};
const MOUTHS = ${JSON.stringify(MOUTHS)};
const SKINS = ${JSON.stringify(SKINS)};
const BASE = { seed: 'gallery', eyes: 'round', mouth: 'smile01', texture: 'dots', backgroundColor: '448ef4' };
const eyesGrid = document.getElementById('eyes-grid');
const mouthsGrid = document.getElementById('mouths-grid');
const skinGrid = document.getElementById('skin-grid');
const speed = document.getElementById('speed');
const btnAnim = document.getElementById('btnAnim');
const btnStatic = document.getElementById('btnStatic');
const animTex = document.getElementById('animTex');
const animTalk = document.getElementById('animTalk');
const scaleRange = document.getElementById('scaleRange');
const scaleNum = document.getElementById('scaleNum');
const btnRandom = document.getElementById('btn-random');
const randomImg = document.getElementById('random-img');
const randomMeta = document.getElementById('random-meta');
let mode = 'anim';

function currentVariant() {
  return mode === 'static' ? 'none' : speed.value;
}
function currentAnimateTexture() {
  const v = currentVariant();
  return mode === 'anim' && v !== 'none' && animTex.checked;
}
function currentAnimateTalk() {
  const v = currentVariant();
  return mode === 'anim' && v !== 'none' && animTalk.checked;
}
function currentScale() {
  let n = Number(scaleNum.value);
  if (!Number.isFinite(n)) n = 1;
  if (n < 0) n = 0;
  if (n > 10) n = 10;
  return n;
}
function setScale(n, syncRange) {
  n = Math.max(0, Math.min(10, Number(n) || 0));
  scaleNum.value = String(n);
  if (syncRange !== false) {
    const rMax = Number(scaleRange.max);
    scaleRange.value = String(Math.max(0, Math.min(rMax, n)));
  }
  refresh();
}

function setMode(m) {
  mode = m;
  btnAnim.classList.toggle('active', m === 'anim');
  btnStatic.classList.toggle('active', m === 'static');
  const frozen = m === 'static' || speed.value === 'none';
  animTex.disabled = frozen;
  animTalk.disabled = frozen;
  render();
  if (window.__lastRandom) renderRandom(true);
}
btnAnim.addEventListener('click', () => setMode('anim'));
btnStatic.addEventListener('click', () => setMode('static'));

function fillGrid(grid, items, key) {
  const variant = currentVariant();
  const texAnim = currentAnimateTexture();
  const talkAnim = currentAnimateTalk();
  const scale = currentScale();
  grid.innerHTML = '';
  for (const name of items) {
    const opts = {
      ...BASE,
      animationVariant: variant,
      animateTexture: texAnim,
      animateTalk: talkAnim,
      scale,
    };
    opts[key] = name;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<div class="avatar-wrap"><img alt="'+name+'" width="120" height="120"/></div><div class="meta"><strong>'+name+'</strong></div>';
    card.querySelector('img').src = BotttsLib.createAvatarDataUrl(opts);
    grid.appendChild(card);
  }
}

function render() {
  fillGrid(eyesGrid, EYES, 'eyes');
  fillGrid(mouthsGrid, MOUTHS, 'mouth');
  fillGrid(skinGrid, ['none', ...SKINS], 'texture');
}

function renderRandom(keepSeed) {
  const variant = currentVariant();
  const texAnim = currentAnimateTexture();
  const talkAnim = currentAnimateTalk();
  const scale = currentScale();
  const opts = keepSeed && window.__lastRandom
    ? { ...window.__lastRandom, animationVariant: variant, animateTexture: texAnim, animateTalk: talkAnim, scale }
    : { randomize: true, animationVariant: variant, animateTexture: texAnim, animateTalk: talkAnim, scale };
  const svg = BotttsLib.createAvatar(opts);
  window.__lastRandom = keepSeed && window.__lastRandom
    ? { ...window.__lastRandom, animationVariant: variant, animateTexture: texAnim, animateTalk: talkAnim, scale }
    : {
        seed: (svg.match(/data-seed="([^"]*)"/)||[])[1],
        eyes: (svg.match(/data-eyes="([^"]*)"/)||[])[1],
        mouth: (svg.match(/data-mouth="([^"]*)"/)||[])[1],
        texture: (svg.match(/data-texture="([^"]*)"/)||[])[1] || null,
        backgroundColor: ((svg.match(/data-bg="#?([0-9a-fA-F]{6})"/)||[])[1]),
        animationVariant: variant,
        animateTexture: texAnim,
        animateTalk: talkAnim,
        scale,
      };
  if (window.__lastRandom.texture === '') window.__lastRandom.texture = null;
  randomImg.src = BotttsLib.createAvatarDataUrl(window.__lastRandom);
  const r = window.__lastRandom;
  randomMeta.textContent = 'seed:'+r.seed+' · eyes:'+r.eyes+' · mouth:'+r.mouth+' · tex:'+(r.texture || '—')+' · #'+r.backgroundColor+' · '+r.animationVariant+' · texAnim:'+(r.animateTexture ? 'on' : 'off')+' · talk:'+(r.animateTalk ? 'on' : 'off')+' · scale:'+r.scale;
}

function refresh() {
  const frozen = mode === 'static' || speed.value === 'none';
  animTex.disabled = frozen;
  animTalk.disabled = frozen;
  render();
  if (window.__lastRandom) renderRandom(true);
}

speed.addEventListener('change', refresh);
animTex.addEventListener('change', refresh);
animTalk.addEventListener('change', refresh);
scaleRange.addEventListener('input', () => setScale(scaleRange.value, false));
scaleNum.addEventListener('change', () => setScale(scaleNum.value, true));
document.getElementById('btnScale1').addEventListener('click', () => setScale(1, true));
document.getElementById('btnScale125').addEventListener('click', () => setScale(1.25, true));
btnRandom.addEventListener('click', () => renderRandom(false));
animTex.disabled = false;
animTalk.disabled = false;
render();
renderRandom(false);
</script>
</body>
</html>
`;

const outDir = join(root, 'demo');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'index.html');
writeFileSync(out, html);
console.log('wrote', out, `(${html.length} bytes)`);
