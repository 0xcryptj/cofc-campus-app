import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { timeAgo } from '../utils/timeAgo';
import { logReport } from '../services/moderationService';
import { MOCK_COMMENTS, MOCK_IDENTITIES } from '../services/mockData';
import type { Comment } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ route }: Props) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>(
    MOCK_COMMENTS.filter((c) => c.postId === post.id)
  );
  const [draft, setDraft] = useState('');

  const activeIdentity = MOCK_IDENTITIES[0];

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId: post.id,
      anonIdentityId: activeIdentity.id,
      anonDisplayName: activeIdentity.displayName,
      anonAvatarColor: activeIdentity.avatarColor,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setDraft('');
  }

  function reportComment(commentId: string) {
    Alert.alert('Report Comment', 'Why are you reporting this?', [
      {
        text: 'Harassment',
        onPress: () =>
          logReport({ reporterId: activeIdentity.id, contentId: commentId, contentType: 'comment', reason: 'harassment' }),
      },
      {
        text: 'Spam',
        onPress: () =>
          logReport({ reporterId: activeIdentity.id, contentId: commentId, contentType: 'comment', reason: 'spam' }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* Post body */}
            <View style={styles.postCard}>
              <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: post.anonAvatarColor }]}>
                  <Text style={styles.avatarInitial}>{post.anonDisplayName[0]}</Text>
                </View>
                <View>
                  <Text style={styles.displayName}>{post.anonDisplayName}</Text>
                  <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
                </View>
              </View>
              <Text style={styles.postBody}>{post.textBody}</Text>
              {post.imageUri ? (
                <Image source={{ uri: post.imageUri }} style={styles.postImage} resizeMode="cover" />
              ) : null}
              <View style={styles.postStats}>
                <Text style={styles.statText}>▲ {post.upvoteCount}</Text>
                <Text style={styles.statText}>💬 {post.commentCount}</Text>
              </View>
            </View>

            {/* Comments heading */}
            <Text style={styles.commentsHeading}>
              {comments.length === 0 ? 'No comments yet' : `Comments (${comments.length})`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={[styles.commentAvatar, { backgroundColor: item.anonAvatarColor }]}>
                <Text style={styles.commentAvatarInitial}>{item.anonDisplayName[0]}</Text>
              </View>
              <View style={styles.commentMeta}>
                <Text style={styles.commentName}>{item.anonDisplayName}</Text>
                <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
              </View>
              <TouchableOpacity onPress={() => reportComment(item.id)}>
                <Text style={styles.commentMoreIcon}>···</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Comment input bar */}
      <View style={styles.inputBar}>
        <View style={[styles.inputAvatar, { backgroundColor: activeIdentity.avatarColor }]}>
          <Text style={styles.inputAvatarInitial}>{activeIdentity.displayName[0]}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
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
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingBottom: Spacing.xl,
  },
  postCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: Typography.base,
  },
  displayName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  postBody: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 23,
    marginBottom: Spacing.sm,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  postStats: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  statText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  commentsHeading: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  commentCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.card,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  commentAvatarInitial: {
    color: Colors.white,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  commentMeta: {
    flex: 1,
  },
  commentName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  commentTime: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  commentMoreIcon: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  commentText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
    paddingLeft: 28 + Spacing.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputAvatar: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputAvatarInitial: {
    color: Colors.white,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
