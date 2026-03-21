import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import FadeImage from '../components/FadeImage';
import { Colors, Type, Space, Radius, Elevation, ms } from '../theme';
import { timeAgo } from '../utils/timeAgo';
import { MOCK_IDENTITIES } from '../services/mockData';
import { getComments, addComment, submitReport, apiCommentToLocal } from '../services/api';
import type { Comment } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ route }: Props) {
  const { post } = route.params;
  const insets = useSafeAreaInsets();
  const isDating = post.channel === 'dating';
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const activeIdentity = MOCK_IDENTITIES[0];

  const loadComments = useCallback(async () => {
    try {
      const apiComments = await getComments(post.id);
      setComments(apiComments.map(apiCommentToLocal));
    } catch {
      // non-blocking — keep empty list
    }
  }, [post.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  }, [loadComments]);

  async function submitComment() {
    const text = draft.trim();
    if (!text) return;
    // Optimistic add
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      postId: post.id,
      anonIdentityId: activeIdentity.id,
      anonDisplayName: activeIdentity.displayName,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, tempComment]);
    setDraft('');
    try {
      const saved = await addComment({
        postId: post.id,
        body: text,
        public_alias: activeIdentity.displayName,
      });
      setComments(prev =>
        prev.map(c => c.id === tempComment.id ? apiCommentToLocal(saved) : c)
      );
    } catch {
      // Keep optimistic comment visible; it'll be re-fetched on refresh
    }
  }

  function reportComment(id: string) {
    Alert.alert('Report Comment', 'What is the issue?', [
      { text: 'Harassment', onPress: () => submitReport({ target_type: 'comment', target_id: id, reason: 'harassment' }).catch(() => {}) },
      { text: 'Spam', onPress: () => submitReport({ target_type: 'comment', target_id: id, reason: 'spam' }).catch(() => {}) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  const accentColor = isDating ? Colors.datingPrimary : Colors.primary;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: Space.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={accentColor}
          />
        }

        ListHeaderComponent={
          <View>
            <View style={[styles.pinnedCard, isDating && styles.pinnedCardDating]}>
              {isDating && <View style={[styles.datingAccentBar, { backgroundColor: Colors.datingPrimary }]} />}
              {post.imageUri ? <FadeImage uri={post.imageUri} aspectRatio={4 / 3} /> : null}
              <View style={styles.pinnedBody}>
                <Text style={[styles.pinnedText, isDating && styles.pinnedTextDating]}>
                  {post.textBody}
                </Text>
              </View>
              <View style={[styles.pinnedFooter, isDating && styles.pinnedFooterDating]}>
                <Avatar displayName={post.anonDisplayName} size={ms(36)} isDating={isDating} />
                <View style={styles.pinnedMeta}>
                  <Text style={styles.pinnedName}>{post.anonDisplayName}</Text>
                  <Text style={styles.pinnedTime}>{timeAgo(post.createdAt)}</Text>
                </View>
                <View style={styles.pinnedStats}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name={isDating ? 'heart-outline' : 'arrow-up-circle-outline'}
                      size={ms(14)}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.statText}>{post.upvoteCount}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={ms(13)} color={Colors.textMuted} />
                    <Text style={styles.statText}>{post.commentCount}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.commentsHeading}>
              {comments.length === 0
                ? 'No replies yet'
                : `${comments.length} ${comments.length === 1 ? 'reply' : 'replies'}`}
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Avatar displayName={item.anonDisplayName} size={ms(34)} isDating={isDating} />
            <View style={[styles.commentBubble, isDating && styles.commentBubbleDating]}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentName}>{item.anonDisplayName}</Text>
                <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
                <TouchableOpacity
                  onPress={() => reportComment(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.commentReport}
                >
                  <Ionicons name="ellipsis-horizontal" size={ms(14)} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* Reply bar */}
      <View style={[styles.replyBar, { paddingBottom: insets.bottom + Space.sm }]}>
        <Avatar displayName={activeIdentity.displayName} size={ms(34)} isDating={isDating} />
        <TextInput
          style={[styles.replyInput, isDating && styles.replyInputDating]}
          placeholder={isDating ? 'Reply anonymously…' : 'Reply anonymously…'}
          placeholderTextColor={Colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
          returnKeyType="default"
        />
        <TouchableOpacity
          onPress={submitComment}
          disabled={!draft.trim()}
          style={[
            styles.sendBtn,
            { backgroundColor: accentColor },
            !draft.trim() && styles.sendBtnDisabled,
          ]}
        >
          <Ionicons name="arrow-up" size={ms(16)} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Pinned post
  pinnedCard: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    marginBottom: Space.sm,
    ...Elevation.card,
  },
  pinnedCardDating: {
    backgroundColor: Colors.datingCard,
    borderBottomColor: Colors.datingBorder,
  },
  datingAccentBar: {
    height: 3,
  },
  pinnedBody: {
    paddingHorizontal: Space.md,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
  },
  pinnedText: {
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
  },
  pinnedTextDating: {
    fontSize: ms(15),
    lineHeight: ms(22),
  },
  pinnedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Space.sm,
  },
  pinnedFooterDating: {
    borderTopColor: Colors.datingBorder,
  },
  pinnedMeta: {
    flex: 1,
    gap: 1,
  },
  pinnedName: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
  },
  pinnedTime: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },
  pinnedStats: {
    flexDirection: 'row',
    gap: Space.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },

  // Comments section label
  commentsHeading: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
    paddingHorizontal: Space.md,
    paddingBottom: Space.sm,
  },

  // Comment row
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: Space.md,
    marginBottom: Space.sm,
    gap: Space.sm,
    alignItems: 'flex-start',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Space.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    ...Elevation.card,
  },
  commentBubbleDating: {
    backgroundColor: Colors.datingCard,
    borderColor: Colors.datingBorder,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Space.xs,
    gap: Space.sm,
  },
  commentName: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  commentTime: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },
  commentReport: {
    paddingLeft: Space.xs,
  },
  commentText: {
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
  },

  // Reply bar
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingTop: Space.sm,
    gap: Space.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  replyInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.xl,
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    maxHeight: ms(100),
    lineHeight: Type.leading.body,
  },
  replyInputDating: {
    backgroundColor: Colors.datingHeartFaint,
  },
  sendBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
});
