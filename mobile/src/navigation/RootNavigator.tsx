import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import MainTabs from './MainTabs';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

import { Colors, Typography } from '../theme';
import type { Post } from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  Main: undefined;
  PostDetail: { post: Post };
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Crisp, fast slide — matches iOS system behavior
          animation: 'slide_from_right',
          animationDuration: 320,
          gestureEnabled: true,
          fullScreenGestureEnabled: true, // swipe from anywhere to go back
        }}
      >
        {/* ── Auth flow ─────────────────────────────────── */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}  // no slide on first load
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

        {/* ── Main app ──────────────────────────────────── */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ animation: 'fade' }}  // clean fade into the app
        />

        {/* ── Post detail (slides in from right) ────────── */}
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerBackTitle: 'Feed',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.maroon,
            headerTitleStyle: {
              fontSize: Typography.md,
              fontWeight: Typography.semibold,
              color: Colors.textPrimary,
            },
          }}
        />

        {/* ── Create post (slides up as modal) ──────────── */}
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{
            presentation: 'formSheet',   // native iOS sheet with handle bar
            headerShown: true,
            title: 'New Post',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerTitleStyle: {
              fontSize: Typography.md,
              fontWeight: Typography.semibold,
              color: Colors.textPrimary,
            },
            headerTintColor: Colors.maroon,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
