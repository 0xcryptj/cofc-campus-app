import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Typography, Spacing, Radius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = email.trim().toLowerCase().endsWith('@g.cofc.edu');

  async function handleSignUp() {
    if (!isValid) {
      Alert.alert('CofC email required', 'Only @g.cofc.edu addresses can join.');
      return;
    }
    setLoading(true);
    // TODO: replace with Supabase magic link / OTP send
    await new Promise((res) => setTimeout(res, 700));
    setLoading(false);
    navigation.navigate('VerifyEmail');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Enter your College of Charleston email. We will send you a verification link.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>CofC Email</Text>
          <TextInput
            style={[styles.input, email.length > 0 && !isValid && styles.inputError]}
            placeholder="you@g.cofc.edu"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {email.length > 0 && !isValid && (
            <Text style={styles.errorText}>Must be a @g.cofc.edu address</Text>
          )}

          <TouchableOpacity
            style={[styles.btn, (!isValid || loading) && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={!isValid || loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Sending...' : 'Send Verification Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  top: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.maroon,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  form: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.xs,
    color: Colors.error,
  },
  btn: {
    backgroundColor: Colors.maroon,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
