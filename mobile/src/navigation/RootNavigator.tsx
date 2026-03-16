import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import MainTabs from './MainTabs';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

import { Colors, Type } from '../theme';
import type { Post } from '../types';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  Main: undefined;
  PostDetail: { post: Post };
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep-link prefix for magic-link callback
const linking = {
  prefixes: [Linking.createURL('/'), 'charlestonteaapp://'],
  config: {
    screens: {
      // Magic link lands here; Supabase SDK handles the token exchange automatically
      VerifyEmail: 'auth/callback',
    },
  },
};

export default function RootNavigator() {
  const { session, loading } = useAuth();

  // Handle incoming deep links (magic link callback) when app is already open
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      // Supabase detects the token in the URL and fires onAuthStateChange automatically
      // when detectSessionInUrl is true; we just need the URL passed through.
      const parsed = Linking.parse(url);
      if (parsed.path === 'auth/callback') {
        supabase.auth.getSession(); // trigger refresh
      }
    });
    return () => sub.remove();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        {session ? (
          /* ── Authenticated stack ─── */
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ animation: 'fade', animationDuration: 350 }}
            />
            <Stack.Screen
              name="PostDetail"
              component={PostDetailScreen}
              options={{
                headerShown: true,
                title: '',
                headerBackTitle: 'Feed',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.primary,
                headerTitleStyle: {
                  fontSize: Type.size.body,
                  fontWeight: Type.weight.semibold,
                  fontFamily: 'SpaceMono_700Bold',
                  color: Colors.textPrimary,
                },
              }}
            />
            <Stack.Screen
              name="CreatePost"
              component={CreatePostScreen}
              options={{
                presentation: 'formSheet',
                headerShown: true,
                title: 'New Post',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.primary,
                headerTitleStyle: {
                  fontSize: Type.size.body,
                  fontWeight: Type.weight.semibold,
                  fontFamily: 'SpaceMono_700Bold',
                  color: Colors.textPrimary,
                },
              }}
            />
          </>
        ) : (
          /* ── Auth stack ─── */
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ animation: 'fade', animationDuration: 350 }}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
