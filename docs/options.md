# Options

Official Bottts-Neutral names, as shipped in `src/parts/` and `OPTION_NAMES`. Motion for each eye is summarized here and specified in [motion.md](./motion.md).

## Eyes

| Name | What you see | Motion while animating |
|------|----------------|------------------------|
| `round` | Two white circles | The pair glances, then each circle blinks with a short `scaleY` |
| `bulging` | Cream sclera and a dark pupil path | The pupil looks around. Cream blinks by opacity |
| `dizzy` | X marks | The marks wiggle a few degrees |
| `eva` | Dark visor with blue panels | Left and right panels drift independently. No scan line |
| `frame1` | Wide frame, cyan LEDs (`#8bddff`) | LEDs pulse. The white highlight breathes |
| `frame2` | Narrower frame, green LEDs (`#5ef2b8`) | Same pulse and highlight breathe as `frame1` |
| `glow` | Concentric white rings | Rings pulse opacity, staggered from outside in |
| `happy` | Stroke arcs at opacity `.8` | Soft squint via `scaleY` |
| `hearts` | Heart shapes | Gentle scale and float |
| `robocop` | Visor with white slash highlights | The existing slashes slide inside the visor mask |
| `roundFrame01` | Pill frame and light HUD LEDs (`#f4f4f4`) | LEDs pulse. The glass breathes |
| `roundFrame02` | Pill frame, cream sclera, dark pupils | Pupils look around. Sclera stays fixed |
| `sensor` | Disc, specular dot, small LED | Specular looks around, the LED pulses, the disc breathes |
| `shade01` | Red lens and a white specular path | The specular sweeps inside a clip of the lens |

## Mouths

| Name | Art | Motion when `animateTalk` is on |
|------|-----|----------------------------------|
| `smile01` | Small smile, fill about `.6` | Short `scaleY` chatter once per ~5s cycle |
| `smile02` | Wide smile with a teeth mask | Same smile chatter |
| `square01` | Short rounded bar | Same smile chatter |
| `square02` | Thin wide bar | Same smile chatter |
| `bite` | Open mouth with teeth | Stronger `scaleY` plus a small `translateY` |
| `grill01` | Five short bars | Each bar pulses `scaleY`, staggered |
| `grill02` | Four taller bars | Same staggered bar pulse |
| `grill03` | Framed slots | Same staggered bar pulse |
| `diagram` | Oscilloscope window | Official still art when static. While animating, the housing keeps the official opacities (outer `.2`, inner `.8`) and the mint bars bounce and travel, with one talk burst per cycle |

`diagram` is the one mouth whose **animated** markup is rebuilt (bars plus a clip) instead of only wrapping the official path. The static render uses the official `diagram` fragment.

## Textures

| Name | Character |
|------|-----------|
| `camo01` | Dark and light camo blobs |
| `camo02` | Alternate camo field |
| `circuits` | Trace lines and pads |
| `dirty01` | Grime along the edges |
| `dirty02` | Alternate grime |
| `dots` | Halftone dots |
| `grunge01` | Speckle field |
| `grunge02` | Sparse specks |

Textures are drawn larger than the square and placed with `translate(-48.5 -9.9)`, then clipped by the view-box mask. While `animateTexture` is on they drift, scale slightly, and fade. Official texture translucency is always kept.

Pass `texture: null`, `false`, or `'none'` for a flat background. If you omit `texture`, about half of seeds get one and half do not.

## Background colors

Hex strings without `#`. Any other valid 3- or 6-digit hex is accepted. An invalid color falls back to a seeded palette entry.

| | | | |
|--|--|--|--|
| `1499da` | `159fbf` | `15a2a9` | `15a594` |
| `15a876` | `40a843` | `448ef4` | `7681f5` |
| `7a9f12` | `879198` | `8f8f8f` | `978d87` |
| `9975ea` | `9b9312` | `b18911` | `b46bd6` |
| `c67c11` | `ca62bb` | `d95c9a` | `de6811` |
| `e25a75` | `e45e4d` | | |

## Sample combinations

Pre-rendered files in `src/avatars/` (regenerate with `npm run samples`):

| File | Seed | Eyes | Mouth | Texture | Background | Motion |
|------|------|------|-------|---------|------------|--------|
| `round-smile01.svg` | `cedric` | round | smile01 | dots | `448ef4` | medium |
| `bulging-grill01.svg` | `bulging` | bulging | grill01 | camo01 | `15a876` | medium |
| `glow-square01.svg` | `mcpherson` | glow | square01 | circuits | `9975ea` | medium |
| `roundFrame02-diagram.svg` | `bottts-v3` | roundFrame02 | diagram | grunge01 | `3949ab` | medium |
| `sensor-grill03.svg` | `sensor-bot` | sensor | grill03 | dirty01 | `546e7a` | medium |
| `eva-smile02-camo.svg` | `eva-camo` | eva | smile02 | camo02 | `1499da` | medium |
| `hearts-bite-dots.svg` | `hearts` | hearts | bite | dots | `e25a75` | medium |
| `robocop-grill02-none.svg` | `static-robo` | robocop | grill02 | none | `879198` | none |
| `robocop-scan.svg` | `robo-scan` | robocop | grill02 | none | `879198` | medium |

`3949ab` and `546e7a` are valid hex overrides. They are not in the default palette, which is why those two samples show that any 6-digit color works.
