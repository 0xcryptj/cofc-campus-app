import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Space, Radius, Elevation, ms } from '../theme';
import { useAuth } from '../lib/AuthContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface RowProps {
  label: string;
  iconName?: IoniconName;
  value?: string;
  destructive?: boolean;
  onPress?: () => void;
}

function Row({ label, iconName, value, destructive, onPress }: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        {iconName ? (
          <Ionicons
            name={iconName}
            size={ms(18)}
            color={destructive ? Colors.error : Colors.textMuted}
            style={{ marginRight: Space.sm }}
          />
        ) : null}
        <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
          {label}
        </Text>
      </View>
      {value ? (
        <Text style={styles.rowValue}>{value}</Text>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={ms(16)} color={Colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Account */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Account</Text>
          <View style={styles.card}>
            <Row label="Sign Out" iconName="log-out-outline" onPress={handleSignOut} />
            <View style={styles.divider} />
            <Row label="Delete Account" iconName="trash-outline" destructive onPress={() => {}} />
          </View>
        </View>

        {/* App info */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>About</Text>
          <View style={styles.card}>
            <Row label="Version" iconName="information-circle-outline" value="1.0.0" />
            <View style={styles.divider} />
            <Row label="Only for @g.cofc.edu students" iconName="school-outline" />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Legal</Text>
          <View style={styles.card}>
            <Row label="Privacy Policy" iconName="shield-checkmark-outline" onPress={() => {}} />
            <View style={styles.divider} />
            <Row label="Terms of Service" iconName="document-text-outline" onPress={() => {}} />
          </View>
        </View>

        <Text style={styles.footer}>
          Charleston Tea · v1.0.0{'\n'}
          Posts are anonymous publicly. User records are stored privately for moderation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Space.md,
    gap: Space.lg,
    paddingBottom: Space.xxl,
  },
  title: {
    fontSize: Type.size.section,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.tight,
    paddingVertical: Space.sm,
  },

  group: {
    gap: Space.sm,
  },
  groupLabel: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
    paddingHorizontal: Space.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Elevation.card,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: Space.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontSize: Type.size.body,
    color: Colors.textPrimary,
  },
  rowLabelDestructive: {
    color: Colors.error,
  },
  rowValue: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Space.md,
  },

  footer: {
    fontSize: Type.size.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: ms(18),
    letterSpacing: Type.tracking.caption,
    paddingTop: Space.sm,
  },
});
