import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Type, Space, Radius } from '../theme';
import Button from '../components/Button';
import InputField from '../components/InputField';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = email.trim().toLowerCase().endsWith('@g.cofc.edu');
  const showError = touched && email.length > 0 && !isValid;

  async function handleContinue() {
    setTouched(true);
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // TODO: Supabase magic link
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Enter your College of Charleston email. We will send a verification link.
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="CofC Email"
            placeholder="you@g.cofc.edu"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched(true)}
            error={showError ? 'Must be a @g.cofc.edu address' : undefined}
          />
          <Button
            label="Send Verification Email"
            onPress={handleContinue}
            disabled={!isValid}
            loading={loading}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
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
    paddingHorizontal: Space.lg,
    justifyContent: 'center',
    gap: Space.xl,
  },
  top: {
    gap: Space.sm,
  },
  title: {
    fontSize: Type.size.screen,
    fontWeight: Type.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.tightest,
  },
  subtitle: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
    lineHeight: Type.leading.body,
  },
  form: {
    gap: Space.md,
  },
  back: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: Type.size.body,
    color: Colors.primary,
    fontWeight: Type.weight.medium,
  },
});
