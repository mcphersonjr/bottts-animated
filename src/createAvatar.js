/**
 * Bottts-Neutral Animated Avatar Library v6.2
 * © McPherson Media, LLC — animation layer (CSS-in-SVG).
 * Bottts art: Remix of "Bottts" (https://bottts.com/) by Pablo Stanley — free for personal and commercial use.
 * Style: DiceBear Bottts-Neutral — https://www.dicebear.com/styles/bottts-neutral/
 *
 * Usage:
 *   import { createAvatar } from './createAvatar.js';
 *   const svg = createAvatar({ seed: 'cedric', animationVariant: 'medium' });
 *
 * v6: Motion wraps EXISTING official paths only — no fabricated pupils/glints/lid bars.
 */

import { PARTS, OPTION_NAMES, TRANSFORMS } from './parts/index.js';
import { enhanceEyeSvg } from './eyes/enhanceEyeSvg.js';

export { OPTION_NAMES, TRANSFORMS, PARTS };

/** @typedef {'none'|'slowest'|'slower'|'slow'|'medium'|'fast'|'fastest'} AnimationVariant */

const SPEED_SCALE = {
  slowest: 1.35,
  slower: 1.25,
  slow: 1.15,
  medium: 1.0,
  fast: 0.9,
  fastest: 0.75,
};

const VALID_SPEEDS = new Set(Object.keys(SPEED_SCALE));

/** Deterministic PRNG (mulberry32) from string seed */
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function normalizeHex(color) {
  if (!color) return null;
  let c = String(color).trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(c)) {
    c = c.split('').map((ch) => ch + ch).join('');
  }
  if (/^[0-9a-fA-F]{6}$/.test(c)) return c.toLowerCase();
  return null;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


/** Clamp + format DiceBear-compatible scale (0–10, default 1). */
function resolveScale(value) {
  let n = Number(value);
  if (!Number.isFinite(n)) n = 1;
  if (n < 0) n = 0;
  if (n > 10) n = 10;
  // Trim float noise (DiceBear-style)
  return Math.round(n * 1e5) / 1e5;
}

/** Optional SVG width/height size (pixels). */
function resolveSize(value) {
  if (value == null || value === '') return null;
  let n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  n = Math.round(n);
  if (n < 1) n = 1;
  if (n > 4096) n = 4096;
  return n;
}

function uidFromSeed(seed) {
  return `bn-${hashSeed(String(seed)).toString(36)}`;
}

/** Rewrite mask/filter/clip ids inside a fragment so they are unique per avatar. */
function uniquifyIds(svgFragment, prefix) {
  const ids = new Set();
  svgFragment.replace(/\bid="([^"]+)"/g, (_, id) => {
    ids.add(id);
    return _;
  });
  let out = svgFragment;
  for (const id of ids) {
    const safe = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`id="${safe}"`, 'g'), `id="${prefix}-${id}"`);
    out = out.replace(new RegExp(`url\\(#${safe}\\)`, 'g'), `url(#${prefix}-${id})`);
  }
  return out;
}


/**
 * Opt-in: force solid paints on eye/mouth art (official shapes/colors kept). Texture untouched.
 * Default OFF since v6.2.1 so official fill-opacity / opacity (e.g. smile ~.6, eva ~.8) are preserved.
 */
