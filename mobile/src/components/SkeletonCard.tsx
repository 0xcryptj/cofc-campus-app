import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Platform, } from 'react-native';
import { Colors, Space, Radius, Elevation } from '../theme';

// useNativeDriver:true is unsupported on web; false works on all platforms
const ND = Platform.OS !== 'web';

function Block({ width, height, radius = Radius.xs }: { width: number | string; height: number; radius?: number }) {
  return <View style={[styles.block, { width: width as any, height, borderRadius: radius }]} />;
}

export default function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: ND }),
        Animated.timing(pulse, { toValue: 0.5, duration: 750, useNativeDriver: ND }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: pulse }]}>
      {/* Image placeholder */}
      <View style={styles.imagePlaceholder} />

      {/* Text lines */}
      <View style={styles.body}>
        <Block width="90%" height={12} />
        <Block width="75%" height={12} />
        <Block width="55%" height={12} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Block width={32} height={32} radius={Radius.full} />
          <Block width={80} height={10} />
        </View>
        <View style={styles.footerRight}>
          <Block width={32} height={10} />
          <Block width={32} height={10} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Space.md,
    marginBottom: Space.sm,
    overflow: 'hidden',
    ...Elevation.card,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.border,
  },
  body: {
    padding: Space.md,
    gap: Space.sm,
  },
  block: {
    backgroundColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingBottom: Space.md,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  footerRight: {
    flexDirection: 'row',
    gap: Space.md,
  },
});
