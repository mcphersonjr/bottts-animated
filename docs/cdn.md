# CDN

jsDelivr and unpkg serve this package with no install. The default file is the minified browser build.

| Field in `package.json` | File | Use |
|-------------------------|------|-----|
| `jsdelivr`, `unpkg`, `browser` | `dist/bottts-animated.min.js` | `<script>` tag. Global `BotttsAnimated` |
| `main`, `module` | `dist/bottts-animated.js` | `import { createAvatar } from '…'` |

Both files are one bundle, with a source map beside them. `npm run build` writes them. `prepublishOnly` runs that build before `npm publish`.

## npm

These URLs work after `@mcpherson-media/bottts-animated` is published as a **public** package. Scoped packages are private unless published with `--access public`. `publishConfig.access` is already `public`.

```html
<script src="https://cdn.jsdelivr.net/npm/@mcpherson-media/bottts-animated@6.2.1"></script>
<script>
  const url = BotttsAnimated.createAvatarDataUrl({
    seed: 'cedric',
    animationVariant: 'medium',
  });
</script>
```

The address with no filename serves `dist/bottts-animated.min.js`, because that is the `jsdelivr` field. jsDelivr reads `jsdelivr`, then `browser`, then `main`, and the value must include the `.js` extension.

```html
<script type="module">
  import { createAvatar, createAvatarDataUrl, listOptions } from 'https://cdn.jsdelivr.net/npm/@mcpherson-media/bottts-animated@6.2.1/dist/bottts-animated.js';
</script>
```

unpkg uses the same paths with `https://unpkg.com/@mcpherson-media/bottts-animated@6.2.1`.

Pin the version. `@6.2.1` is safe to cache. A floating `@latest` can change under you.

## GitHub

jsDelivr also serves a public GitHub repo. It does **not** pick a default file from `package.json` for GitHub URLs, so the path is required:

```text
https://cdn.jsdelivr.net/gh/OWNER/REPO@6.2.1/dist/bottts-animated.min.js
https://cdn.jsdelivr.net/gh/OWNER/REPO@6.2.1/dist/bottts-animated.js
```

`@6.2.1` resolves only when the repo has a semver tag. Tag this release `v6.2.1` (jsDelivr accepts the `v` prefix). Commit `dist/` on that tag. jsDelivr will not run the build for you.

Version ranges such as `@6` work for semver tags. A branch name works too (`@main`) and should stay off production pages.

Limits that already fit this repo: a GitHub file must be under 20 MB, and a package under 150 MB. HTML from the CDN is served as `text/plain`, so link people to `dist/` rather than expecting `demo/index.html` to render from jsDelivr.

## Globals on the minified build

`BotttsAnimated.createAvatar`  
`BotttsAnimated.createAvatarDataUrl`  
`BotttsAnimated.createAvatarDataURL`  
`BotttsAnimated.listOptions`  
`BotttsAnimated.OPTION_NAMES`  
`BotttsAnimated.TRANSFORMS`  
`BotttsAnimated.PARTS`

The ESM build has those as named exports. `createAvatar` is also the default export.

## Checklist before the URL goes live

1. `npm run build` and commit `dist/`, including the `.map` files.
2. Publish to npm with public access, **or** push the repo and tag `v6.2.1`.
3. Open the minified URL once. The response should be JavaScript, and `BotttsAnimated.createAvatar` should be a function.
