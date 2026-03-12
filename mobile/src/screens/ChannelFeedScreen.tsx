import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PostCard from '../components/PostCard';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { CHANNELS } from '../types';
import type { Channel, Post } from '../types';
import { MOCK_POSTS, MOCK_IDENTITIES } from '../services/mockData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ChannelFeedScreen() {
  const navigation = useNavigation<Nav>();
  const [activeChannel, setActiveChannel] = useState<Channel>('general');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // Use first identity as active for now; IdentityManager will control this later
  const activeIdentity = MOCK_IDENTITIES[0];

  const filtered = posts.filter((p) => p.channel === activeChannel);

  function handleUpvote(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyVoted = p.upvotedByMe;
        return {
          ...p,
          upvotedByMe: !alreadyVoted,
          upvoteCount: alreadyVoted ? p.upvoteCount - 1 : p.upvoteCount + 1,
        };
      })
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* App header */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>Charleston Tea</Text>
      </View>

      {/* Channel switcher */}
      <View style={styles.channelBar}>
        {CHANNELS.map((ch) => {
          const isActive = ch.id === activeChannel;
          return (
            <TouchableOpacity
              key={ch.id}
              onPress={() => setActiveChannel(ch.id)}
              style={[styles.channelBtn, isActive && styles.channelBtnActive]}
            >
              <Text style={[styles.channelLabel, isActive && styles.channelLabelActive]}>
                {ch.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feed */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.emptyText}>No posts yet. Be the first.</Text>
          </View>
        }
      />

      {/* Floating compose button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appHeader: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  appTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.maroon,
  },
  channelBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  channelBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  channelBtnActive: {
    backgroundColor: Colors.maroon,
  },
  channelLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  channelLabelActive: {
    color: Colors.white,
    fontWeight: Typography.semibold,
  },
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.base,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 22,
  },
});
