/**
 * SignUpScreen — Dark onboarding continuation
 *
 * Matches the WelcomeScreen dark aesthetic:
 *   • Same gradient background + doodle wallpaper
 *   • Frosted glass card with inline form
 *   • Gradient submit button (maroon)
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet,
  TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
  Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

const BG_IMAGE = require('../../../assets/background.png');

// ─── Same dark palette as WelcomeScreen ───────────────────────────────────────
const D = {
  bg1:        '#0E0F13',
  bg2:        '#18131A',
  maroon:     '#8C1D40',
  deepMaroon: '#6F1733',
  cream:      '#F7F4ED',
  dimCream:   'rgba(247,244,237,0.38)',
  mutedCream: 'rgba(247,244,237,0.55)',
  inputBg:    'rgba(255,255,255,0.07)',
  inputBorder:'rgba(255,255,255,0.12)',
  inputFocus: '#8C1D40',
  error:      '#F87171',
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

  const isValid   = email.trim().toLowerCase().endsWith('@g.cofc.edu');
  const showError = touched && email.length > 0 && !isValid;

  // Button scale microinteraction
  const btnScale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(btnScale, { toValue: 0.965, damping: 12, stiffness: 350, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1,     damping: 12, stiffness: 350, useNativeDriver: true }).start();

  async function handleContinue() {
    setTouched(true);
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // TODO: Supabase magic link
    setLoading(false);
    navigation.navigate('VerifyEmail');
  }

  const cardContent = (
    <View style={styles.cardInner}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>Create account</Text>
        <Text style={styles.subtitle}>
          Enter your CofC email and we'll send a magic link.
        </Text>
      </View>

      {/* Email input */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.fieldLabel}>CofC EMAIL</Text>
        <TextInput
          style={[
            styles.input,
            focused && styles.inputFocused,
            showError && styles.inputError,
          ]}
          value={email}
          onChangeText={setEmail}
          onBlur={() => { setTouched(true); setFocused(false); }}
          onFocus={() => setFocused(true)}
          placeholder="you@g.cofc.edu"
          placeholderTextColor="rgba(247,244,237,0.28)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          keyboardAppearance="dark"
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
        {showError && (
          <Text style={styles.errorText}>Must be a @g.cofc.edu address</Text>
        )}
      </View>

      {/* Submit */}
      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          onPress={handleContinue}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Send verification email"
        >
          <LinearGradient
            colors={isValid ? [D.maroon, D.deepMaroon] : ['rgba(140,29,64,0.38)', 'rgba(111,23,51,0.38)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaLabel}>
              {loading ? 'Sending…' : 'Send Verification Email'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={[D.bg1, D.bg2]}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background image */}
      <View style={styles.bgImage} pointerEvents="none">
        <Image source={BG_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { top: insets.top + 16 }]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Frosted glass card */}
      <View style={[styles.cardWrapper, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={22} tint="dark" style={styles.card}>
            {cardContent}
          </BlurView>
        ) : (
          <View style={[styles.card, { backgroundColor: 'rgba(18,20,28,0.82)' }]}>
            {cardContent}
          </View>
        )}
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0F13',
    justifyContent: 'flex-end',
  },
  bgImage: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
  },

  // ── Back button ──────────────────────────────────────────────────────────
  backBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 15,
    color: 'rgba(247,244,237,0.65)',
    fontWeight: '500',
  },

  // ── Glass card ───────────────────────────────────────────────────────────
  cardWrapper: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
  cardInner: {
    padding: 24,
    gap: 20,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'SpaceMono_700Bold',
    color: '#F7F4ED',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(247,244,237,0.55)',
    lineHeight: 22,
  },

  // ── Input ────────────────────────────────────────────────────────────────
  fieldWrapper: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(247,244,237,0.45)',
    letterSpacing: 0.8,
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#F7F4ED',
  },
  inputFocused: {
    borderColor: '#8C1D40',
    backgroundColor: 'rgba(140,29,64,0.08)',
  },
  inputError: {
    borderColor: '#F87171',
  },
  errorText: {
    fontSize: 11,
    color: '#F87171',
    letterSpacing: 0.1,
  },

  // ── CTA button ───────────────────────────────────────────────────────────
  ctaButton: {
    height: 52,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'SpaceMono_700Bold',
    color: '#F7F4ED',
    letterSpacing: 0.3,
  },
});
