import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Type, Space, Radius, Dim } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export default function InputField({ label, error, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Space.xs,
  },
  label: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.semibold,
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
  },
  input: {
    height: Dim.inputHeight,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    paddingHorizontal: Space.md,
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.transparent,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    fontSize: Type.size.caption,
    color: Colors.error,
    letterSpacing: Type.tracking.caption,
    fontWeight: Type.weight.medium,
  },
});
