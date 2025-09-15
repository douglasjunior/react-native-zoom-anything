import { Image, Text, useWindowDimensions, View } from 'react-native';

import Zoom from 'react-native-zoom-anything';

export default function Example() {
  const { width } = useWindowDimensions();
  return (
      <Zoom minZoom={1} maxZoom={5} style={{ backgroundColor: 'black' }}>
        <View style={{ backgroundColor: 'white' }}>
          <Text style={{ textAlign: 'center', marginBottom: 8 }}>
            Tap two times or pinch to zoom!
          </Text>
          <Image
            source={{ uri: 'https://picsum.photos/1920/1080' }}
            style={{ width: width, height: (width * 1080) / 1920 }}
            resizeMode="contain"
          />
        </View>
      </Zoom>
  );
}
