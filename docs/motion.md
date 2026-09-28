# Motion

Specification for version 6.2.1. Implementation lives in `src/eyes/enhanceEyeSvg.js` and the `<style>` block built by `createAvatar`.

Artwork credit: [ATTRIBUTION.md](../ATTRIBUTION.md).

## Rules

1. Animate parts that already exist in the Bottts-Neutral fragments.
2. Look-around is limited to art that already reads as something that can glance: dark pupils on `bulging` and `roundFrame02`, the white-circle pair on `round`, and the existing specular on `sensor`.
3. Most of a look cycle is rest. A glance lasts about two seconds, then the face rests again. The whole eye does not bounce.
4. Mouths stay idle until a short talk burst. `diagram` bars bounce and travel.
5. Textures drift gently and stay visible.
6. Keyframes are inside the SVG so an `<img>` can play them. `animationVariant: 'none'` embeds no motion CSS.
7. `prefers-reduced-motion: reduce` sets `animation: none` on every motion class.

Do not add pupil dots, white glint overlays, or background-colored eyelid bars. Do not put a CSS `transform` on a `<g>` that already has an SVG `transform="translate(...)"`. Motion classes sit on an inner group. The official translate stays on `#eyes`, `#mouth`, or `#texture`.

## Canvas

| Layer | Transform | Motion target |
|-------|-----------|----------------|
| `viewBox` | `0 0 120 120` | — |
| `#bg` | none | Never animated. Stays a full square when `scale` changes. |
| `#texture` | `translate(-48.5 -9.9)` | Inner `.bn-texture` |
| `#mouth` | `translate(26 72)` | Inner `.bn-mouth` |
| `#eyes` | `translate(8 20)` | Inner classes from `enhanceEyeSvg` |
| face scale | `translate(60 60) scale(S) translate(-60 -60)` | Wraps texture, mouth, and eyes only when `scale !== 1` |

The mouth translate stays `translate(26 72)` to match this package’s schema. Some DiceBear HTTP responses use `translate(22 68)` with different path coordinates. Absolute smile placement is equivalent.

## Per-eye classes

| Eyes | Classes | What moves |
|------|---------|------------|
| `round` | `.bn-eye-pair.bn-look`, `.bn-round-dot` | Pair translates. Dots blink with opacity and `scaleY`. |
| `bulging` | `.bn-pupil-art.bn-look`, `.bn-cream-blink` | Dark pupil path translates. Cream circles fade briefly. |
| `roundFrame02` | `.bn-pupil-art.bn-look` | Dark pupil path translates. Cream stays put. |
| `roundFrame01` | `.bn-led-pulse`, `.bn-glass-breathe` | `#f4f4f4` LEDs pulse. Frame opacity breathes. |
| `frame1`, `frame2` | `.bn-led-pulse`, `.bn-hi-breathe` | LED fill pulses (`#8bddff` or `#5ef2b8`). White highlight fades. |
| `eva` | `.bn-eva-left`, `.bn-eva-right` | The same blue panel path is clipped into left and right halves and drifts out of phase. |
| `glow` | `.bn-glow-pulse` | Concentric rings, delay stepped by ring index. |
| `robocop` | `.bn-robo-slash` | Existing white slash paths slide on X inside the visor mask. |
| `sensor` | `.bn-sensor-spec.bn-look`, `.bn-sensor-led`, `.bn-disc-breathe` | White specular (`r=3`) looks around. LED (`r=2`) pulses. Main disc (`r=16`) breathes. |
| `dizzy` | `.bn-dizzy-wiggle` | X-mark group rotates a few degrees. |
| `happy` | `.bn-happy-squint` | Arc group `scaleY`. |
| `hearts` | `.bn-heart-pulse` | Heart path scales and shifts up a fraction of a pixel. |
| `shade01` | `.bn-shade-scan` | Existing white specular translates inside a clip of the red lens. |

## Shared classes

| Class | Property | Used for |
|-------|----------|----------|
| `.bn-look` | `translate` | Glance burst |
| `.bn-mouth` / `.bn-mouth-smile` | `scaleY`, `translateY` | Smile and square talk |
| `.bn-mouth-bite` | `scaleY`, `translateY` | Bite talk |
| `.bn-mouth-bar` | `scaleY` | Grill talk |
| `.bn-wave` | `translateX` | Diagram travel during talk |
| `.bn-wave-bar` | `scaleY` | Diagram bar bounce |
| `.bn-texture` | `translate`, `scale`, `opacity` | Texture drift |
| `.bn-av-{speed}` | none | Empty marker so `:has()` can set `--bn-t` |

## Timings at `medium` (`--bn-t: 1`)

Durations below are multiplied by `--bn-t`. See the speed table in [api.md](./api.md).

### Look-around (`.bn-look`)

- Duration: 7s
- 0–28%: rest
- 28–56%: glance, about 2 seconds, max offset about ±2.8px
- 56–100%: rest

### Talk (`animateTalk`)

- Cycle: 5s
- Idle: 0–68% and 92–100%
- Burst: 68–92%, about one second
- Gate: `svg:has(.bn-talk-anim)`

Smile, square, and bite use scale chatter. Grills stagger bar `scaleY`. Diagram nudges the wave and bounces the bars during that same window. Diagram bars also have a continuous bounce (`bnWaveBar`) and a travel loop (`bnWaveTravel`) while the mouth is in its animated form.

### Texture (`.bn-texture`)

- Duration: 10s
- Travel about 8–10px
- Opacity swings between about 0.38 and 0.82
- Gate: `svg:has(.bn-tex-anim)`
- With the marker absent, texture opacity stays at 0.55 and does not animate

### Other loops (medium)

| Animation | Duration |
|-----------|----------|
| Round blink | 5s |
| Cream blink | 5.2s |
| LED pulse | 2.8s |
| Glass breathe | 4s |
| Highlight breathe | 3.2s |
| Eva panels | 5.2s |
| Glow pulse | 3s |
| Robocop slash | 4.5s |
| Sensor disc | 3.4s |
| Dizzy wiggle | 2.6s |
| Happy squint | 3.4s |
| Heart pulse | 2.8s |
| Shade sweep | 4.2s |

## Flags

| Flag | Omitted | `true` | `false` |
|------|---------|--------|---------|
| `animateTexture` | On when animating, off when static | Texture drift | Texture visible, no drift |
| `animateTalk` | On when animating, off when static | Mouth burst every cycle | Mouth still |

Both flags are forced off when `animationVariant` is `none`.

## Reduced motion

Inside `@media (prefers-reduced-motion: reduce)`, every motion class gets `animation: none !important` and `transform: none`. Keyframes themselves are only declared under `prefers-reduced-motion: no-preference`, so a reduced-motion user never receives the animated rules.

## Opacity

Eye and mouth fragments keep their official `fill-opacity` and `opacity`. `solidifyLayerArt: true` is an opt-in that rewrites those paints to `1`. Texture fills are never solidified.

Eva motion changes transform on the panel wraps. It does not rewrite the fragment’s own opacity.
