/**
 * Bottts-Neutral Animated v6 — eye SVG enhancer
 * © McPherson Media, LLC *
 * Wraps EXISTING DiceBear bottts-neutral paths only.
 * Never injects fabricated pupils, glints, or lid bars.
 */

/**
 * Parse top-level SVG elements from a fragment (no nested complexity beyond known parts).
 * Returns array of {tag, attrs, inner, full, selfClosing}.
 */
function splitTopLevel(svg) {
  const parts = [];
  const re = /<(circle|rect|path|g|defs)\b([^>]*)(\/>|>([\s\S]*?)<\/\1>)/g;
  let m;
  while ((m = re.exec(svg))) {
    const tag = m[1];
    const attrs = m[2];
    const selfClosing = m[3].startsWith('/');
    const inner = selfClosing ? '' : m[4] || '';
    parts.push({ tag, attrs, inner, full: m[0], selfClosing });
  }
  return parts;
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function hasFill(attrs, color) {
  const f = (attr(attrs, 'fill') || '').toLowerCase();
  return f === color.toLowerCase();
}

function wrap(className, content, extraStyle = '') {
  const st = extraStyle ? ` style="${extraStyle}"` : '';
  return `<g class="${className}"${st}>${content}</g>`;
}

/** round: two white circles → pair glance + soft blink */
function enhanceRound(raw) {
  const circles = raw.match(/<circle\b[^>]*\/>/g) || [];
  if (circles.length < 2) return wrap('bn-eye-pair bn-round-blink', raw);
  const left = wrap('bn-round-dot', circles[0]);
  const right = wrap('bn-round-dot', circles[1]);
  return wrap('bn-eye-pair bn-look', left + right);
}

/** bulging: cream sclera fixed; dark pupil path looks around */
function enhanceBulging(raw) {
  const parts = splitTopLevel(raw);
  let out = '';
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, '#000000')) {
      out += wrap('bn-pupil-art bn-look', p.full);
    } else if (p.tag === 'circle' && hasFill(p.attrs, '#f1eeda')) {
      out += wrap('bn-sclera bn-cream-blink', p.full);
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/** roundFrame02: cream fixed; dark pupil path looks around */
function enhanceRoundFrame02(raw) {
  const parts = splitTopLevel(raw);
  let out = '';
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, '#000000')) {
      out += wrap('bn-pupil-art bn-look', p.full);
    } else if (p.tag === 'circle' && hasFill(p.attrs, '#f1eeda')) {
      out += wrap('bn-sclera', p.full);
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/** roundFrame01: HUD LEDs (#f4f4f4) pulse; soft glass opacity */
function enhanceRoundFrame01(raw) {
  const parts = splitTopLevel(raw);
  let out = '';
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, '#f4f4f4')) {
      out += wrap('bn-led bn-led-pulse', p.full);
    } else if (p.tag === 'rect') {
      out += wrap('bn-glass bn-glass-breathe', p.full);
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/** frame1 / frame2: pulse LED + soft white highlight opacity */
function enhanceFrame(raw, ledColor) {
  const parts = splitTopLevel(raw);
  let out = '';
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, ledColor)) {
      out += wrap('bn-led bn-led-pulse', p.full);
    } else if (p.tag === 'path' && hasFill(p.attrs, '#ffffff')) {
      out += wrap('bn-frame-hi bn-hi-breathe', p.full);
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/**
 * eva (v6.1 natural): official blue panel path only — no CRT scan, pupils, glints, lid bars.
 * Split into L/R clips of the SAME path for asymmetric breathe + micro glance drift.
 */
function enhanceEva(raw, uid) {
  const parts = splitTopLevel(raw);
  let visor = '';
  let blue = '';
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, '#25a6f5')) {
      blue = p.full;
    } else {
      visor += p.full;
    }
  }
  if (!blue) return raw;
  const leftClip = `${uid}-eva-L`;
  const rightClip = `${uid}-eva-R`;
  return (
    visor +
    `<defs>` +
    `<clipPath id="${leftClip}"><rect x="0" y="0" width="52" height="48"/></clipPath>` +
    `<clipPath id="${rightClip}"><rect x="52" y="0" width="52" height="48"/></clipPath>` +
    `</defs>` +
    `<g class="bn-eva-panels">` +
    `<g class="bn-eva-panel bn-eva-left" clip-path="url(#${leftClip})">${blue}</g>` +
    `<g class="bn-eva-panel bn-eva-right" clip-path="url(#${rightClip})">${blue}</g>` +
    `</g>`
  );
}

