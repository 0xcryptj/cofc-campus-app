import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import { Colors, Typography, Spacing, Radius } from '../theme';
import { CHANNELS } from '../types';
import type { Channel } from '../types';
import { MOCK_IDENTITIES } from '../services/mockData';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [channel, setChannel] = useState<Channel>('general');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeIdentity = MOCK_IDENTITIES[0];
  const MAX_CHARS = 500;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to attach an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      // Rough size check: ~5MB max (fileSize is in bytes, may not always be present)
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Image too large', 'Please choose an image under 5MB.');
        return;
      }
      setImageUri(asset.uri);
    }
  }

  function removeImage() {
    setImageUri(null);
  }

  async function handlePost() {
    if (!text.trim()) {
      Alert.alert('Empty post', 'Write something before posting.');
      return;
    }
    setLoading(true);
    // TODO: replace with Supabase insert
    await new Promise((res) => setTimeout(res, 600)); // simulate network
    setLoading(false);
    Alert.alert('Posted!', 'Your post has been submitted.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  const canPost = text.trim().length > 0 && text.length <= MAX_CHARS;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Active identity display */}
      <View style={styles.identityRow}>
        <View style={[styles.avatar, { backgroundColor: activeIdentity.avatarColor }]}>
          <Text style={styles.avatarInitial}>{activeIdentity.displayName[0]}</Text>
        </View>
        <Text style={styles.identityName}>{activeIdentity.displayName}</Text>
      </View>

      {/* Channel selector */}
      <Text style={styles.sectionLabel}>Channel</Text>
      <View style={styles.channelRow}>
        {CHANNELS.map((ch) => {
          const isActive = ch.id === channel;
          return (
            <TouchableOpacity
              key={ch.id}
              onPress={() => setChannel(ch.id)}
              style={[styles.channelChip, isActive && styles.channelChipActive]}
            >
              <Text style={[styles.channelChipLabel, isActive && styles.channelChipLabelActive]}>
                {ch.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Text input */}
      <Text style={styles.sectionLabel}>Post</Text>
      <TextInput
        style={styles.textInput}
        placeholder="What's the tea?"
        placeholderTextColor={Colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={MAX_CHARS}
        textAlignVertical="top"
      />
      <Text style={styles.charCount}>
        {text.length} / {MAX_CHARS}
      </Text>

      {/* Photo section */}
      {imageUri ? (
        <View style={styles.imagePreviewWrapper}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
          <Text style={styles.addPhotoIcon}>📷</Text>
          <Text style={styles.addPhotoLabel}>Add Photo</Text>
        </TouchableOpacity>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.postBtn, (!canPost || loading) && styles.postBtnDisabled]}
        onPress={handlePost}
        disabled={!canPost || loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.postBtnText}>Post Anonymously</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
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
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  identityName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  channelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  channelChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  channelChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  channelChipLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  channelChipLabelActive: {
    color: Colors.white,
    fontWeight: Typography.semibold,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Spacing.xs,
    marginBottom: Spacing.base,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  addPhotoIcon: {
    fontSize: 20,
  },
  addPhotoLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
  },
  removeImageBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: Typography.bold,
  },
  postBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  postBtnDisabled: {
    opacity: 0.45,
  },
  postBtnText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
});
