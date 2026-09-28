# Architecture

How a 6.2.1 avatar is built. Behavior and option rules are in [api.md](./api.md) and [motion.md](./motion.md).

## Pipeline

`createAvatar` runs in this order:

1. **Resolve options.** Hash `seed`, fill any missing eyes, mouth, texture, and background, clamp `scale` and `size`, and decide whether texture and talk motion are on.
2. **Unique ids.** Rewrite `id` and `url(#id)` inside the chosen fragments so masks do not clash when several avatars share a page.
3. **Build layers.**
   - Background: a `120×120` rect, never scaled.
   - Texture: official fragment, or nothing.
   - Mouth: official fragment, grill rects wrapped per bar when animating, or a generated oscilloscope when `diagram` is animating.
   - Eyes: official fragment. When animating, `enhanceEyeSvg` wraps existing elements in motion groups.
4. **Optional face scale.** If `scale` is not `1`, wrap texture + mouth + eyes in `translate(60 60) scale(S) translate(-60 -60)`.
5. **Embed CSS** only when `animationVariant` is not `none`.
6. **Markers.** Empty groups `bn-av-*`, `bn-tex-anim`, and `bn-talk-anim` let `:has()` turn each channel on without extra stylesheet logic on the page.

Static output skips step 5 and skips the enhancer, the extra `.bn-eye-art` group, and the `transform-box` styles. Those styles are correct for keyframes and wrong for a resting comparison against DiceBear, because they put the art in a CSS transform formatting context.

## File map

| Path | Role |
|------|------|
| `src/createAvatar.js` | Factory, option resolution, mouth and texture builders, embedded CSS |
| `src/eyes/enhanceEyeSvg.js` | Per-eye wraps. One function per eye type, dispatched by name |
| `src/parts/index.js` | `PARTS`, `OPTION_NAMES`, `TRANSFORMS`. Fragments are the official paths |
| `src/parts/parts.json` | Same fragments as JSON, for tooling that does not import the module |
| `src/layer-map.json` | Machine-readable catalog: canvas, transforms, option names, speed scale, motion classes |
| `src/avatars/*.svg` | Checked-in samples from `npm run samples`. Safe to use as static assets |
| `dist/bottts-animated.js` | ESM bundle. One file, same named exports as the factory. This is `main` / `module`. |
| `dist/bottts-animated.min.js` | Minified IIFE. Global `BotttsAnimated`. This is the `jsdelivr`, `unpkg`, and `browser` entry. |
| `demo/index.html` | Generated gallery. Rebuild with `npm run demo` |
| `scripts/build-cdn.mjs` | Writes `dist/` for jsDelivr. Run with `npm run build` |
| `scripts/build-self-contained.mjs` | Bundles the factory with esbuild into that HTML file |
| `scripts/generate-samples.mjs` | Writes `src/avatars/` |

`layer-map.json` is a contract for integrators. The factory does not import it at runtime. If the two ever disagree, `createAvatar.js` and `src/parts/index.js` are the source of truth.

## Layer order inside the mask

```text
svg
  style          (only while animating)
  defs           view-box mask
  g[mask]
    g#bg         rect 120×120
    g[scale?]    omitted when scale is 1
      g#texture
      g#mouth
      g#eyes
  g.bn-av-*      speed marker
  g.bn-tex-anim  texture marker
  g.bn-talk-anim talk marker
```

The view-box mask clips texture overflow. Background color never moves with `scale`, so a close-up still fills the square.

## Why CSS lives in the SVG

An `<img src="data:image/svg+xml,...">` does not apply the host page’s styles to the image. Keyframes, `:has()` gates, and the reduced-motion media query have to travel with the markup. That is why `animationVariant: 'none'` omits the `<style>` block entirely instead of pausing it from outside.

Changing speed, talk, or texture motion means generating a new string. There is no runtime setter on an already-rendered data URL.

## Id prefix

`uidFromSeed` produces `bn-` plus a base-36 hash of the seed. `uniquifyIds` rewrites ids in the fragment before it is wrapped. Eva clips and the shade clip use that same prefix.

## What this package does not do

- It does not fetch DiceBear at runtime. Paths are vendored.
- It does not draw a body, antennae, or a full robot. The style is the neutral face on a square.
- It does not attach pointer tracking. Glance motion is the scripted look-around loop.
