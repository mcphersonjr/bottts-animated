# Documentation

Reference for **Bottts-Neutral Animated** 6.2.1. Start with the [project README](../README.md) for install-free usage and the short option table. Use these pages when you need the full contract.

| Page | Read it when you need |
|------|------------------------|
| [API](./api.md) | Function signatures, option resolution, SVG data attributes |
| [Options](./options.md) | The official eyes, mouths, textures, and background palette |
| [Motion](./motion.md) | What each eye does, talk timing, texture drift, reduced motion |
| [Architecture](./architecture.md) | File map, layer order, and how CSS stays inside the SVG |
| [Demo](./demo.md) | Opening the gallery and regenerating it |
| [Integrating](./integrating.md) | `<img>`, inline SVG, and mobile WebView or native SVG |
| [Changelog](./changelog.md) | 6.2 and 6.2.1 behavior |

## Design rules

Motion is meant to look like the official DiceBear `bottts-neutral` face is alive.

- Use only paths already in `src/parts/`.
- Wrap those elements in `<g class="...">`. Do not inject extra pupils, specular dots, or eyelid bars.
- A still render (`animationVariant: 'none'`) and an animated render of the same seed share the same art. Only transforms and opacity differ while the animation is running.
- `prefers-reduced-motion: reduce` freezes motion.

Artwork credit and the animation copyright live in [ATTRIBUTION.md](../ATTRIBUTION.md).
