import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChannelFeedScreen from '../screens/ChannelFeedScreen';
import IdentityManagerScreen from '../screens/IdentityManagerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors, Dim, ms } from '../theme';

export type MainTabParamList = {
  Feed: undefined;
  Identities: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICON_MAP: Record<string, { outline: IoniconName; filled: IoniconName }> = {
  Feed:       { outline: 'newspaper-outline',   filled: 'newspaper' },
  Identities: { outline: 'people-outline',      filled: 'people' },
  Settings:   { outline: 'settings-outline',    filled: 'settings' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons = ICON_MAP[name];
  return (
    <View style={tabStyles.wrapper}>
      <Ionicons
        name={focused ? icons.filled : icons.outline}
        size={ms(22)}
        color={focused ? Colors.primary : Colors.textMuted}
      />
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
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { height: Dim.tabBarHeight + insets.bottom, paddingBottom: insets.bottom },
        ],
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
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    elevation: 10,
    ...Platform.select({
      web:     { boxShadow: '0px -1px 6px rgba(0,0,0,0.04)' },
      default: { shadowColor: Colors.black, shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.06, shadowRadius: 8 },
    }),
  },
});
