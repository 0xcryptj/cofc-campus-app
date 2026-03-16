/**
 * WelcomeScreen — Premium dark onboarding
 *
 * Layout:
 *   • Dark gradient background (#0E0F13 → #18131A)
 *   • Doodle wallpaper layer that slowly drifts (parallax feel)
 *   • Hero wordmark that slides up on mount
 *   • Frosted glass action card that rises from below
 *   • Gradient CTA button with spring press microinteraction
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet,
  Animated, TouchableOpacity,
  Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
const BG_IMAGE  = require('../../assets/background.png');
const APP_LOGO  = require('../../assets/newlogo.png');

// useNativeDriver:true is unsupported on web; false works on all platforms
const ND = Platform.OS !== 'web';

// ─── Dark onboarding palette (not from global theme) ──────────────────────────
const D = {
  bg1:        '#0E0F13',
  bg2:        '#18131A',
  maroon:     '#8C1D40',
  deepMaroon: '#6F1733',
  cream:      '#F7F4ED',
  mutedCream: 'rgba(247,244,237,0.55)',
  dimCream:   'rgba(247,244,237,0.38)',
  cardBorder: 'rgba(255,255,255,0.09)',
  cardBg:     'rgba(18,20,28,0.82)',  // Android fallback (no blur)
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // ── Entrance animation values ────────────────────────────────────────────
  const bgOpacity    = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(28)).current;
  const heroOpacity  = useRef(new Animated.Value(0)).current;
  const cardY        = useRef(new Animated.Value(52)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;

  // ── Doodle wallpaper drift ───────────────────────────────────────────────
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;

  // ── CTA button press scale ───────────────────────────────────────────────
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance: bg → hero → card
    Animated.sequence([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: ND,
      }),
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 560,
          useNativeDriver: ND,
        }),
        Animated.spring(heroY, {
          toValue: 0,
          damping: 20,
          stiffness: 120,
          useNativeDriver: ND,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 480,
          useNativeDriver: ND,
        }),
        Animated.spring(cardY, {
          toValue: 0,
          damping: 18,
          stiffness: 110,
          useNativeDriver: ND,
        }),
      ]),
    ]).start();

    // Slow horizontal drift loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(driftX, { toValue: 9,  duration: 9000, useNativeDriver: ND }),
        Animated.timing(driftX, { toValue: -9, duration: 9000, useNativeDriver: ND }),
        Animated.timing(driftX, { toValue: 0,  duration: 9000, useNativeDriver: ND }),
      ])
    ).start();

    // Slow vertical drift loop (different phase)
    Animated.loop(
      Animated.sequence([
        Animated.timing(driftY, { toValue: 11,  duration: 11000, useNativeDriver: ND }),
        Animated.timing(driftY, { toValue: -7,  duration: 11000, useNativeDriver: ND }),
        Animated.timing(driftY, { toValue: 0,   duration: 11000, useNativeDriver: ND }),
      ])
    ).start();
  }, []);

  // ── Button press microinteraction ────────────────────────────────────────
  const onPressIn = () =>
    Animated.spring(btnScale, {
      toValue: 0.965,
      damping: 12,
      stiffness: 350,
      useNativeDriver: ND,
    }).start();

  const onPressOut = () =>
    Animated.spring(btnScale, {
      toValue: 1,
      damping: 12,
      stiffness: 350,
      useNativeDriver: ND,
    }).start();

  // ── Card inner content (shared between BlurView and fallback View) ────────
  const cardContent = (
    <View style={styles.cardInner}>
      {/* CTA button with gradient + spring press */}
      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel="Get started"
        >
          <LinearGradient
            colors={[D.maroon, D.deepMaroon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaLabel}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.disclaimer}>
        Requires a verified @g.cofc.edu email.{'\n'}
        Posts are anonymous. Records kept privately for safety.
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.root, { opacity: bgOpacity }]}>

      {/* ── Gradient background ─────────────────────────────────────────── */}
      <LinearGradient
        colors={[D.bg1, D.bg2]}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Background image — drifts slowly ───────────────────────────── */}
      <Animated.View
        style={[
          styles.bgImage,
          { transform: [{ translateX: driftX }, { translateY: driftY }] },
          { pointerEvents: 'none' },
        ]}
      >
        <Image source={BG_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>

      {/* ── Hero wordmark ────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.hero,
          { paddingTop: insets.top + 40 },
          { opacity: heroOpacity, transform: [{ translateY: heroY }] },
        ]}
      >
        <Image source={APP_LOGO} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.appName} allowFontScaling={false}>
          Charleston{'\n'}Tea
        </Text>
        <Text style={styles.tagline}>
          Spill the tea.{'\n'}Stay in the loop.
        </Text>
      </Animated.View>

      {/* ── Frosted glass action card ────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.cardWrapper,
          { paddingBottom: Math.max(insets.bottom, 16) + 20 },
          { opacity: cardOpacity, transform: [{ translateY: cardY }] },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={22} tint="dark" style={styles.card}>
            {cardContent}
          </BlurView>
        ) : (
          <View style={[styles.card, { backgroundColor: D.cardBg }]}>
            {cardContent}
          </View>
        )}
      </Animated.View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0F13',
  },

  // ── Background image ─────────────────────────────────────────────────────
  bgImage: {
    position: 'absolute',
    // Oversized by 20px on each edge so drift never reveals background color
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    flex: 1,
    paddingHorizontal: 28,
    gap: 14,
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 22,
    marginBottom: 4,
  },
  appName: {
    fontSize: 54,
    fontWeight: '700',
    fontFamily: 'SpaceMono_700Bold',
    color: '#F7F4ED',
    letterSpacing: -1.5,
    lineHeight: 58,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(247,244,237,0.55)',
    lineHeight: 28,
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
    gap: 18,
  },

  // ── CTA button ───────────────────────────────────────────────────────────
  ctaButton: {
    height: 52,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'SpaceMono_700Bold',
    color: '#F7F4ED',
    letterSpacing: 0.4,
  },

  // ── Disclaimer ───────────────────────────────────────────────────────────
  disclaimer: {
    fontSize: 11,
    color: 'rgba(247,244,237,0.38)',
    textAlign: 'center',
    lineHeight: 17,
    letterSpacing: 0.2,
  },
});
