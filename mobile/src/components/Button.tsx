import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Type, Space, Radius, Dim } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'inverse';
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading;
  const bgStyle = variant === 'primary' ? styles.primary
    : variant === 'inverse' ? styles.inverse
    : styles.ghost;
  const labelStyle = variant === 'primary' ? styles.labelPrimary
    : variant === 'inverse' ? styles.labelInverse
    : styles.labelGhost;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        bgStyle,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.primary} size="small" />
      ) : (
        <Text
          style={[styles.label, labelStyle, isDisabled && styles.labelDisabled]}
          allowFontScaling={false}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: Dim.buttonHeight,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Space.md,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  inverse: {
    backgroundColor: Colors.white,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.transparent,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    letterSpacing: Type.tracking.label,
  },
  labelPrimary: {
    color: Colors.white,
  },
  labelGhost: {
    color: Colors.primary,
  },
  labelInverse: {
    color: Colors.primary,
  },
  labelDisabled: {
    color: Colors.white,
  },
});
