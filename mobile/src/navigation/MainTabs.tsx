import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChannelFeedScreen from '../screens/ChannelFeedScreen';
import IdentityManagerScreen from '../screens/IdentityManagerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors, Typography, Spacing } from '../theme';

export type MainTabParamList = {
  Feed: undefined;
  Identities: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Tab icon component ───────────────────────────────────────────────────────
// Using simple Unicode glyphs for a clean, icon-library-free look.
// Replace with SVG icons from the assets folder once custom assets are ready.

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Feed:       { active: '⊟', inactive: '⊟' },
  Identities: { active: '◈', inactive: '◈' },
  Settings:   { active: '⊕', inactive: '⊕' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icon = TAB_ICONS[name];
  return (
    <View style={tabIconStyles.wrapper}>
      <Text
        style={[
          tabIconStyles.icon,
          focused ? tabIconStyles.iconActive : tabIconStyles.iconInactive,
        ]}
        allowFontScaling={false}
      >
        {focused ? icon.active : icon.inactive}
      </Text>
      {focused && <View style={tabIconStyles.dot} />}
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 3,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  iconActive: {
    color: Colors.maroon,
  },
  iconInactive: {
    color: Colors.textMuted,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.maroon,
  },
});

// ─────────────────────────────────────────────────────────────────────────────

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,  // we show a dot indicator instead of label
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
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
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.sm,
    // Subtle top shadow facing upward
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 12,
  },
});
