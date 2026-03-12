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
import Avatar from './Avatar';
import FadeImage from './FadeImage';
import { Colors, Type, Space, Radius, Elevation } from '../theme';
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

  function handleUpvote() {
    Animated.sequence([
      Animated.spring(upvoteScale, {
        toValue: 1.5,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.spring(upvoteScale, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
    onUpvote(post.id);
  }

  function handleReport() {
    Alert.alert('Report Post', 'What is the issue?', [
      { text: 'Spam', onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'spam' }) },
      { text: 'Harassment', onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'harassment' }) },
      { text: 'Inappropriate', onPress: () => logReport({ reporterId: activeIdentityId, contentId: post.id, contentType: 'post', reason: 'inappropriate' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>

        {/* ── Image — bleeds edge-to-edge at top ───────── */}
        {post.imageUri ? <FadeImage uri={post.imageUri} aspectRatio={4 / 3} /> : null}

        {/* ── Body text ─────────────────────────────────── */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>{post.textBody}</Text>
        </View>

        {/* ── Footer ────────────────────────────────────── */}
        <View style={styles.footer}>

          {/* Left — identity */}
          <View style={styles.footerLeft}>
            <Avatar displayName={post.anonDisplayName} size={36} />
            <View style={styles.meta}>
              <Text style={styles.displayName} numberOfLines={1}>
                {post.anonDisplayName}
              </Text>
              <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
            </View>
          </View>

          {/* Right — actions */}
          <View style={styles.actions}>

            {/* Upvote */}
            <TouchableOpacity onPress={handleUpvote} activeOpacity={0.7} style={styles.action}>
              <Animated.Text
                style={[
                  styles.actionIcon,
                  post.upvotedByMe && styles.upvoteActive,
                  { transform: [{ scale: upvoteScale }] },
                ]}
                allowFontScaling={false}
              >
                ▲
              </Animated.Text>
              <Text style={[styles.actionCount, post.upvotedByMe && styles.upvoteActiveCount]}>
                {post.upvoteCount}
              </Text>
            </TouchableOpacity>

            {/* Comment */}
            <View style={styles.action}>
              <Text style={styles.actionIcon} allowFontScaling={false}>◯</Text>
              <Text style={styles.actionCount}>{post.commentCount}</Text>
            </View>

            {/* Share — stub */}
            <View style={styles.action}>
              <Text style={styles.actionIcon} allowFontScaling={false}>↗</Text>
              <Text style={styles.actionCount}>{post.shareCount}</Text>
            </View>

            {/* Report */}
            <TouchableOpacity
              onPress={handleReport}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <View style={styles.dotsRow}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Space.md,
    marginBottom: Space.sm,
    overflow: 'hidden',
    ...Elevation.card,
  },

  // ── Body ────────────────────────────────────────
  body: {
    paddingHorizontal: Space.md,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
  },
  bodyText: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.regular,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
  },

  // ── Footer ──────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    flex: 1,
    minWidth: 0,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  displayName: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: 0,
  },
  timestamp: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },

  // ── Actions ─────────────────────────────────────
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  actionCount: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
    minWidth: 14,
  },
  upvoteActive: {
    color: Colors.success,
  },
  upvoteActiveCount: {
    color: Colors.success,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    paddingLeft: Space.xs,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
  },
});
