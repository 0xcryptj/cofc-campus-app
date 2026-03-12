import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import MainTabs from './MainTabs';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

import type { Post } from '../types';

// Every screen reachable from the root stack is listed here.
// Screens inside tabs are managed by MainTabs.
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

        {/* Main app with bottom tabs */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Screens that slide over tabs */}
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{ headerShown: true, title: 'Post', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'New Post',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
