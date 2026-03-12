import React, { useEffect } from 'react';
import { Text } from 'react-native';
import {
  useFonts,
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';

// Keep splash visible until fonts are ready
SplashScreen.preventAutoHideAsync();

// Apply Space Mono Regular as the global default font for all Text nodes.
// Bold text must explicitly set fontFamily: 'SpaceMono_700Bold' in its style,
// because React Native does not synthesize bold from a regular font file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextAny = Text as any;
if (!TextAny.defaultProps) TextAny.defaultProps = {};
TextAny.defaultProps.style = { fontFamily: 'SpaceMono_400Regular' };

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <RootNavigator />;
}
