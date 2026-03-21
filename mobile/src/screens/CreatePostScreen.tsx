import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { Colors, Type, Space, Radius, Elevation, ms } from '../theme';
import { CHANNELS } from '../types';
import type { Channel } from '../types';
import { MOCK_IDENTITIES } from '../services/mockData';
import { createPost } from '../services/api';

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
  const isDating = channel === 'dating';

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
    try {
      await createPost({
        channel,
        body: text.trim(),
        public_alias: activeIdentity.displayName,
      });
      navigation.goBack();
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Could not post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Space.xxl }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      {/* Identity row */}
      <View style={styles.identityRow}>
        <Avatar displayName={activeIdentity.displayName} size={ms(46)} isDating={isDating} />
        <View>
          <Text style={styles.identityLabel}>Posting as</Text>
          <Text style={styles.identityName}>{activeIdentity.displayName}</Text>
        </View>
      </View>

      {/* Channel selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Channel</Text>
        <View style={styles.channelRow}>
          {CHANNELS.map(ch => {
            const active = ch.id === channel;
            const isThisDating = ch.id === 'dating';
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setChannel(ch.id)}
                style={[
                  styles.channelChip,
                  active && {
                    backgroundColor: isThisDating ? Colors.datingFaint : Colors.primaryFaint,
                    borderColor: isThisDating ? Colors.datingPrimary : Colors.primary,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.channelChipLabel,
                  active && { color: isThisDating ? Colors.datingPrimary : Colors.primary },
                ]}>
                  {ch.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Compose */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Post</Text>
        <TextInput
          style={[
            styles.compose,
            isDating && styles.composeDating,
          ]}
          placeholder={isDating ? "What's on your mind? 💌" : "What's the tea?"}
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

      {/* Photo */}
      {imageUri ? (
        <View style={styles.imagePreviewWrap}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
            <Ionicons name="close" size={ms(14)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.addPhotoBtn, { borderColor: isDating ? Colors.datingBorder : Colors.border }]} onPress={pickImage} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={ms(20)} color={isDating ? Colors.datingPrimary : Colors.textMuted} />
          <Text style={[styles.addPhotoLabel, isDating && { color: Colors.datingPrimary }]}>
            Add Photo
          </Text>
        </TouchableOpacity>
      )}

      {/* Submit */}
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
  channelChipLabel: {
    fontSize: Type.size.label,
    fontWeight: Type.weight.semibold,
    fontFamily: 'SpaceMono_700Bold',
    color: Colors.textMuted,
    letterSpacing: Type.tracking.caption,
  },

  compose: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    padding: Space.md,
    fontSize: Type.size.body,
    color: Colors.textPrimary,
    lineHeight: Type.leading.body,
    minHeight: ms(110),
    maxHeight: ms(280),
    borderWidth: 1.5,
    borderColor: Colors.transparent,
  },
  composeDating: {
    backgroundColor: Colors.datingHeartFaint,
    borderColor: Colors.datingBorder,
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

  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    height: ms(52),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
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
    width: ms(28),
    height: ms(28),
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
