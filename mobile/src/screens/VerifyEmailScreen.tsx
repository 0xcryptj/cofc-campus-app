import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Type, Space } from '../theme';
import Button from '../components/Button';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
};

export default function VerifyEmailScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.content}>
          <Text style={styles.icon}>📬</Text>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.body}>
            We sent a link to your @g.cofc.edu address.
            Open it to verify your account, then come back here.
          </Text>
        </View>

        <View style={styles.actions}>
          {/* TODO: replace with Supabase auth state listener — remove button */}
          <Button
            label="I'm verified — Enter the App"
            onPress={() => navigation.replace('Main')}
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.resend}>
            <Text style={styles.resendText}>Wrong email? Go back</Text>
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: Space.lg,
    justifyContent: 'space-between',
    paddingBottom: Space.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.md,
  },
  icon: {
    fontSize: 52,
    marginBottom: Space.sm,
  },
  title: {
    fontSize: Type.size.section,
    fontWeight: Type.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.tight,
    textAlign: 'center',
  },
  body: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
    lineHeight: Type.leading.body,
    textAlign: 'center',
  },
  actions: {
    gap: Space.md,
  },
  resend: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: Type.size.body,
    color: Colors.primary,
    fontWeight: Type.weight.medium,
  },
});
