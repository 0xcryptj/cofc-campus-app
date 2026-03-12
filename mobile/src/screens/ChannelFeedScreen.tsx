import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import { Colors, Type, Space, Radius, Elevation } from '../theme';
import { CHANNELS } from '../types';
import type { Channel, Post } from '../types';
import { MOCK_POSTS, MOCK_IDENTITIES } from '../services/mockData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Segment control layout ───────────────────────────────────────────────────
const SEGMENT_PAD   = Space.md;           // horizontal padding of outer container
const INSET         = 3;                  // inner padding of the pill track
const TRACK_WIDTH   = SCREEN_WIDTH - SEGMENT_PAD * 2;
const PILL_WIDTH    = (TRACK_WIDTH - INSET * 2) / CHANNELS.length;

export default function ChannelFeedScreen() {
  const navigation   = useNavigation<Nav>();
  const insets       = useSafeAreaInsets();
  const [activeIdx, setActiveIdx] = useState(0);
  const [posts, setPosts]         = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [loading]    = useState(false); // set true to preview skeleton

  const pillX = useRef(new Animated.Value(0)).current;
  const activeIdentity = MOCK_IDENTITIES[0];
  const activeChannel: Channel = CHANNELS[activeIdx].id;
  const filtered = posts.filter(p => p.channel === activeChannel);

  function selectChannel(idx: number) {
    setActiveIdx(idx);
    Animated.spring(pillX, {
      toValue: idx * PILL_WIDTH,
      damping: 15,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800)); // TODO: refetch from Supabase
    setRefreshing(false);
  }, []);

  function handleUpvote(postId: string) {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const voted = p.upvotedByMe;
        return { ...p, upvotedByMe: !voted, upvoteCount: voted ? p.upvoteCount - 1 : p.upvoteCount + 1 };
      })
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Header ────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.wordmark} allowFontScaling={false}>
          Charleston Tea
        </Text>
      </View>

      {/* ── Segment control ───────────────────────────── */}
      <View style={styles.segmentOuter}>
        <View style={styles.segmentTrack}>
          {/* Sliding pill */}
          <Animated.View
            style={[
              styles.segmentPill,
              { width: PILL_WIDTH, transform: [{ translateX: pillX }] },
            ]}
          />
          {/* Labels — rendered above the pill via zIndex */}
          {CHANNELS.map((ch, i) => {
            const active = i === activeIdx;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.segmentItem, { width: PILL_WIDTH }]}
                onPress={() => selectChannel(i)}
                activeOpacity={0.75}
              >
                <Text
                  style={[styles.segmentLabel, active && styles.segmentLabelActive]}
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

      {/* ── Skeleton loading ──────────────────────────── */}
      {loading ? (
        <View>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        /* ── Feed ─────────────────────────────────────── */
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.feedContent,
            { paddingBottom: insets.bottom + 88 },
          ]}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={3}
          removeClippedSubviews={Platform.OS === 'android'}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
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
              <Text style={styles.emptyTitle}>Nothing here yet.</Text>
              <Text style={styles.emptySubtitle}>Be the first.</Text>
            </View>
          }
        />
      )}

      {/* ── FAB ───────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + Space.lg }]}
        onPress={() => navigation.navigate('CreatePost')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon} allowFontScaling={false}>+</Text>
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
    paddingHorizontal: Space.md,
    paddingTop: Space.sm,
    paddingBottom: Space.sm,
  },
  wordmark: {
    fontSize: Type.size.section,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.primary,
    letterSpacing: Type.tracking.tight,
  },

  // ── Segment ───────────────────────────────────────
  segmentOuter: {
    paddingHorizontal: SEGMENT_PAD,
    marginBottom: Space.sm,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.border,
    borderRadius: Radius.xl,
    padding: INSET,
    overflow: 'hidden',
  },
  segmentPill: {
    position: 'absolute',
    top: INSET,
    left: INSET,
    bottom: INSET,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl - INSET,
  },
  segmentItem: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  segmentLabelActive: {
    color: Colors.white,
  },

  // ── Feed ──────────────────────────────────────────
  feedContent: {
    paddingTop: Space.xs,
  },

  // ── Empty state ───────────────────────────────────
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Space.xs,
  },
  emptyTitle: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
  },
  emptySubtitle: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
  },

  // ── FAB ───────────────────────────────────────────
  fab: {
    position: 'absolute',
    right: Space.lg,
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 26,
    color: Colors.white,
    lineHeight: 30,
    marginTop: -1,
  },
});
