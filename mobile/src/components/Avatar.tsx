import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Type, ms } from '../theme';

interface Props {
  displayName: string;
  size?: number;
  isDating?: boolean;
}

export default function Avatar({ displayName, size = ms(36), isDating = false }: Props) {
  const initial = displayName.charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.38);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDating ? Colors.datingFaint : Colors.primaryFaint,
        },
      ]}
    >
      <Text
        style={[
          styles.initial,
          {
            fontSize,
            color: isDating ? Colors.datingPrimary : Colors.primary,
          },
        ]}
        allowFontScaling={false}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    letterSpacing: 0.2,
  },
});