/** glow: stagger opacity pulse on concentric rings */
function enhanceGlow(raw) {
  const circles = raw.match(/<circle\b[^>]*\/>/g) || [];
  if (!circles.length) return raw;
  // Pair by radius groups: outer→inner (r=15,12,6,3) × left/right
  let out = '';
  circles.forEach((c, i) => {
    const ring = Math.floor(i / 2); // 0..3
    out += wrap(`bn-glow-ring bn-glow-pulse bn-glow-r${ring}`, c, `animation-delay:calc(var(--bn-t,1)*${(ring * 0.18).toFixed(2)}s)`);
  });
  // Optional soft scan across glow band
  return out;
}

/** robocop: slide existing white slash paths inside mask */
function enhanceRobocop(raw) {
  // Structure: rect, <g mask=...><path .../></g>, <defs>...</defs>
  return raw.replace(
    /(<g\s+mask="[^"]+"\s*>)([\s\S]*?)(<\/g>)/,
    (_, open, inner, close) => {
      const wrapped = wrap(
        'bn-robo-slash',
        inner.trim(),
        'transform-box:fill-box;transform-origin:50% 50%'
      );
      return open + wrapped + close;
    }
  );
}

/** sensor: move existing specular; pulse LED; soft main disc */
function enhanceSensor(raw) {
  const parts = splitTopLevel(raw);
  let out = '';
  for (const p of parts) {
    if (p.tag === 'circle') {
      const r = attr(p.attrs, 'r');
      const fill = (attr(p.attrs, 'fill') || '').toLowerCase();
      if (r === '3' && fill === '#ffffff') {
        out += wrap('bn-sensor-spec bn-look', p.full);
      } else if (r === '2' && fill === '#ffffff') {
        out += wrap('bn-sensor-led bn-led-pulse', p.full);
      } else if (r === '16') {
        out += wrap('bn-sensor-disc bn-disc-breathe', p.full);
      } else {
        out += p.full;
      }
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/** dizzy: gentle rotate/wiggle of X marks */
function enhanceDizzy(raw) {
  return wrap(
    'bn-dizzy-wiggle',
    raw,
    'transform-box:fill-box;transform-origin:52px 24px'
  );
}

/** happy: soft squint = scaleY on stroke arcs */
function enhanceHappy(raw) {
  return wrap(
    'bn-happy-squint',
    raw,
    'transform-box:fill-box;transform-origin:52px 26px'
  );
}

/** hearts: gentle scale pulse / float */
function enhanceHearts(raw) {
  return wrap(
    'bn-heart-pulse',
    raw,
    'transform-box:fill-box;transform-origin:52px 22px'
  );
}

/** shade01: soft specular sweep of EXISTING white highlight, clipped to red lens */
function enhanceShade01(raw, uid) {
  const parts = splitTopLevel(raw);
  let out = '';
  const clipId = `${uid}-shade-clip`;
  for (const p of parts) {
    if (p.tag === 'path' && hasFill(p.attrs, '#ff3d3d')) {
      out += p.full;
      // clip using approximate red-lens bounds (matches art)
      out +=
        `<defs><clipPath id="${clipId}">` +
        `<path d="M87 14H17c-3.5 0-5 3-5 5v2c0 2 1.5 5 5 5h12c6 0 11.6 8 17 8h14c5.4 0 9-8 15-8h12c3.5 0 5-3 5-5v-2c0-2-1.5-5-5-5"/>` +
        `</clipPath></defs>`;
    } else if (p.tag === 'path' && hasFill(p.attrs, '#ffffff')) {
      out +=
        `<g clip-path="url(#${clipId})">` +
        wrap('bn-shade-scan', p.full, 'transform-box:fill-box;transform-origin:30px 20px') +
        `</g>`;
    } else {
      out += p.full;
    }
  }
  return out || raw;
}

/**
 * Enhance official eye SVG fragment for CSS-in-SVG animation.
 * @param {string} name - eye option name
 * @param {string} rawSvg - uniquified PARTS.eyes[name] fragment
 * @param {string} uid - avatar uid prefix
 * @returns {string} wrapped markup
 */
export function enhanceEyeSvg(name, rawSvg, uid) {
  const raw = rawSvg || '';
  switch (name) {
    case 'round':
      return enhanceRound(raw);
    case 'bulging':
      return enhanceBulging(raw);
    case 'roundFrame02':
      return enhanceRoundFrame02(raw);
    case 'roundFrame01':
      return enhanceRoundFrame01(raw);
    case 'frame1':
      return enhanceFrame(raw, '#8bddff');
    case 'frame2':
      return enhanceFrame(raw, '#5ef2b8');
    case 'eva':
      return enhanceEva(raw, uid);
    case 'glow':
      return enhanceGlow(raw);
    case 'robocop':
      return enhanceRobocop(raw);
    case 'sensor':
      return enhanceSensor(raw);
    case 'dizzy':
      return enhanceDizzy(raw);
    case 'happy':
      return enhanceHappy(raw);
    case 'hearts':
      return enhanceHearts(raw);
    case 'shade01':
      return enhanceShade01(raw, uid);
    default:
      return raw;
  }
}

export default enhanceEyeSvg;
