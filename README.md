# React-Native Zoom Anything

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/douglasjunior/react-native-zoom-anything/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-zoom-anything.svg)](https://www.npmjs.com/package/react-native-zoom-anything?activeTab=versions)
[![npm downloads](https://img.shields.io/npm/dt/react-native-zoom-anything.svg)](https://www.npmjs.com/package/react-native-zoom-anything)


A lightweight pinch-to-zoom, pan, and double-tap zoom view for React Native using [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler) + [Animated](https://reactnative.dev/docs/animated) (no Reanimated required).

🧑‍💻 Online example on [Snack](https://snack.expo.dev/@douglasjunior/react-native-zoom-anything).

## Requirements

- React Native >= 0.60
- `react-native-gesture-handler` >= 2.5

## Install

Install dependency packages:

```bash
yarn add react-native-zoom-anything
```

Or

```bash
npm i -S react-native-zoom-anything
```

Follow the `react-native-gesture-handler` installation guide according to your RN version.

## Basic usage

```tsx
import { Image, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Zoom from 'react-native-zoom-anything';

export default function Example() {
  const { width } = useWindowDimensions();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Zoom minZoom={1} maxZoom={5}>
        <Image
          source={{ uri: 'https://picsum.photos/1920/1080' }}
          style={{ width: width, height: width * 9 / 16 }}
          resizeMode="contain"
          />
      </Zoom>
    </GestureHandlerRootView>
  );
}
```

### Props

- `children`: React single element that accepts `onLayout` (e.g., `View`, `Image`).
- `minZoom` (optional, default `1`)
- `maxZoom` (optional, default `5`)
- `style` (optional): Style for the container view.

## Contribute

New features, bug fixes, and improvements are welcome! For questions and suggestions use the [issues](https://github.com/douglasjunior/react-native-zoom-anything/issues).

<a href="https://www.patreon.com/douglasjunior"><img src="http://i.imgur.com/xEO164Z.png" alt="Become a Patron!" width="200" /></a>
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/douglasnassif)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=douglasjunior/react-native-zoom-anything&type=Date)](https://star-history.com/#douglasjunior/react-native-zoom-anything)

## License

```
The MIT License (MIT)

Copyright (c) 2025 Douglas Nassif Roma Junior
```

See the full license file at [LICENSE](./LICENSE).