function solidifyLayerArt(svg) {
  if (!svg) return svg;
  return String(svg)
    .replace(/\sfill-opacity=(["'])[^"']*\1/gi, ' fill-opacity="1"')
    .replace(/\sstroke-opacity=(["'])[^"']*\1/gi, ' stroke-opacity="1"')
    .replace(/(<(?:path|rect|circle|ellipse|polygon|polyline)\b[^>]*?)\sopacity=(["'])[^"']*\2/gi, '$1 opacity="1"')
    .replace(/\sstyle=(["'])([^"']*)\1/gi, (full, q, style) => {
      let s = style
        .replace(/(?:^|;)\s*fill-opacity\s*:\s*[^;]*/gi, ';fill-opacity:1')
        .replace(/(?:^|;)\s*stroke-opacity\s*:\s*[^;]*/gi, ';stroke-opacity:1')
        .replace(/(?:^|;)\s*opacity\s*:\s*[^;]*/gi, ';opacity:1')
        .replace(/^;+/, '')
        .replace(/;{2,}/g, ';');
      return ` style=${q}${s}${q}`;
    });
}

/**
 * Eye assembly: official SVG art enhanced with <g class> wraps only.
 * No fabricated pupils, glints, or bg-colored lid bars.
 */
function buildEyes(eyesName, uid, animating, solidify = false) {
  const raw = uniquifyIds(PARTS.eyes[eyesName] || PARTS.eyes.round, uid);
  // Static resting pose: official paths only — no motion wraps / bn-eye-art (fidelity vs DiceBear).
  let art = animating ? enhanceEyeSvg(eyesName, raw, uid) : raw;
  if (solidify) art = solidifyLayerArt(art);

  if (!animating) {
    return (
      `<g id="eyes" class="bn-eyes" data-eyes="${escapeAttr(eyesName)}" transform="${TRANSFORMS.eyes}">` +
      art +
      `</g>`
    );
  }

  return (
    `<g id="eyes" class="bn-eyes" data-eyes="${escapeAttr(eyesName)}" transform="${TRANSFORMS.eyes}">` +
    `<g class="bn-eye-art">${art}</g>` +
    `</g>`
  );
}

/** Oscilloscope mouth: bouncing bars + L→R travel. */
function buildDiagramMouth(uid) {
  const heights = [4, 9, 6, 12, 8, 14, 7, 11, 5, 13, 8, 10, 6, 12, 9, 7, 11, 5];
  const barW = 2.2;
  const gap = 1.0;
  const step = barW + gap;
  const startX = 8;
  const midY = 12;
  const clipId = `${uid}-wave-clip`;
  const strip = (offset) =>
    heights
      .map((h, i) => {
        const x = startX + (offset + i) * step;
        const y = midY - h / 2;
        const delay = (i * 0.08).toFixed(2);
        return (
          `<rect class="bn-wave-bar" data-bar="${offset + i}" x="${x.toFixed(1)}" y="${y}" ` +
          `width="${barW}" height="${h}" rx="1" fill="#4efac9" ` +
          `style="transform-box:fill-box;transform-origin:50% 50%;animation-delay:calc(var(--bn-t,1)*${delay}s)"/>`
        );
      })
      .join('');

  const travel = (heights.length * step).toFixed(1);

  return (
    `<rect width="68" height="24" rx="5" fill="#000000" fill-opacity=".2"/>` +
    `<rect width="60" height="16" rx="2" fill="#000000" fill-opacity=".8" x="4" y="4"/>` +
    `<defs><clipPath id="${clipId}"><rect x="6" y="5" width="56" height="14" rx="1"/></clipPath></defs>` +
    `<g clip-path="url(#${clipId})">` +
    `<g class="bn-wave" style="--bn-wave-travel:-${travel}px">` +
    strip(0) +
    strip(heights.length) +
    `</g>` +
    `</g>`
  );
}

/** Wrap grill bar rects for staggered pulse. */
function buildGrillMouth(mouthName) {
  const raw = PARTS.mouth[mouthName] || '';
  let i = 0;
  return raw.replace(/<rect\b[^>]*\/>/g, (rect) => {
    const delay = (i++ * 0.12).toFixed(2);
    return (
      `<g class="bn-mouth-bar" style="transform-box:fill-box;transform-origin:50% 50%;animation-delay:calc(var(--bn-t,1)*${delay}s)">` +
      rect +
      `</g>`
    );
  });
}

function buildMouth(mouthName, uid, animating, solidify = false) {
  let art;
  let extraClass = '';
  if (mouthName === 'diagram') {
    art = animating ? buildDiagramMouth(uid) : (PARTS.mouth.diagram || '');
    extraClass = ' bn-mouth-diagram';
  } else if (mouthName === 'grill01' || mouthName === 'grill02' || mouthName === 'grill03') {
    art = animating ? buildGrillMouth(mouthName) : (PARTS.mouth[mouthName] || '');
    extraClass = ' bn-mouth-grill';
  } else if (mouthName === 'bite') {
    art = PARTS.mouth.bite;
    extraClass = ' bn-mouth-bite';
  } else {
    art = uniquifyIds(PARTS.mouth[mouthName] || PARTS.mouth.smile01, uid);
    extraClass = ' bn-mouth-smile';
  }

  if (solidify) art = solidifyLayerArt(art);

  // Avoid transform-box / transform-origin on resting pose (can alter apparent size vs official SVG).
  const motionStyle = animating
    ? ' style="transform-origin:34px 12px;transform-box:fill-box"'
    : '';

  return (
    `<g id="mouth" transform="${TRANSFORMS.mouth}">` +
    `<g class="bn-mouth${extraClass}" data-mouth="${escapeAttr(mouthName)}"${motionStyle}>` +
    art +
    `</g>` +
    `</g>`
  );
}

function buildTexture(textureName, uid, animating) {
  if (!textureName || !PARTS.texture[textureName]) return '';
  const art = uniquifyIds(PARTS.texture[textureName], uid);
  const motionStyle = animating
    ? ' style="transform-origin:108.5px 69.9px;transform-box:fill-box"'
    : '';
  return (
    `<g id="texture" transform="${TRANSFORMS.texture}">` +
    `<g class="bn-texture"${motionStyle}>` +
    art +
    `</g>` +
    `</g>`
  );
}

function buildAnimationStyle(variant) {
  if (!variant || variant === 'none' || !VALID_SPEEDS.has(variant)) {
    return '';
  }
  const t = SPEED_SCALE[variant];
  return `<style>
svg:has(.bn-av-${variant}){--bn-t:${t};--bn-p:running}
@media (prefers-reduced-motion:no-preference){
/* Look-around: rest → ~2s glance burst → rest (pupils / eye-pair / sensor specular only) */
@keyframes bnLook{
  0%,28%{transform:translate(0px,0px)}
  32%{transform:translate(-2.8px,0.2px)}
  36%{transform:translate(0px,0px)}
  40%{transform:translate(2.8px,0.15px)}
  44%{transform:translate(0px,0px)}
  48%{transform:translate(0.25px,-1.8px)}
  52%{transform:translate(0px,0px)}
  56%,100%{transform:translate(0px,0px)}
}
@keyframes bnRoundBlink{
  0%,86%,100%{opacity:1;transform:scaleY(1)}
  89%{opacity:.15;transform:scaleY(.12)}
  91%{opacity:.1;transform:scaleY(.08)}
  93.5%{opacity:1;transform:scaleY(1)}
}
@keyframes bnCreamBlink{
  0%,88%,100%{opacity:1}
  90.5%{opacity:.45}
  92%{opacity:.35}
  94%{opacity:1}
}
@keyframes bnLedPulse{
  0%,100%{opacity:1}
  40%{opacity:.45}
  70%{opacity:.85}
}
@keyframes bnGlassBreathe{
  0%,100%{opacity:1}
  50%{opacity:.82}
}
@keyframes bnHiBreathe{
  0%,100%{opacity:1}
  50%{opacity:.55}
}
@keyframes bnEvaLeft{
  0%,100%{opacity:1;transform:translate(0px,0px)}
  22%{opacity:1;transform:translate(.7px,-.35px)}
  48%{opacity:1;transform:translate(-.4px,.25px)}
  70%{opacity:1;transform:translate(.25px,.15px)}
}
@keyframes bnEvaRight{
  0%,100%{opacity:1;transform:translate(0px,0px)}
  18%{opacity:1;transform:translate(-.55px,.3px)}
  44%{opacity:1;transform:translate(.65px,-.25px)}
  66%{opacity:1;transform:translate(-.2px,-.15px)}
}
@keyframes bnGlowPulse{
  0%,100%{opacity:1}
  50%{opacity:.35}
}
@keyframes bnRoboSlash{
  0%,100%{transform:translateX(0px)}
  40%{transform:translateX(-14px)}
  70%{transform:translateX(8px)}
}
@keyframes bnDiscBreathe{
  0%,100%{opacity:1}
  50%{opacity:.78}
}
@keyframes bnDizzyWiggle{
  0%,100%{transform:rotate(0deg)}
  25%{transform:rotate(-8deg)}
  50%{transform:rotate(6deg)}
  75%{transform:rotate(-4deg)}
}
@keyframes bnHappySquint{
  0%,100%{transform:scaleY(1)}
  40%{transform:scaleY(.82)}
  70%{transform:scaleY(.92)}
}
@keyframes bnHeartPulse{
  0%,100%{transform:scale(1) translateY(0px)}
  40%{transform:scale(1.07) translateY(-0.8px)}
  70%{transform:scale(.97) translateY(0.3px)}
}
@keyframes bnShadeScan{
  0%,100%{transform:translateX(0px);opacity:.85}
  45%{transform:translateX(28px);opacity:1}
  80%{transform:translateX(-6px);opacity:.7}
}
/* Talk: ~5s cycle — idle most of the time, one short chatter burst */
@keyframes bnMouthTalk{
  0%,68%,100%{transform:scaleY(1) translateY(0px)}
  72%{transform:scaleY(1.12) translateY(0.45px)}
  76%{transform:scaleY(0.92) translateY(-0.25px)}
  80%{transform:scaleY(1.14) translateY(0.5px)}
  84%{transform:scaleY(0.96) translateY(-0.15px)}
  88%{transform:scaleY(1.08) translateY(0.3px)}
  92%{transform:scaleY(1) translateY(0px)}
}
@keyframes bnMouthBiteTalk{
  0%,68%,100%{transform:scaleY(1) translateY(0px)}
  72%{transform:scaleY(1.16) translateY(0.7px)}
  76%{transform:scaleY(0.88) translateY(-0.35px)}
  80%{transform:scaleY(1.18) translateY(0.65px)}
  84%{transform:scaleY(0.92) translateY(-0.2px)}
  88%{transform:scaleY(1.1) translateY(0.35px)}
  92%{transform:scaleY(1) translateY(0px)}
}
@keyframes bnMouthBarTalk{
  0%,68%,100%{transform:scaleY(1)}
  72%{transform:scaleY(1.35)}
  76%{transform:scaleY(0.75)}
  80%{transform:scaleY(1.4)}
  84%{transform:scaleY(0.85)}
  88%{transform:scaleY(1.2)}
  92%{transform:scaleY(1)}
}
@keyframes bnWaveTalk{
  0%,68%,100%{transform:translateX(0px)}
  72%{transform:translateX(10px)}
  80%{transform:translateX(22px)}
  88%{transform:translateX(-4px)}
  92%{transform:translateX(0px)}
}
@keyframes bnWaveBarTalk{
  0%,68%,100%{transform:scaleY(.55)}
  72%{transform:scaleY(1.35)}
  76%{transform:scaleY(.45)}
  80%{transform:scaleY(1.4)}
  84%{transform:scaleY(.5)}
  88%{transform:scaleY(1.15)}
  92%{transform:scaleY(.55)}
}
@keyframes bnWaveBar{
  0%,100%{transform:scaleY(.55)}
  25%{transform:scaleY(1.45)}
  50%{transform:scaleY(.5)}
  75%{transform:scaleY(1.3)}
}
@keyframes bnWaveTravel{
  0%{transform:translateX(0px)}
  100%{transform:translateX(var(--bn-wave-travel,-57.6px))}
}
@keyframes bnTexDrift{
  0%,100%{transform:translate(0px,0px) scale(1);opacity:.38}
  25%{transform:translate(10px,-8px) scale(1.05);opacity:.82}
  50%{transform:translate(-9px,7px) scale(1.06);opacity:.42}
  75%{transform:translate(8px,9px) scale(1.04);opacity:.78}
}

.bn-look,.bn-pupil-art.bn-look,.bn-eye-pair.bn-look,.bn-sensor-spec.bn-look{
  animation:bnLook calc(var(--bn-t,1)*7s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-round-dot{
  transform-box:fill-box;
  transform-origin:50% 50%;
  animation:bnRoundBlink calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-cream-blink{
  animation:bnCreamBlink calc(var(--bn-t,1)*5.2s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-led-pulse{
  animation:bnLedPulse calc(var(--bn-t,1)*2.8s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-glass-breathe{
  animation:bnGlassBreathe calc(var(--bn-t,1)*4s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-hi-breathe{
  animation:bnHiBreathe calc(var(--bn-t,1)*3.2s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-eva-left{
  animation:bnEvaLeft calc(var(--bn-t,1)*5.2s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
  transform-box:fill-box;
  transform-origin:50% 50%;
}
.bn-eva-right{
  animation:bnEvaRight calc(var(--bn-t,1)*5.2s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
  transform-box:fill-box;
  transform-origin:50% 50%;
}
.bn-glow-pulse{
  animation:bnGlowPulse calc(var(--bn-t,1)*3s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-robo-slash{
  animation:bnRoboSlash calc(var(--bn-t,1)*4.5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-disc-breathe{
  animation:bnDiscBreathe calc(var(--bn-t,1)*3.4s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-dizzy-wiggle{
  animation:bnDizzyWiggle calc(var(--bn-t,1)*2.6s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-happy-squint{
  animation:bnHappySquint calc(var(--bn-t,1)*3.4s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-heart-pulse{
  animation:bnHeartPulse calc(var(--bn-t,1)*2.8s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-shade-scan{
  animation:bnShadeScan calc(var(--bn-t,1)*4.2s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
/* Talk gated by .bn-talk-anim (animateTalk) — ~5s cycle, one short burst */
svg:has(.bn-talk-anim) .bn-mouth-smile{
  animation:bnMouthTalk calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
svg:has(.bn-talk-anim) .bn-mouth-bite{
  animation:bnMouthBiteTalk calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
svg:has(.bn-talk-anim) .bn-mouth-grill .bn-mouth-bar{
  animation:bnMouthBarTalk calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
svg:has(.bn-talk-anim) .bn-mouth-diagram .bn-wave{
  animation:bnWaveTalk calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
svg:has(.bn-talk-anim) .bn-mouth-diagram .bn-wave-bar{
  animation:bnWaveBarTalk calc(var(--bn-t,1)*5s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
.bn-texture{opacity:.55}
svg:has(.bn-tex-anim) .bn-texture{
  animation:bnTexDrift calc(var(--bn-t,1)*10s) ease-in-out infinite;
  animation-play-state:var(--bn-p,paused);
}
}
@media (prefers-reduced-motion:reduce){
.bn-look,.bn-pupil-art,.bn-eye-pair,.bn-round-dot,.bn-cream-blink,
.bn-led-pulse,.bn-glass-breathe,.bn-hi-breathe,.bn-eva-left,.bn-eva-right,
.bn-glow-pulse,.bn-robo-slash,.bn-sensor-spec,.bn-sensor-led,.bn-disc-breathe,
.bn-dizzy-wiggle,.bn-happy-squint,.bn-heart-pulse,.bn-shade-scan,
.bn-mouth,.bn-mouth-bar,.bn-wave,.bn-wave-bar,.bn-texture{
  animation:none!important;transform:none
}
.bn-texture{opacity:.55}
}
</style>`;
}

function resolveOptions(options = {}) {
  const opts = { ...options };
  let seed = opts.seed;
  if (opts.randomize || seed == null || seed === '') {
    seed = `rnd-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
  seed = String(seed);
  const rng = mulberry32(hashSeed(seed));

  const eyesOpt = opts.eyes ?? opts.eye;
  const eyes =
    eyesOpt && OPTION_NAMES.eyes.includes(eyesOpt)
      ? eyesOpt
      : pick(rng, OPTION_NAMES.eyes);

  const mouth =
    opts.mouth && OPTION_NAMES.mouth.includes(opts.mouth)
      ? opts.mouth
      : pick(rng, OPTION_NAMES.mouth);

  let texture = opts.texture;
  if (texture === null || texture === false || texture === 'none') {
    texture = null;
  } else if (texture && OPTION_NAMES.texture.includes(texture)) {
    // keep
  } else if (texture === undefined) {
    texture = rng() < 0.5 ? pick(rng, OPTION_NAMES.texture) : null;
  } else {
    texture = pick(rng, OPTION_NAMES.texture);
  }

  let bg = normalizeHex(opts.backgroundColor ?? opts.background);
  if (!bg) {
    bg = pick(rng, OPTION_NAMES.backgroundColor);
  }

  let animationVariant = opts.animationVariant ?? opts.animationSpeed ?? opts.animationVariant;
  if (animationVariant == null || animationVariant === '' || animationVariant === false) {
    animationVariant = 'none';
  }
  animationVariant = String(animationVariant).toLowerCase();
  if (animationVariant !== 'none' && !VALID_SPEEDS.has(animationVariant)) {
    animationVariant = 'medium';
  }


  // Texture motion: default true whenever the avatar is animating; false freezes texture only.
  let animateTexture = opts.animateTexture;
  if (animateTexture === undefined || animateTexture === null) {
    animateTexture = animationVariant !== 'none';
  } else {
    animateTexture = Boolean(animateTexture);
  }
  if (animationVariant === 'none') animateTexture = false;

  // Talk burst: default true when animating; false keeps mouth static (eyes still move).
  let animateTalk = opts.animateTalk;
  if (animateTalk === undefined || animateTalk === null) {
    animateTalk = animationVariant !== 'none';
  } else {
    animateTalk = Boolean(animateTalk);
  }
  if (animationVariant === 'none') animateTalk = false;

  const scale = resolveScale(opts.scale);
  const size = resolveSize(opts.size);

  // Opt-in only: default false preserves official Bottts-Neutral fill-opacity / opacity.
  const solidifyLayerArtOpt = opts.solidifyLayerArt === true;

  return { seed, eyes, mouth, texture, backgroundColor: bg, animationVariant, animateTexture, animateTalk, scale, size, solidifyLayerArt: solidifyLayerArtOpt };
}

/**
 * Create a Bottts-Neutral SVG string (optionally with embedded CSS animation).
 * @param {object} [options]
 * @param {string} [options.seed]
 * @param {boolean} [options.randomize]
 * @param {string} [options.eyes]
 * @param {string} [options.mouth]
 * @param {string|null|false} [options.texture]
 * @param {string} [options.backgroundColor]
 * @param {AnimationVariant} [options.animationVariant='none']
 * @param {boolean} [options.animateTexture] - Texture drift when animating (default true if animationVariant !== 'none')
 * @param {boolean} [options.animateTalk] - Mouth talk burst ~every 5s when animating (default true)
 * @param {number} [options.scale=1] - DiceBear-compatible uniform face scale around canvas center (0–10); background stays full square
 * @param {number} [options.size] - Optional SVG width/height in px
 * @param {boolean} [options.solidifyLayerArt=false] - Opt-in: force eyes/mouth fill-opacity to 1 (default off — keep official translucency)
 * @returns {string} SVG markup
 */
export function createAvatar(options = {}) {
  const resolved = resolveOptions(options);
  const { seed, eyes, mouth, texture, backgroundColor, animationVariant, animateTexture, animateTalk, scale, size, solidifyLayerArt: solidify } = resolved;
  const uid = uidFromSeed(seed);
  const animating = animationVariant !== 'none';

  const style = buildAnimationStyle(animationVariant);
  const marker = animating ? `<g class="bn-av-${animationVariant}" opacity="0"/>` : '';
  const texMarker = animating && animateTexture ? `<g class="bn-tex-anim" opacity="0"/>` : '';
  const talkMarker = animating && animateTalk ? `<g class="bn-talk-anim" opacity="0"/>` : '';

  const bg = (
    `<g id="bg">` +
    `<rect width="120" height="120" x="0" y="0" fill="#${backgroundColor}"/>` +
    `</g>`
  );

  const textureLayer = buildTexture(texture, uid, animating);
  const mouthLayer = buildMouth(mouth, uid, animating, solidify);
  const eyesLayer = buildEyes(eyes, uid, animating, solidify);

  // DiceBear-style face scale around canvas center (60,60); background outside the group.
  let face = textureLayer + mouthLayer + eyesLayer;
  if (scale !== 1) {
    face =
      `<g transform="translate(60 60) scale(${scale}) translate(-60 -60)">` +
      face +
      `</g>`;
  }

  const sizeAttrs = size != null ? ` width="${size}" height="${size}"` : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"${sizeAttrs} fill="none" shape-rendering="auto" ` +
    `class="bottts-neutral-animated" ` +
    `data-seed="${escapeAttr(seed)}" data-eyes="${escapeAttr(eyes)}" data-mouth="${escapeAttr(mouth)}" ` +
    `data-texture="${escapeAttr(texture || '')}" data-bg="#${backgroundColor}" ` +
    `data-animation="${escapeAttr(animationVariant)}" data-animate-texture="${animateTexture ? 'true' : 'false'}" data-animate-talk="${animateTalk ? 'true' : 'false'}" ` +
    `data-scale="${scale}" data-motion="v6.2.1">` +
    `<!-- © McPherson Media, LLC — animation layer v6.2.1. Bottts art: Remix of Bottts by Pablo Stanley (bottts.com). -->` +
    `<title>Bottts-Neutral ${escapeAttr(eyes)} / ${escapeAttr(mouth)}</title>` +
    `<metadata>Remix of Bottts by Pablo Stanley — free for personal and commercial use. Animation © McPherson Media.</metadata>` +
    style +
    `<defs>` +
    `<mask id="${uid}-viewboxMask"><rect width="120" height="120" x="0" y="0" fill="#fff"/></mask>` +
    `</defs>` +
    `<g mask="url(#${uid}-viewboxMask)">` +
    bg +
    face +
    `</g>` +
    marker +
    texMarker +
    talkMarker +
    `</svg>`
  );
}

/** Convenience: data-URL for use in &lt;img src&gt; */
export function createAvatarDataUrl(options = {}) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatar(options))}`;
}

/** Alias used by some callers / docs */
export const createAvatarDataURL = createAvatarDataUrl;

export function listOptions() {
  return {
    ...OPTION_NAMES,
    animationVariant: ['none', ...Object.keys(SPEED_SCALE)],
    scale: { min: 0, max: 10, default: 1 },
    size: { min: 1, max: 4096, default: null },
  };
}

export default createAvatar;
