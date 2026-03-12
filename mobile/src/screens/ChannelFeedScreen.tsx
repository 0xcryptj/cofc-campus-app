import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PostCard from '../components/PostCard';
import { Colors, Typography, Spacing, Radius, Shadow, Duration } from '../theme';
import { CHANNELS } from '../types';
import type { Channel, Post } from '../types';
import { MOCK_POSTS, MOCK_IDENTITIES } from '../services/mockData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Segment control metrics
const SEGMENT_H_PADDING = Spacing.base;
const SEGMENT_INSET = 3; // inner padding of the pill track
const SEGMENT_TRACK_WIDTH = SCREEN_WIDTH - SEGMENT_H_PADDING * 2;
const PILL_WIDTH = (SEGMENT_TRACK_WIDTH - SEGMENT_INSET * 2) / CHANNELS.length;

export default function ChannelFeedScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const activeIdentity = MOCK_IDENTITIES[0];

  // Drives the sliding pill animation
  const pillX = useRef(new Animated.Value(0)).current;

  function selectChannel(index: number) {
    setActiveIndex(index);
    Animated.spring(pillX, {
      toValue: index * PILL_WIDTH,
      useNativeDriver: true,
      damping: 22,
      stiffness: 280,
      mass: 0.7,
    }).start();
  }

  const activeChannel: Channel = CHANNELS[activeIndex].id;
  const filtered = posts.filter((p) => p.channel === activeChannel);

  function handleUpvote(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const voted = p.upvotedByMe;
        return { ...p, upvotedByMe: !voted, upvoteCount: voted ? p.upvoteCount - 1 : p.upvoteCount + 1 };
      })
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── App Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>Charleston Tea</Text>
      </View>

      {/* ── Segment Control ────────────────────────────── */}
      <View style={styles.segmentOuter}>
        <View style={styles.segmentTrack}>
          {/* Sliding pill (behind labels) */}
          <Animated.View
            style={[
              styles.segmentPill,
              { width: PILL_WIDTH, transform: [{ translateX: pillX }] },
            ]}
          />
          {/* Labels (on top of pill) */}
          {CHANNELS.map((ch, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.segmentItem, { width: PILL_WIDTH }]}
                onPress={() => selectChannel(i)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}
                  allowFontScaling={false}
                  numberOfLines={1}
                >
                  {ch.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Feed ───────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.feedContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            onUpvote={handleUpvote}
            activeIdentityId={activeIdentity.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🌿</Text>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to post in this channel.</Text>
          </View>
        }
      />

      {/* ── FAB ────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => navigation.navigate('CreatePost')}
        activeOpacity={0.88}
      >
        <Text style={styles.fabLabel} allowFontScaling={false}>
          ✦
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ─────────────────────────────────────────
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  wordmark: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.maroon,
    letterSpacing: Typography.tightTracking,
  },

  // ── Segment control ───────────────────────────────
  segmentOuter: {
    paddingHorizontal: SEGMENT_H_PADDING,
    marginBottom: Spacing.base,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xl,
    padding: SEGMENT_INSET,
    position: 'relative',
    overflow: 'hidden',
    ...Shadow.xs,
  },
  segmentPill: {
    position: 'absolute',
    top: SEGMENT_INSET,
    left: SEGMENT_INSET,
    bottom: SEGMENT_INSET,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl - SEGMENT_INSET,
    ...Shadow.sm,
  },
  segmentItem: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // labels sit above the pill
  },
  segmentLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textMuted,
    letterSpacing: 0.1,
  },
  segmentLabelActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },

  // ── Feed ──────────────────────────────────────────
  feedContent: {
    paddingTop: Spacing.xs,
  },

  // ── Empty state ───────────────────────────────────
  empty: {
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.lineHeightSm,
  },

  // ── FAB ───────────────────────────────────────────
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 54,
    height: 54,
    borderRadius: Radius.full,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.fab,
  },
  fabLabel: {
    fontSize: 22,
    color: Colors.white,
    lineHeight: 26,
  },
});
