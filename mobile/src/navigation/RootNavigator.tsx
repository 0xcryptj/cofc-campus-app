import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import MainTabs from './MainTabs';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

import { Colors, Type } from '../theme';
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
          animation: 'slide_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        {/* Auth */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade', animationDuration: 350 }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

        {/* App */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ animation: 'fade', animationDuration: 350 }}
        />

        {/* PostDetail — slides from right over tabs */}
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
              color: Colors.textPrimary,
            },
          }}
        />

        {/* CreatePost — native iOS form sheet with drag handle */}
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
              color: Colors.textPrimary,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
