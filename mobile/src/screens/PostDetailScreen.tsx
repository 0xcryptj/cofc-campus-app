import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, RefreshControl,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import FadeImage from '../components/FadeImage';
import { Colors, Type, Space, Radius, Elevation } from '../theme';
import { timeAgo } from '../utils/timeAgo';
import { logReport } from '../services/moderationService';
import { MOCK_COMMENTS, MOCK_IDENTITIES } from '../services/mockData';
import type { Comment } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ route }: Props) {
  const { post } = route.params;
  const insets = useSafeAreaInsets();
  const [comments, setComments] = useState<Comment[]>(
    MOCK_COMMENTS.filter(c => c.postId === post.id)
  );
  const [draft, setDraft] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const activeIdentity = MOCK_IDENTITIES[0];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    const c: Comment = {
      id: `c-${Date.now()}`,
      postId: post.id,
      anonIdentityId: activeIdentity.id,
      anonDisplayName: activeIdentity.displayName,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, c]);
    setDraft('');
  }

  function reportComment(id: string) {
    Alert.alert('Report Comment', 'What is the issue?', [
      { text: 'Harassment', onPress: () => logReport({ reporterId: activeIdentity.id, contentId: id, contentType: 'comment', reason: 'harassment' }) },
      { text: 'Spam', onPress: () => logReport({ reporterId: activeIdentity.id, contentId: id, contentType: 'comment', reason: 'spam' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

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
            tintColor={Colors.primary}
          />
        }

        /* ── Original post — pinned at top ─────────── */
        ListHeaderComponent={
          <View>
            <View style={styles.pinnedCard}>
              {post.imageUri ? <FadeImage uri={post.imageUri} aspectRatio={4 / 3} /> : null}
              <View style={styles.pinnedBody}>
                <Text style={styles.pinnedText}>{post.textBody}</Text>
              </View>
              <View style={styles.pinnedFooter}>
                <Avatar displayName={post.anonDisplayName} size={36} />
                <View style={styles.pinnedMeta}>
                  <Text style={styles.pinnedName}>{post.anonDisplayName}</Text>
                  <Text style={styles.pinnedTime}>{timeAgo(post.createdAt)}</Text>
                </View>
                <View style={styles.pinnedStats}>
                  <Text style={styles.statText}>▲ {post.upvoteCount}</Text>
                  <Text style={styles.statText}>◯ {post.commentCount}</Text>
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

        /* ── Comment rows ──────────────────────────── */
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Avatar displayName={item.anonDisplayName} size={36} />
            <View style={styles.commentBubble}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentName}>{item.anonDisplayName}</Text>
                <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
                <TouchableOpacity
                  onPress={() => reportComment(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.commentReport}
                >
                  <View style={styles.dotRow}>
                    <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* ── Reply bar — pinned above keyboard ─────── */}
      <View style={[styles.replyBar, { paddingBottom: insets.bottom + Space.sm }]}>
        <Avatar displayName={activeIdentity.displayName} size={36} />
        <TextInput
          style={styles.replyInput}
          placeholder="Reply anonymously…"
          placeholderTextColor={Colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
          returnKeyType="default"
        />
        <TouchableOpacity
          onPress={submitComment}
          disabled={!draft.trim()}
          style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
        >
          <Text style={styles.sendBtnText} allowFontScaling={false}>↑</Text>
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

  // ── Pinned post ─────────────────────────────────
  pinnedCard: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Space.sm,
    ...Elevation.card,
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
  pinnedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Space.sm,
  },
  pinnedMeta: {
    flex: 1,
    gap: 1,
  },
  pinnedName: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.bold,
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
  statText: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },

  // ── Comments section label ───────────────────────
  commentsHeading: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
    paddingHorizontal: Space.md,
    paddingBottom: Space.sm,
  },

  // ── Comment row ─────────────────────────────────
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
    borderRadius: Radius.md,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.card,
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
  dotRow: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
  },

  // ── Reply bar ─────────────────────────────────────
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingTop: Space.sm,
    gap: Space.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  replyInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    maxHeight: 100,
    lineHeight: Type.leading.body,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
  sendBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: Type.weight.bold,
    lineHeight: 22,
  },
});
