import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Colors, Type, Space, Radius, Elevation } from '../theme';

interface RowProps {
  label: string;
  value?: string;
  destructive?: boolean;
  onPress?: () => void;
}

function Row({ label, value, destructive, onPress }: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
        {label}
      </Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {onPress && !value ? <Text style={styles.rowArrow}>›</Text> : null}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
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
            <Row label="Sign Out" onPress={() => {}} />
            <View style={styles.divider} />
            <Row label="Delete Account" destructive onPress={() => {}} />
          </View>
        </View>

        {/* App info */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>About</Text>
          <View style={styles.card}>
            <Row label="Version" value="1.0.0" />
            <View style={styles.divider} />
            <Row label="Only for @g.cofc.edu students" />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Legal</Text>
          <View style={styles.card}>
            <Row label="Privacy Policy" onPress={() => {}} />
            <View style={styles.divider} />
            <Row label="Terms of Service" onPress={() => {}} />
          </View>
        </View>

        <Text style={styles.footer}>
          Charleston Tea · v1.0.0{'\n'}
          Posts are anonymous publicly. User records are stored privately for moderation and safety.
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
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.tight,
    paddingVertical: Space.sm,
  },

  // ── Group ─────────────────────────────────────
  group: {
    gap: Space.sm,
  },
  groupLabel: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
    paddingHorizontal: Space.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Elevation.card,
  },

  // ── Row ───────────────────────────────────────
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: Space.md,
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
  rowArrow: {
    fontSize: 18,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Space.md,
  },

  // ── Footer ────────────────────────────────────
  footer: {
    fontSize: Type.size.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: Type.tracking.caption,
    paddingTop: Space.sm,
  },
});
