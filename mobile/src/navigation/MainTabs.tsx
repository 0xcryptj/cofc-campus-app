import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChannelFeedScreen from '../screens/ChannelFeedScreen';
import IdentityManagerScreen from '../screens/IdentityManagerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors, Type, Dim } from '../theme';

export type MainTabParamList = {
  Feed: undefined;
  Identities: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Spec: no labels, just icons + 4px maroon dot under active icon.
// Using clean Unicode glyphs until custom SVG assets are ready.
const ICONS: Record<string, string> = {
  Feed:       '⊟',
  Identities: '◈',
  Settings:   '⊕',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={tabStyles.wrapper}>
      <Text
        style={[tabStyles.icon, { color: focused ? Colors.primary : Colors.textMuted }]}
        allowFontScaling={false}
      >
        {ICONS[name]}
      </Text>
      {focused && <View style={tabStyles.dot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  icon: {
    fontSize: 21,
    lineHeight: 24,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Feed" component={ChannelFeedScreen} />
      <Tab.Screen name="Identities" component={IdentityManagerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Dim.tabBarHeight + (Platform.OS === 'ios' ? 20 : 0), // accounts for home bar
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 10,
  },
});
