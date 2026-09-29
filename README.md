# Bottts-Neutral Animated

Animated [Bottts-Neutral](https://www.dicebear.com/styles/bottts-neutral/) avatars. Robot eyes, a mouth, and an optional texture sit on a solid square. CSS keyframes live **inside the SVG**, so the motion plays in a plain `<img>` or CSS background — the same idea as [DiceBear Animated Avatars](https://www.dicebear.com/animated-avatars/).

Version **6.2.1** wraps the official DiceBear paths only. It does not add fabricated pupils, glints, or eyelid bars. Official `fill-opacity` and `opacity` are preserved.

Artwork is a remix of [Bottts](https://bottts.com/) by Pablo Stanley, free for personal and commercial use. The animation layer is © McPherson Media, LLC. See [ATTRIBUTION.md](./ATTRIBUTION.md).

## Quick start

Serve the folder and open the demo:

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/demo/
```

Generate an SVG from Node or the browser:

```js
import { createAvatar, createAvatarDataUrl } from './src/createAvatar.js';

const svg = createAvatar({
  seed: 'cedric',
  animationVariant: 'medium', // none | slowest | slower | slow | medium | fast | fastest
});

img.src = createAvatarDataUrl({ seed: 'cedric', animationVariant: 'medium' });
```

`animationVariant` defaults to `none` (a still image). Any other speed embeds the motion CSS.

## npm and jsDelivr

Install the package:

```bash
npm install @mcpherson-media/bottts-animated
```

```js
import { createAvatar, createAvatarDataUrl } from '@mcpherson-media/bottts-animated';
```

Or load 6.2.1 from jsDelivr with no install. This address is the minified browser build. `BotttsAnimated.createAvatar` and `BotttsAnimated.createAvatarDataUrl` are globals:

```html
<script src="https://cdn.jsdelivr.net/npm/@mcpherson-media/bottts-animated@6.2.1"></script>
<script>
  const svg = BotttsAnimated.createAvatar({
    seed: 'cedric',
    animationVariant: 'medium',
  });
</script>
```

ES module from the same package:

```html
<script type="module">
  import { createAvatar } from 'https://cdn.jsdelivr.net/npm/@mcpherson-media/bottts-animated@6.2.1/dist/bottts-animated.js';
</script>
```

The GitHub copy is the same file. That URL needs the full path:

```text
https://cdn.jsdelivr.net/gh/mcphersonjr/bottts-animated@6.2.1/dist/bottts-animated.min.js
```

Pin `@6.2.1`. unpkg uses `https://unpkg.com/@mcpherson-media/bottts-animated@6.2.1`. Details: [docs/cdn.md](./docs/cdn.md).

## What you can set

| Option | Role |
|--------|------|
| `seed` | Same string always picks the same face |
| `eyes` | One of 14 official eye types |
| `mouth` | One of 9 official mouths |
| `texture` | One of 8 textures, or `null` to skip |
| `backgroundColor` | Hex, with or without `#` |
| `animationVariant` | `none` or a speed from `slowest` to `fastest` |
| `animateTexture` | Drift the texture. Default on while animating |
| `animateTalk` | Short mouth burst about every 5 seconds. Default on while animating |
| `scale` | Face zoom around the canvas center, `0–10`, default `1`. Close-up is `1.25` |
| `size` | Optional SVG width and height in pixels |

Full option lists, return values, and data attributes: [docs/api.md](./docs/api.md).

## Documentation

The README is the entry point. The `docs/` directory is the reference.

| Doc | What it covers |
|-----|----------------|
| [docs/api.md](./docs/api.md) | `createAvatar`, data URLs, `listOptions`, resolution rules |
| [docs/options.md](./docs/options.md) | Every eye, mouth, texture, and background color |
| [docs/motion.md](./docs/motion.md) | Per-eye motion, talk, texture drift, reduced motion |
| [docs/architecture.md](./docs/architecture.md) | How an SVG is assembled and where each file lives |
| [docs/demo.md](./docs/demo.md) | The browser demo and the sample-generation scripts |
| [docs/cdn.md](./docs/cdn.md) | npm install, and the jsDelivr and unpkg URLs |
| [docs/integrating.md](./docs/integrating.md) | Web, data-URL, and React Native integration |
| [docs/changelog.md](./docs/changelog.md) | What changed in 6.2 and 6.2.1 |

## Project layout

```text
dist/bottts-animated.js  Browser bundles served by jsDelivr
src/createAvatar.js       SVG factory
src/eyes/enhanceEyeSvg.js Motion wraps around official eye paths
src/parts/                 Official Bottts-Neutral path fragments
src/avatars/               Sample SVGs generated from the factory
src/layer-map.json         Option catalog and layer contract
demo/index.html            Self-contained browser demo
scripts/                   Rebuild the demo or regenerate samples
docs/                      Reference documentation
ATTRIBUTION.md             Art credit and animation copyright
```

## License

Art: Bottts by Pablo Stanley — free for personal and commercial use.  
Animation layer: © McPherson Media, LLC.  
Details and the notice to keep when you ship: [ATTRIBUTION.md](./ATTRIBUTION.md).
