import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { generateIdentity } from '../utils/generateIdentity';
import { MOCK_IDENTITIES } from '../services/mockData';
import type { AnonIdentity } from '../types';

const MAX_IDENTITIES = 3;

export default function IdentityManagerScreen() {
  const [identities, setIdentities] = useState<AnonIdentity[]>(MOCK_IDENTITIES);
  const [activeId, setActiveId] = useState<string>(MOCK_IDENTITIES[0].id);

  function createIdentity() {
    if (identities.length >= MAX_IDENTITIES) {
      Alert.alert('Limit reached', `You can have up to ${MAX_IDENTITIES} identities.`);
      return;
    }
    const newIdentity = generateIdentity();
    setIdentities((prev) => [...prev, newIdentity]);
  }

  function deleteIdentity(id: string) {
    if (identities.length === 1) {
      Alert.alert('Cannot delete', 'You must keep at least one identity.');
      return;
    }
    Alert.alert('Delete identity?', 'This cannot be undone.', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setIdentities((prev) => prev.filter((i) => i.id !== id));
          if (activeId === id) {
            const remaining = identities.filter((i) => i.id !== id);
            if (remaining.length > 0) setActiveId(remaining[0].id);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Identities</Text>
        <Text style={styles.subtitle}>
          You can have up to {MAX_IDENTITIES} anonymous identities. Switch between them freely.
        </Text>
      </View>

      <View style={styles.list}>
        {identities.map((identity) => {
          const isActive = identity.id === activeId;
          return (
            <View key={identity.id} style={[styles.card, isActive && styles.cardActive]}>
              <TouchableOpacity
                style={styles.cardMain}
                onPress={() => setActiveId(identity.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatar, { backgroundColor: identity.avatarColor }]}>
                  <Text style={styles.avatarInitial}>{identity.displayName[0]}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.identityName}>{identity.displayName}</Text>
                  <Text style={styles.identityStatus}>
                    {isActive ? '✓ Active' : 'Tap to use'}
                  </Text>
                </View>
              </TouchableOpacity>

              {!isActive && (
                <TouchableOpacity
                  onPress={() => deleteIdentity(identity.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {identities.length < MAX_IDENTITIES && (
        <TouchableOpacity style={styles.addBtn} onPress={createIdentity}>
          <Text style={styles.addBtnText}>+ Create New Identity</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.note}>
        Identities are anonymous to other users. Your account is stored privately for safety.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.maroon,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  cardActive: {
    borderColor: Colors.maroon,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  cardText: {
    flex: 1,
  },
  identityName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  identityStatus: {
    fontSize: Typography.sm,
    color: Colors.maroon,
    marginTop: 2,
  },
  deleteBtn: {
    fontSize: Typography.sm,
    color: Colors.error,
    fontWeight: Typography.medium,
    paddingLeft: Spacing.sm,
  },
  addBtn: {
    margin: Spacing.base,
    marginTop: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.maroon,
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.maroon,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  note: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
});
