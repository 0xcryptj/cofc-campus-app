import React, { useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import {
  useFonts,
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/lib/AuthContext';

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

  // On web (Expo desktop preview), constrain the app to a phone-width column
  // centered in the browser. The dark outer shell makes it look like a phone
  // viewport in a dark browser frame instead of a stretched website.
  // On native iOS/Android the app renders at full device width as normal.
  if (Platform.OS === 'web') {
    return (
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: '#111111', alignItems: 'center' }}>
          <View style={{ flex: 1, width: '100%', maxWidth: 430, overflow: 'hidden' }}>
            <RootNavigator />
          </View>
        </View>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
