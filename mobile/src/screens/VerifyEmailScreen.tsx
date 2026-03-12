/**
 * VerifyEmailScreen — Dark onboarding, step 3
 *
 * Same dark gradient + doodle wallpaper as Welcome/SignUp.
 * Glass card with mail icon, copy, and CTA.
 */

import React, { useRef } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Platform,
  Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

const BG_IMAGE = require('../../assets/background.png');

const D = {
  bg1:        '#0E0F13',
  bg2:        '#18131A',
  maroon:     '#8C1D40',
  deepMaroon: '#6F1733',
  cream:      '#F7F4ED',
  mutedCream: 'rgba(247,244,237,0.55)',
  dimCream:   'rgba(247,244,237,0.38)',
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
};

export default function VerifyEmailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const btnScale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(btnScale, { toValue: 0.965, damping: 12, stiffness: 350, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1,     damping: 12, stiffness: 350, useNativeDriver: true }).start();

  const cardContent = (
    <View style={styles.cardInner}>

      <View style={styles.iconRow}>
        <Text style={styles.mailIcon}>📬</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>Check your inbox</Text>
        <Text style={styles.body}>
          We sent a link to your @g.cofc.edu address.{'\n'}
          Open it to verify, then come back here.
        </Text>
      </View>

      {/* TODO: replace with Supabase auth state listener */}
      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          onPress={() => navigation.replace('Main')}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel="Enter the app"
        >
          <LinearGradient
            colors={[D.maroon, D.deepMaroon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaLabel}>I'm Verified — Enter the App</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.goBack}
        accessibilityRole="button"
      >
        <Text style={styles.goBackText}>Wrong email? Go back</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.root}>

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

      {/* Spacer so card sits near bottom */}
      <View style={{ flex: 1 }} />

      {/* Glass card */}
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

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E0F13',
  },
  bgImage: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
  },

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

  iconRow: {
    alignItems: 'center',
  },
  mailIcon: {
    fontSize: 48,
  },
  header: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'SpaceMono_700Bold',
    color: '#F7F4ED',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: 'rgba(247,244,237,0.55)',
    lineHeight: 22,
    textAlign: 'center',
  },

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

  goBack: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  goBackText: {
    fontSize: 13,
    color: 'rgba(247,244,237,0.45)',
    fontWeight: '500',
  },
});
