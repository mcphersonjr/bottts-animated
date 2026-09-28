# Changelog

Current release: **6.2.1**.

## 6.2.1

Official Bottts-Neutral translucency is preserved.

`solidifyLayerArt` still exists and still forces eye and mouth paints to full opacity, but it is **off unless you pass `true`**. Smile fills near `.6` and the eva visor near `.8` match the vendored fragments in both static and animated output.

Unchanged from 6.2: no fabricated pupils or glints, `scale` and `size`, and a static avatar that skips motion wraps.

`data-motion` on the SVG is `v6.2.1`.

## 6.2

### Resting size

6.1 still built the motion tree when `animationVariant` was `none`: enhancer wraps, an extra `.bn-eye-art` group, and `transform-box` / `transform-origin` on the mouth and texture. Those do not change path data, but they put the art in a CSS transform formatting context, so a side-by-side with a bare DiceBear SVG looked slightly off.

6.2 emits official fragments and the schema translates only, whenever the avatar is static.

### `scale` and `size`

- `scale` (`0–10`, default `1`) scales texture, mouth, and eyes around `(60, 60)`. The background stays `120×120`. Close-up is `1.25`. The scale group is omitted at `1`.
- `size` (`1–4096`) sets SVG `width` and `height` in pixels.

DiceBear’s HTTP API takes `scale` as a percent (`125`). This module takes the core unit (`1.25`).

### Talk

`animateTalk` is wired through the factory and the demo. The default is on while the avatar is animating.

## 6.0

Motion was rebuilt around official paths.

Removed:

- Highlight and glint overlays
- Fabricated dark pupil circles
- Bounce and background-colored eyelid bars on panel eyes

Look-around remained only where the art already has a pupil, a glancing pair, or a specular. `eva` uses asymmetric panel motion and does not draw a CRT scan.

## Earlier prototypes

Versions 2 through 5 were local demos while the motion model was still changing. They are not part of this tree. The factory, the sample SVGs, and `demo/index.html` are 6.2.1.
