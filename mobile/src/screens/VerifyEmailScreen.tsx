import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Typography, Spacing, Radius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
};

export default function VerifyEmailScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.icon}>📬</Text>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.body}>
            We sent a verification link to your @g.cofc.edu address.{'\n\n'}
            Open that email and tap the link. Once verified, come back here.
          </Text>
        </View>

        {/* TODO: Listen for Supabase auth event instead of manual button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.btnText}>I'm verified — Enter the App</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Wrong email? Go back</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxxl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.maroon,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  body: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  btn: {
    backgroundColor: Colors.maroon,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  btnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  backLink: {
    color: Colors.maroon,
    fontSize: Typography.sm,
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
});
