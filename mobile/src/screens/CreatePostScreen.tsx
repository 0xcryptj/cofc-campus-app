import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { Colors, Type, Space, Radius, Elevation } from '../theme';
import { CHANNELS } from '../types';
import type { Channel } from '../types';
import { MOCK_IDENTITIES } from '../services/mockData';

const MAX_CHARS = 500;

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [channel, setChannel] = useState<Channel>('general');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeIdentity = MOCK_IDENTITIES[0];
  const remaining = MAX_CHARS - text.length;
  const canPost = text.trim().length > 0 && text.length <= MAX_CHARS;

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
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Image too large', 'Please choose an image under 5MB.');
        return;
      }
      setImageUri(asset.uri);
    }
  }

  async function handlePost() {
    if (!canPost) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // TODO: Supabase insert
    setLoading(false);
    navigation.goBack();
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Space.xxl }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      {/* ── Identity row ──────────────────────────── */}
      <View style={styles.identityRow}>
        <Avatar displayName={activeIdentity.displayName} size={48} />
        <View>
          <Text style={styles.identityLabel}>Posting as</Text>
          <Text style={styles.identityName}>{activeIdentity.displayName}</Text>
        </View>
      </View>

      {/* ── Channel selector ──────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Channel</Text>
        <View style={styles.channelRow}>
          {CHANNELS.map(ch => {
            const active = ch.id === channel;
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setChannel(ch.id)}
                style={[styles.channelChip, active && styles.channelChipActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.channelChipLabel, active && styles.channelChipLabelActive]}>
                  {ch.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Compose ───────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Post</Text>
        <TextInput
          style={styles.compose}
          placeholder="What's the tea?"
          placeholderTextColor={Colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          maxLength={MAX_CHARS}
        />
        <Text style={[styles.charCount, remaining < 50 && styles.charCountWarn]}>
          {remaining}
        </Text>
      </View>

      {/* ── Photo ─────────────────────────────────── */}
      {imageUri ? (
        <View style={styles.imagePreviewWrap}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
            <Text style={styles.removeImageText} allowFontScaling={false}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage} activeOpacity={0.7}>
          <Text style={styles.addPhotoIcon}>📷</Text>
          <Text style={styles.addPhotoLabel}>Add Photo</Text>
        </TouchableOpacity>
      )}

      {/* ── Submit ────────────────────────────────── */}
      <Button
        label="Post Anonymously"
        onPress={handlePost}
        disabled={!canPost}
        loading={loading}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Space.md,
    gap: Space.lg,
  },

  // ── Identity ──────────────────────────────────
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.sm,
  },
  identityLabel: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
  },
  identityName: {
    fontSize: Type.size.body,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textPrimary,
  },

  // ── Section ───────────────────────────────────
  section: {
    gap: Space.sm,
  },
  sectionLabel: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.label,
    textTransform: 'uppercase',
  },

  // ── Channel chips ─────────────────────────────
  channelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  channelChip: {
    paddingVertical: Space.xs + 2,
    paddingHorizontal: Space.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
  },
  channelChipActive: {
    backgroundColor: Colors.primaryFaint,
    borderColor: Colors.primary,
  },
  channelChipLabel: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },
  channelChipLabelActive: {
    color: Colors.primary,
  },

  // ── Compose textarea ──────────────────────────
  compose: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    padding: Space.md,
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
    minHeight: 100,
    maxHeight: 300,
    borderWidth: 2,
    borderColor: Colors.transparent,
  },
  charCount: {
    fontSize: Type.size.caption,
    fontWeight: Type.weight.medium,
    color: Colors.textMuted,
    textAlign: 'right',
    letterSpacing: Type.tracking.caption,
  },
  charCountWarn: {
    color: Colors.error,
  },

  // ── Image ─────────────────────────────────────
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    height: 52,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addPhotoIcon: {
    fontSize: 18,
  },
  addPhotoLabel: {
    fontSize: Type.size.body,
    color: Colors.textMuted,
    fontWeight: Type.weight.medium,
  },
  imagePreviewWrap: {
    position: 'relative',
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Elevation.card,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  removeImageBtn: {
    position: 'absolute',
    top: Space.sm,
    right: Space.sm,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: Type.weight.bold,
    fontFamily: 'SpaceMono_700Bold',
  },
});
