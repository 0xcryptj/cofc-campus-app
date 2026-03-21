import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import { Colors, Type, Space, Radius, ms } from '../theme';
import { CHANNELS } from '../types';
import type { Channel, Post } from '../types';
import { MOCK_IDENTITIES } from '../services/mockData';
import { getPosts, upvotePost, apiPostToLocal } from '../services/api';
import type { RootStackParamList } from '../navigation/RootNavigator';

const ND = Platform.OS !== 'web';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const INSET = 3;
const SEGMENT_H = ms(36);
const MAX_TRACK = 400;

export default function ChannelFeedScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const TRACK_WIDTH = Math.min(screenWidth - Space.md * 2, MAX_TRACK);
  const PILL_WIDTH  = (TRACK_WIDTH - INSET * 2) / CHANNELS.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const pillX = useRef(new Animated.Value(0)).current;
  const activeIdentity = MOCK_IDENTITIES[0];
  const activeChannel: Channel = CHANNELS[activeIdx].id;
  const isDating = activeChannel === 'dating';

  const fetchPosts = useCallback(async (channel: Channel) => {
    try {
      const apiPosts = await getPosts(channel);
      setPosts(apiPosts.map(apiPostToLocal));
    } catch {
      // fall back gracefully — empty feed
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts(activeChannel);
  }, [activeChannel, fetchPosts]);

  function selectChannel(idx: number) {
    setActiveIdx(idx);
    Animated.spring(pillX, {
      toValue: idx * PILL_WIDTH,
      damping: 16,
      stiffness: 200,
      useNativeDriver: ND,
    }).start();
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts(activeChannel);
    setRefreshing(false);
  }, [activeChannel, fetchPosts]);

  function handleUpvote(postId: string) {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const voted = p.upvotedByMe;
        const newCount = voted ? p.upvoteCount - 1 : p.upvoteCount + 1;
        // Fire and forget — optimistic update
        if (!voted) upvotePost(postId).catch(() => {});
        return { ...p, upvotedByMe: !voted, upvoteCount: newCount };
      })
    );
  }

  const activePillColor = isDating ? Colors.datingPrimary : Colors.primary;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.wordmark, isDating && styles.wordmarkDating]} allowFontScaling={false}>
          Charleston Tea
        </Text>
        {isDating && (
          <Text style={styles.datingTagline} allowFontScaling={false}>
            Find your person
          </Text>
        )}
      </View>

      {/* Segment control */}
      <View style={styles.segmentOuter}>
        <View style={[styles.segmentTrack, { width: TRACK_WIDTH }]}>
          <Animated.View
            style={[
              styles.segmentPill,
              {
                width: PILL_WIDTH,
                backgroundColor: activePillColor,
                transform: [{ translateX: pillX }],
              },
            ]}
          />
          {CHANNELS.map((ch, i) => {
            const active = i === activeIdx;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.segmentItem, { width: PILL_WIDTH, height: SEGMENT_H }]}
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

      {/* Skeleton / Feed */}
      {loading ? (
        <View>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.feedContent,
            { paddingBottom: insets.bottom + ms(100) },
          ]}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={3}
          removeClippedSubviews={Platform.OS === 'android'}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={isDating ? Colors.datingPrimary : Colors.primary}
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
              <Ionicons
                name={isDating ? 'heart-outline' : 'chatbubbles-outline'}
                size={ms(40)}
                color={isDating ? Colors.datingPrimary : Colors.textMuted}
                style={{ marginBottom: Space.sm }}
              />
              <Text style={styles.emptyTitle}>Nothing here yet.</Text>
              <Text style={styles.emptySubtitle}>Be the first to post.</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + Space.lg },
          isDating && styles.fabDating,
        ]}
        onPress={() => navigation.navigate('CreatePost')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={ms(26)} color={Colors.white} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: Space.md,
    paddingTop: Space.sm,
    paddingBottom: Space.xs,
  },
  wordmark: {
    fontSize: Type.size.section,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.primary,
    letterSpacing: Type.tracking.tight,
  },
  wordmarkDating: {
    color: Colors.datingPrimary,
  },
  datingTagline: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.datingPrimary,
    letterSpacing: Type.tracking.label,
    marginTop: 1,
    opacity: 0.75,
  },

  segmentOuter: {
    alignItems: 'center',
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
    borderRadius: Radius.xl - INSET,
  },
  segmentItem: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  segmentLabel: {
    fontSize: ms(11),
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: 0,
  },
  segmentLabelActive: {
    color: Colors.white,
  },

  feedContent: {
    paddingTop: Space.xs,
  },

  empty: {
    alignItems: 'center',
    paddingTop: ms(80),
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

  fab: {
    position: 'absolute',
    right: Space.lg,
    width: ms(54),
    height: ms(54),
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    ...Platform.select({
      web:     { boxShadow: '0px 6px 14px rgba(128,0,32,0.30)' },
      default: { shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 14 },
    }),
  },
  fabDating: {
    backgroundColor: Colors.datingPrimary,
    ...Platform.select({
      web:     { boxShadow: '0px 6px 14px rgba(201,81,90,0.30)' },
      default: { shadowColor: Colors.datingPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 14 },
    }),
  },
});
