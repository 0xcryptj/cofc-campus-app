import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { timeAgo } from '../utils/timeAgo';
import { logReport } from '../services/moderationService';
import type { Post } from '../types';

interface Props {
  post: Post;
  onPress: () => void;
  onUpvote: (postId: string) => void;
  activeIdentityId: string; // the identity currently in use
}

export default function PostCard({ post, onPress, onUpvote, activeIdentityId }: Props) {
  function handleReport() {
    Alert.alert('Report Post', 'Why are you reporting this?', [
      {
        text: 'Spam',
        onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'spam' }),
      },
      {
        text: 'Harassment',
        onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'harassment' }),
      },
      {
        text: 'Inappropriate',
        onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'inappropriate' }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header row */}
      <View style={styles.header}>
        {/* Avatar circle */}
        <View style={[styles.avatar, { backgroundColor: post.anonAvatarColor }]}>
          <Text style={styles.avatarInitial}>
            {post.anonDisplayName[0]}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.displayName}>{post.anonDisplayName}</Text>
          <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
        </View>

        <TouchableOpacity onPress={handleReport} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.moreIcon}>···</Text>
        </TouchableOpacity>
      </View>

      {/* Post text */}
      <Text style={styles.body}>{post.textBody}</Text>

      {/* Optional image */}
      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} resizeMode="cover" />
      ) : null}

      {/* Footer row */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => onUpvote(post.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.upvoteIcon, post.upvotedByMe && styles.upvotedIcon]}>
            ▲
          </Text>
          <Text style={[styles.footerCount, post.upvotedByMe && styles.upvotedCount]}>
            {post.upvoteCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerBtn}>
          <Text style={styles.commentIcon}>💬</Text>
          <Text style={styles.footerCount}>{post.commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  headerText: {
    flex: 1,
  },
  displayName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  moreIcon: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    letterSpacing: 1,
    paddingLeft: Spacing.sm,
  },
  body: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  upvoteIcon: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  upvotedIcon: {
    color: Colors.maroon,
  },
  footerCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  upvotedCount: {
    color: Colors.maroon,
    fontWeight: Typography.bold,
  },
  commentIcon: {
    fontSize: Typography.sm,
  },
});
