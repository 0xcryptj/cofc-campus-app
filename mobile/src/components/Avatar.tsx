import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Type, Dim } from '../theme';

interface Props {
  displayName: string;
  size?: 36 | 48 | 64;
}

export default function Avatar({ displayName, size = Dim.avatarSm }: Props) {
  const initial = displayName.charAt(0).toUpperCase();
  const fontSize = size === 36 ? 13 : size === 48 ? 17 : 22;

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initial, { fontSize }]} allowFontScaling={false}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primaryFaint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: Colors.primary,
    fontWeight: Type.weight.semibold,
    letterSpacing: 0.2,
  },
});
