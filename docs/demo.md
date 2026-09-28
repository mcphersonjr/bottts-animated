# Demo and scripts

The gallery is `demo/index.html`. It is a single file: the factory is bundled into it, so the page does not import `src/` at runtime.

## Open it

From the repository root:

```bash
python3 -m http.server 8765
```

Then open [http://127.0.0.1:8765/demo/](http://127.0.0.1:8765/demo/).

Opening the file directly with `file://` also works. The page does not load images from the network.

## What the page shows

- **Random avatar.** A new seed and a new combination of options. The line under the button echoes the resolved options.
- **Speed.** `none` through `fastest`. `none` is fully static.
- **Animated / Static.** Static forces `animationVariant: 'none'` regardless of the speed menu.
- **Scale.** Slider from 0 to 2.5, number input from 0 to 10. Default is `1`. Preset `1.25` is the close-up. Scale applies to every card.
- **Animate texture / Animate talk.** Independent of each other. Both disable when the avatar is static.
- **Eyes.** All 14 eye types. Mouth stays `smile01`, skin stays `dots`, background stays `#448ef4`.
- **Mouths.** All 9 mouths. Eyes stay `round`, skin stays `dots`, background stays `#448ef4`.
- **Skin.** No texture, then all 8 texture overlays. Eyes stay `round`, mouth stays `smile01`, background stays `#448ef4`.

Every card in a section shares the seed `gallery`, so the only difference inside that section is the feature named in the heading.

## Rebuild the demo

The HTML is generated. After you change `src/createAvatar.js` or `src/eyes/enhanceEyeSvg.js`, rebuild:

```bash
npm install
npm run demo
```

`npm run demo` runs `scripts/build-self-contained.mjs`. It needs the `esbuild` devDependency, bundles `src/createAvatar.js` as an IIFE named `BotttsLib`, and writes `demo/index.html`.

Commit the rebuilt HTML when you change motion or the factory so the gallery matches the source.

Also run `npm run build` and commit `dist/`. That folder is the file jsDelivr serves. See [cdn.md](./cdn.md).

## Regenerate sample SVGs

```bash
npm run samples
```

That runs `scripts/generate-samples.mjs` and overwrites the nine files in `src/avatars/`. The seed and option list for those files is in [options.md](./options.md).

## Check the factory without a browser

```bash
node --input-type=module -e "import { createAvatar } from './src/createAvatar.js'; console.log(createAvatar({ seed:'cedric', animationVariant:'medium' }).slice(0,120))"
```

No install is required for that command. esbuild is only used to rebuild the demo.
