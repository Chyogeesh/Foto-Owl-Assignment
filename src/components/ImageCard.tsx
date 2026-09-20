import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import type { PicsumImage } from '../types/gallery';
import { getThumbnailUrl } from '../utils/images';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: (image: PicsumImage) => void;
  onToggleFavorite: (image: PicsumImage) => void;
}

const ImageCardComponent = ({ image, isFavorite, onPress, onToggleFavorite }: ImageCardProps) => {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Photo by ${image.author}`}
      onPress={() => onPress(image)}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Image
        source={{ uri: getThumbnailUrl(image.id) }}
        style={[styles.image, { backgroundColor: colors.border }]}
        resizeMode="cover"
      />
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>
            {image.author}
          </Text>
          <Text style={[styles.id, { color: colors.textMuted }]}>ID: {image.id}</Text>
        </View>
        <Pressable
          onPress={() => onToggleFavorite(image)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? colors.heart : colors.textMuted}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export const ImageCard = memo(ImageCardComponent);

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 14 },
  image: { width: '100%', aspectRatio: 3 / 2 },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  meta: { flex: 1 },
  author: { fontSize: 16, fontWeight: '700' },
  id: { fontSize: 13, marginTop: 2 },
});
