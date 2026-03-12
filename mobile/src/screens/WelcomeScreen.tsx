import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors, Type, Space, Radius } from '../theme';
import Button from '../components/Button';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.appName} allowFontScaling={false}>
            Charleston{'\n'}Tea
          </Text>
          <Text style={styles.tagline}>
            The anonymous campus feed{'\n'}for CofC students.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          {/* White button on the maroon background */}
          <Button
            label="Get Started"
            onPress={() => navigation.navigate('SignUp')}
            variant="inverse"
            fullWidth
          />
          <Text style={styles.disclaimer}>
            Requires a verified @g.cofc.edu email.{'\n'}
            Posts are public and anonymous. Records are kept privately for safety.
          </Text>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Space.lg,
    paddingBottom: Space.xxl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: Space.md,
  },
  appName: {
    fontSize: Type.size.screen,
    fontWeight: Type.weight.bold,
    color: Colors.white,
    letterSpacing: Type.tracking.tightest,
    lineHeight: 40,
  },
  tagline: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.regular,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: Type.leading.body,
  },
  cta: {
    gap: Space.md,
  },
  disclaimer: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: Type.tracking.caption,
  },
});
