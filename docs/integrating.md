# Integrating

Use `createAvatar` wherever you can run the module. Use a data URL or a file from `src/avatars/` when you only need to display the result. For a page that should not install the package, use the [CDN build](./cdn.md).

## Web

### Image

```js
import { createAvatarDataUrl } from './src/createAvatar.js';

const img = document.querySelector('#avatar');
img.src = createAvatarDataUrl({
  seed: userId,
  animationVariant: 'medium',
});
```

```html
<img id="avatar" width="96" height="96" alt="" />
```

Motion runs inside the image. The host page does not need a stylesheet for it. Set `animationVariant: 'none'` for lists where motion would be noisy.

To change speed or freeze talk, call `createAvatarDataUrl` again and replace `img.src`.

### Inline SVG

```js
host.innerHTML = createAvatar({
  seed: userId,
  animationVariant: 'slow',
  animateTexture: false,
});
```

Inline SVG uses the same embedded CSS. Prefer this when the avatar must inherit page text alternatives (`<title>` is already set) or sit in a button. Prefer a data URL when you want the avatar isolated from page CSS.

### CSS background

```css
.avatar {
  width: 96px;
  height: 96px;
  background: center / contain no-repeat;
}
```

```js
el.style.backgroundImage = `url("${createAvatarDataUrl({ seed, animationVariant: 'medium' })}")`;
```

### Sizing

- Leave `size` unset and set width and height in CSS. The `viewBox` keeps the square sharp.
- Or pass `size: 96` to write SVG `width` and `height` attributes.
- `scale` zooms the face inside the square. It does not change the element’s layout size. `1.25` is the close-up.

### Accessibility

The SVG sets a `<title>` from the eye and mouth names. Give the `<img>` its own `alt` when the avatar stands in for a person (`alt=""` when it is decorative).

`prefers-reduced-motion: reduce` freezes the keyframes. You do not need a second code path for that on the web. If you also want a user setting inside the app, generate the avatar with `animationVariant: 'none'`.

## React

```jsx
import { createAvatarDataUrl } from './src/createAvatar.js';

export function Avatar({ seed, animated }) {
  const src = createAvatarDataUrl({
    seed,
    animationVariant: animated ? 'medium' : 'none',
  });
  return <img src={src} width={96} height={96} alt="" />;
}
```

Memoize on `seed` and the options you pass. A new options object with the same values still produces the same URL, but rebuilding the string on every render is wasted work for large lists.

## React Native

Two approaches match this package. Pick one per surface.

### WebView or data-URL SVG

1. Run `createAvatar` in JavaScript (on device, or ahead of time).
2. Show the SVG in a WebView, or as `data:image/svg+xml,...` where that platform animates SVG CSS.
3. Changing `animationVariant`, `animateTexture`, or `animateTalk` means generating a new string and reloading the source.

This is the path that matches the browser demo. Confirm CSS-in-SVG on the Android WebView versions you support. iOS WKWebView generally runs these keyframes.

### `react-native-svg` and Reanimated

1. Take layers from the factory output, or follow [architecture.md](./architecture.md) and `src/layer-map.json`.
2. Reimplement the timings in [motion.md](./motion.md): look-around, blinks, the ~5s talk cycle, texture drift.
3. Honor the same flags. `animationVariant: 'none'`, `animateTexture: false`, and `animateTalk: false` must match the factory.
4. When `AccessibilityInfo.isReduceMotionEnabled()` is true, show the static pose.

This avoids a WebView. It also means the motion is a second implementation and should be checked against `demo/index.html` before you rely on it.

### Hybrid

Ship common seeds as the files in `src/avatars/` (or your own `createAvatar` output written to disk). Animate only profile or hero avatars.

## Checklist

- The same seed and options match the demo when `animationVariant` is `none`.
- `scale: 1` and `scale: 1.25` frame the face the way the demo’s close-up preset does. The background still fills the square.
- `animateTexture: false` freezes the texture only.
- `animateTalk: false` freezes the mouth only.
- Reduced motion, or your app’s equivalent, shows a still face.
- The attribution one-liner from [ATTRIBUTION.md](../ATTRIBUTION.md) appears in the app’s licenses or About screen.

## Files worth copying into an app

| Path | Why |
|------|-----|
| `src/createAvatar.js` | The API |
| `src/parts/` | Official path fragments |
| `src/eyes/` | Eye wraps used while animating |
| `src/layer-map.json` | Option and layer catalog |
| `src/avatars/*.svg` | Optional pre-baked samples |
| `ATTRIBUTION.md` | Notice to show in the product |

The demo HTML is for QA. Production does not need it.
