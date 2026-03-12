import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../theme';

interface Props {
  uri: string;
  aspectRatio?: number;
}

// Image container enforces a fixed aspect ratio so every photo renders at the
// same proportions regardless of the original file dimensions.
// The image fades in once loaded — no jarring pop-in.
export default function FadeImage({ uri, aspectRatio = 4 / 3 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  function handleLoad() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={[styles.container, { aspectRatio }]}>
      <View style={StyleSheet.absoluteFill} />
      <Animated.Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, { opacity }]}
        resizeMode="cover"
        onLoad={handleLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: Colors.border,
  },
});
