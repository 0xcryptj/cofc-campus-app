import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import FadeImage from './FadeImage';
import { timeAgo } from '../utils/timeAgo';
import { logReport } from '../services/moderationService';
import type { Post } from '../types';

interface Props {
  post: Post;
  onPress: () => void;
  onUpvote: (postId: string) => void;
  activeIdentityId: string;
}

export default function PostCard({ post, onPress, onUpvote, activeIdentityId }: Props) {
  const upvoteScale = useRef(new Animated.Value(1)).current;

  function handleUpvoteTap() {
    Animated.sequence([
      Animated.spring(upvoteScale, {
        toValue: 1.45,
        useNativeDriver: true,
        speed: 40,
        bounciness: 14,
      }),
      Animated.spring(upvoteScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
    onUpvote(post.id);
  }

  function handleReport() {
    Alert.alert('Report Post', 'Why are you reporting this?', [
      {
        text: 'Spam',
        onPress: () =>
          logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'spam' }),
      },
      {
        text: 'Harassment',
        onPress: () =>
          logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'harassment' }),
      },
      {
        text: 'Inappropriate',
        onPress: () =>
          logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'inappropriate' }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    // Outer press target for navigating to detail
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>

        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: post.anonAvatarColor }]}>
            <Text style={styles.avatarInitial} allowFontScaling={false}>
              {post.anonDisplayName[0]}
            </Text>
          </View>

          <View style={styles.headerMeta}>
            <Text style={styles.displayName} numberOfLines={1}>
              {post.anonDisplayName}
            </Text>
            <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleReport}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            style={styles.moreBtn}
          >
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </TouchableOpacity>
        </View>

        {/* ── Body text ─────────────────────────────────── */}
        <Text style={styles.body}>{post.textBody}</Text>

        {/* ── Image (bleeds edge-to-edge inside the card) ─ */}
        {post.imageUri ? (
          <View style={styles.imageWrapper}>
            <FadeImage uri={post.imageUri} aspectRatio={4 / 3} />
          </View>
        ) : null}

        {/* ── Footer actions ────────────────────────────── */}
        <View style={styles.footer}>
          {/* Upvote */}
          <TouchableOpacity
            onPress={handleUpvoteTap}
            activeOpacity={0.75}
            style={styles.action}
          >
            <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
              <View style={[styles.upvoteIcon, post.upvotedByMe && styles.upvoteIconActive]}>
                <Text style={[styles.upvoteChevron, post.upvotedByMe && styles.upvoteChevronActive]}>
                  ▲
                </Text>
              </View>
            </Animated.View>
            <Text style={[styles.actionCount, post.upvotedByMe && styles.actionCountActive]}>
              {post.upvoteCount}
            </Text>
          </TouchableOpacity>

          {/* Comments */}
          <View style={styles.action}>
            <View style={styles.commentIcon}>
              <Text style={styles.commentChevron}>◯</Text>
            </View>
            <Text style={styles.actionCount}>{post.commentCount}</Text>
          </View>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    overflow: 'hidden',  // clips image to card corners — critical
    ...Shadow.sm,
  },

  // ── Header ─────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: Typography.bold,
    letterSpacing: 0.2,
  },
  headerMeta: {
    flex: 1,
    gap: 1,
  },
  displayName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    letterSpacing: Typography.tightTracking,
  },
  timestamp: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: Typography.regular,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingLeft: Spacing.sm,
  },
  moreDot: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
  },

  // ── Body ────────────────────────────────────────────
  body: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightBase,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    letterSpacing: Typography.normalTracking,
  },

  // ── Image ───────────────────────────────────────────
  imageWrapper: {
    // No padding — FadeImage fills the card width edge to edge.
    // The card's overflow:hidden clips it to the border radius.
  },

  // ── Footer ──────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    gap: Spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  upvoteIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upvoteIconActive: {
    backgroundColor: Colors.maroonFaint,
  },
  upvoteChevron: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 12,
  },
  upvoteChevronActive: {
    color: Colors.maroon,
  },
  commentIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentChevron: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 14,
  },
  actionCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    minWidth: 16,
  },
  actionCountActive: {
    color: Colors.maroon,
    fontWeight: Typography.semibold,
  },
});
