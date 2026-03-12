import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../theme';

interface Props {
  uri: string;
  /**
   * Width divided by height. Default is 4/3.
   * 1     = square (Instagram-style)
   * 4/3   = portrait-ish (default — works well for campus photos)
   * 16/9  = wide landscape
   */
  aspectRatio?: number;
  borderRadius?: number;
}

export default function FadeImage({ uri, aspectRatio = 4 / 3, borderRadius = 0 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  function handleLoad() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={[styles.container, { aspectRatio, borderRadius }]}>
      {/* Placeholder visible while the image loads */}
      <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
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
    backgroundColor: Colors.surfaceAlt,
  },
  placeholder: {
    backgroundColor: Colors.surfaceAlt,
  },
});
