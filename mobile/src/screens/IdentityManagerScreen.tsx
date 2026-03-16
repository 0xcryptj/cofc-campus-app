import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ScrollView,
} from 'react-native';
import Avatar from '../components/Avatar';
import { Colors, Type, Space, Radius, Elevation } from '../theme';
import { generateIdentity } from '../utils/generateIdentity';
import { getAliases, createAlias, deleteAlias } from '../services/api';
import type { AnonIdentity } from '../types';

const MAX = 3;

export default function IdentityManagerScreen() {
  const [identities, setIdentities] = useState<AnonIdentity[]>([]);
  const [activeId, setActiveId] = useState('');

  const loadAliases = useCallback(async () => {
    try {
      const aliases = await getAliases();
      const mapped: AnonIdentity[] = aliases.map(a => ({
        id: a.id,
        displayName: a.alias,
        createdAt: a.created_at,
      }));
      setIdentities(mapped);
      if (mapped.length > 0 && !activeId) setActiveId(mapped[0].id);
    } catch {
      // Non-critical — show empty state
    }
  }, [activeId]);

  useEffect(() => { loadAliases(); }, [loadAliases]);

  async function create() {
    if (identities.length >= MAX) {
      Alert.alert('Limit reached', `You can hold up to ${MAX} identities.`);
      return;
    }
    try {
      const generated = generateIdentity();
      const saved = await createAlias(generated.displayName);
      const newIdentity: AnonIdentity = {
        id: saved.id,
        displayName: saved.alias,
        createdAt: saved.created_at,
      };
      setIdentities(prev => [...prev, newIdentity]);
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Could not create identity');
    }
  }

  function remove(id: string) {
    if (identities.length === 1) {
      Alert.alert('Cannot delete', 'You must keep at least one identity.');
      return;
    }
    Alert.alert('Delete identity?', 'This cannot be undone.', [
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteAlias(id);
            setIdentities(prev => prev.filter(i => i.id !== id));
            if (activeId === id) {
              const rest = identities.filter(i => i.id !== id);
              if (rest.length) setActiveId(rest[0].id);
            }
          } catch (err: unknown) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Could not delete');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Identities</Text>
          <Text style={styles.subtitle}>
            Up to {MAX} anonymous identities. Other users only see the display name — never your account.
          </Text>
        </View>

        {/* Identity cards */}
        {identities.map(identity => {
          const active = identity.id === activeId;
          return (
            <TouchableOpacity
              key={identity.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setActiveId(identity.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Avatar displayName={identity.displayName} size={48} />
                <View style={styles.cardText}>
                  <Text style={styles.cardName}>{identity.displayName}</Text>
                  <Text style={styles.cardStatus}>
                    {active ? 'Active identity' : 'Tap to switch'}
                  </Text>
                </View>
              </View>

              {active && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText} allowFontScaling={false}>✓</Text>
                </View>
              )}

              {!active && (
                <TouchableOpacity
                  onPress={() => remove(identity.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Add button */}
        {identities.length < MAX && (
          <TouchableOpacity style={styles.addBtn} onPress={create} activeOpacity={0.7}>
            <Text style={styles.addBtnIcon} allowFontScaling={false}>+</Text>
            <Text style={styles.addBtnLabel}>New Identity</Text>
          </TouchableOpacity>
        )}

        {/* Privacy note */}
        <Text style={styles.note}>
          All posts are publicly anonymous. Your real account is stored privately to
          enable moderation and safety review if needed.
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
    gap: Space.md,
    paddingBottom: Space.xxl,
  },

  // ── Header ──────────────────────────────────────
  header: {
    paddingVertical: Space.sm,
    gap: Space.xs,
  },
  title: {
    fontSize: Type.size.section,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
    letterSpacing: Type.tracking.tight,
  },
  subtitle: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
    lineHeight: Type.leading.body,
  },

  // ── Identity card ────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Space.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.card,
  },
  cardActive: {
    borderColor: Colors.primary,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Space.md,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
  },
  cardStatus: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.primary,
    letterSpacing: Type.tracking.caption,
  },
  activeBadge: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
  },
  deleteText: {
    fontSize: Type.size.label,
    color: Colors.error,
    fontWeight: Type.weight.medium,
  },

  // ── Add button ──────────────────────────────────
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addBtnIcon: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: Type.weight.regular,
    lineHeight: 24,
  },
  addBtnLabel: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.primary,
  },

  // ── Note ─────────────────────────────────────────
  note: {
    fontSize: Type.size.caption,
    color: Colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: Type.tracking.caption,
    paddingHorizontal: Space.md,
    paddingTop: Space.sm,
  },
});
