import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import FadeImage from './FadeImage';
import { Colors, Type, Space, Radius, Elevation, ms } from '../theme';
import { timeAgo } from '../utils/timeAgo';
import { logReport } from '../services/moderationService';
import type { Post } from '../types';

const ND = Platform.OS !== 'web';

interface Props {
  post: Post;
  onPress: () => void;
  onUpvote: (postId: string) => void;
  activeIdentityId: string;
}

export default function PostCard({ post, onPress, onUpvote, activeIdentityId }: Props) {
  const upvoteScale = useRef(new Animated.Value(1)).current;
  const isDating = post.channel === 'dating';

  function handleUpvote() {
    Animated.sequence([
      Animated.spring(upvoteScale, {
        toValue: 1.45,
        damping: 8,
        stiffness: 220,
        useNativeDriver: ND,
      }),
      Animated.spring(upvoteScale, {
        toValue: 1,
        damping: 12,
        stiffness: 200,
        useNativeDriver: ND,
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

  const upvoteColor = isDating
    ? (post.upvotedByMe ? Colors.datingHeart : Colors.textMuted)
    : (post.upvotedByMe ? Colors.success : Colors.textMuted);

  const upvoteIcon: React.ComponentProps<typeof Ionicons>['name'] = isDating
    ? (post.upvotedByMe ? 'heart' : 'heart-outline')
    : (post.upvotedByMe ? 'arrow-up-circle' : 'arrow-up-circle-outline');

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[
        styles.card,
        isDating && styles.cardDating,
      ]}>

        {/* Dating accent bar */}
        {isDating && <View style={styles.datingAccentBar} />}

        {/* Image */}
        {post.imageUri ? <FadeImage uri={post.imageUri} aspectRatio={4 / 3} /> : null}

        {/* Body */}
        <View style={styles.body}>
          <Text style={[styles.bodyText, isDating && styles.bodyTextDating]}>
            {post.textBody}
          </Text>
        </View>

        {/* Footer */}
        <View style={[styles.footer, isDating && styles.footerDating]}>

          {/* Left — identity */}
          <View style={styles.footerLeft}>
            <Avatar displayName={post.anonDisplayName} size={ms(34)} isDating={isDating} />
            <View style={styles.meta}>
              <Text style={styles.displayName} numberOfLines={1}>
                {post.anonDisplayName}
              </Text>
              <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
            </View>
          </View>

          {/* Right — actions */}
          <View style={styles.actions}>

            {/* Upvote / Heart */}
            <TouchableOpacity onPress={handleUpvote} activeOpacity={0.7} style={styles.action}>
              <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
                <Ionicons
                  name={upvoteIcon}
                  size={ms(16)}
                  color={upvoteColor}
                />
              </Animated.View>
              <Text style={[styles.actionCount, { color: upvoteColor }]}>
                {post.upvoteCount}
              </Text>
            </TouchableOpacity>

            {/* Comment */}
            <View style={styles.action}>
              <Ionicons name="chatbubble-outline" size={ms(15)} color={Colors.textMuted} />
              <Text style={styles.actionCount}>{post.commentCount}</Text>
            </View>

            {/* Share */}
            <View style={styles.action}>
              <Ionicons name="share-social-outline" size={ms(15)} color={Colors.textMuted} />
              <Text style={styles.actionCount}>{post.shareCount}</Text>
            </View>

            {/* Report */}
            <TouchableOpacity
              onPress={handleReport}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={ms(16)} color={Colors.textMuted} />
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
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    marginHorizontal: Space.md,
    marginBottom: Space.sm,
    overflow: 'hidden',
    ...Elevation.card,
  },
  cardDating: {
    backgroundColor: Colors.datingCard,
    borderColor: Colors.datingBorder,
  },

  // Dating accent bar — left edge rose stripe
  datingAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.datingPrimary,
    zIndex: 1,
  },

  // Body
  body: {
    paddingHorizontal: Space.md,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
    paddingLeft: Space.md + 3, // offset for dating bar on dating posts (handled by conditional)
  },
  bodyText: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.regular,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
  },
  bodyTextDating: {
    fontSize: ms(15),
    lineHeight: ms(22),
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  footerDating: {
    borderTopColor: Colors.datingBorder,
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
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
    letterSpacing: 0,
  },
  timestamp: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },

  // Actions
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
  actionCount: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
    minWidth: 14,
  },
});
