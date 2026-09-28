# API

The public surface is `src/createAvatar.js`. It has no runtime dependencies.

```js
import {
  createAvatar,
  createAvatarDataUrl,
  createAvatarDataURL, // alias of createAvatarDataUrl
  listOptions,
  OPTION_NAMES,
  TRANSFORMS,
  PARTS,
} from './src/createAvatar.js';

export default createAvatar; // default export is createAvatar
```

`package.json` exposes the same module as `"."` and `"./createAvatar"`.

## `createAvatar(options)`

Returns an SVG **string**. The canvas `viewBox` is `0 0 120 120`.

```js
const svg = createAvatar({
  seed: 'cedric',
  eyes: 'round',
  mouth: 'smile01',
  texture: 'dots',
  backgroundColor: '448ef4',
  animationVariant: 'medium',
  animateTexture: true,
  animateTalk: true,
  scale: 1.25,
  size: 96,
  solidifyLayerArt: false,
});
```

Omit every field and the factory still returns a valid avatar: it invents a seed, picks eyes, mouth, background, and sometimes a texture, and stays **static**.

### Options

| Option | Type | Default | Resolution |
|--------|------|---------|------------|
| `seed` | string | random if omitted, empty, or `randomize: true` | Hashed with mulberry32. The same seed and the same explicit options always produce the same face. |
| `randomize` | boolean | `false` | Forces a new random seed even if `seed` is set. |
| `eyes` | string | picked from the seed | Must be one of `OPTION_NAMES.eyes`. Unknown values fall back to a seeded pick. `eye` is accepted as an alias. |
| `mouth` | string | picked from the seed | Must be one of `OPTION_NAMES.mouth`. |
| `texture` | string, `null`, or `false` | 50% chance of a seeded texture when omitted | `null`, `false`, or `'none'` skip the layer. An unknown string is replaced with a seeded texture. |
| `backgroundColor` | string | seeded palette color | `#` is optional. 3-digit hex expands to 6. Invalid values fall back to the palette. `background` is an alias. |
| `animationVariant` | string | `'none'` | `none`, `slowest`, `slower`, `slow`, `medium`, `fast`, `fastest`. `false` or `''` mean static. Any other non-empty value becomes `medium`. `animationSpeed` is an alias. |
| `animateTexture` | boolean | `true` when animating | Ignored when `animationVariant` is `none`. `false` keeps the texture visible and still. |
| `animateTalk` | boolean | `true` when animating | Ignored when static. `false` keeps the mouth still while eyes (and texture, if enabled) still move. |
| `scale` | number | `1` | Clamped to `0–10` and rounded to 5 decimal places. Scales texture, mouth, and eyes around `(60, 60)`. The background rectangle stays `120×120`. `1.25` matches DiceBear Close Up. The scale group is omitted when the value is `1`. |
| `size` | number | unset | Positive pixel size, clamped to `1–4096`, written to the SVG `width` and `height` attributes. Omit it and the SVG sizes from CSS. |
| `solidifyLayerArt` | boolean | `false` | `true` forces eye and mouth `fill-opacity`, `stroke-opacity`, and element `opacity` to `1`. Leave it off to keep official translucency (smile about `.6`, eva visor about `.8`). |

Names and palettes are listed in [options.md](./options.md). Motion behavior is in [motion.md](./motion.md).

## `createAvatarDataUrl(options)`

Same options as `createAvatar`. Returns:

```text
data:image/svg+xml;charset=utf-8,<urlencoded svg>
```

Use it as an `<img src>`. CSS animations inside the SVG run without page JavaScript. `createAvatarDataURL` is the same function.

## `listOptions()`

Returns the catalogs plus the numeric ranges:

```js
{
  eyes: [/* 14 names */],
  mouth: [/* 9 names */],
  texture: [/* 8 names */],
  backgroundColor: [/* 24 hex strings, no # */],
  animationVariant: ['none', 'slowest', 'slower', 'slow', 'medium', 'fast', 'fastest'],
  scale: { min: 0, max: 10, default: 1 },
  size: { min: 1, max: 4096, default: null },
}
```

`OPTION_NAMES` is the eyes, mouth, texture, and background lists without animation or scale metadata.

## Other exports

| Export | Contents |
|--------|----------|
| `TRANSFORMS` | `{ eyes: 'translate(8 20)', mouth: 'translate(26 72)', texture: 'translate(-48.5 -9.9)' }` |
| `PARTS` | Raw SVG fragments keyed by layer and option name |

## SVG markers

Every avatar carries these attributes on the root `<svg>`:

| Attribute | Example |
|-----------|---------|
| `data-seed` | `cedric` |
| `data-eyes` | `round` |
| `data-mouth` | `smile01` |
| `data-texture` | `dots`, or empty when there is no texture |
| `data-bg` | `#448ef4` |
| `data-animation` | `medium` or `none` |
| `data-animate-texture` | `true` or `false` |
| `data-animate-talk` | `true` or `false` |
| `data-scale` | `1` or `1.25` |
| `data-motion` | `v6.2.1` |

Animated SVGs also include invisible marker groups that the embedded CSS selects with `:has()`:

| Marker | Present when |
|--------|----------------|
| `g.bn-av-{variant}` | `animationVariant` is not `none`. Sets `--bn-t` (the speed scale) and `--bn-p: running`. |
| `g.bn-tex-anim` | Animating and `animateTexture` is true |
| `g.bn-talk-anim` | Animating and `animateTalk` is true |

Mask, clip, and filter ids inside a fragment are prefixed with `bn-{hash}` so two avatars on one page do not collide.

## Speed scale

`animationVariant` multiplies keyframe durations through `--bn-t`:

| Value | `--bn-t` |
|-------|----------|
| `slowest` | 1.35 |
| `slower` | 1.25 |
| `slow` | 1.15 |
| `medium` | 1.0 |
| `fast` | 0.9 |
| `fastest` | 0.75 |

## Static versus animated markup

When `animationVariant` is `none`:

- Eye fragments are emitted as official paths. `enhanceEyeSvg` does not run.
- Mouth and texture groups do not get `transform-box` or `transform-origin`.
- No `<style>` block is embedded.

That keeps a resting avatar the same size and placement as the official art. See [architecture.md](./architecture.md).
