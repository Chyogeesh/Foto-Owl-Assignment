import React, { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { FullScreenImageViewer } from '../../components/FullScreenImageViewer';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';
import type { MainStackParamList } from '../../types/navigation';
import { downloadImageToGallery } from '../../utils/download';
import { getDetailUrl } from '../../utils/images';

type Props = NativeStackScreenProps<MainStackParamList, 'ImageDetail'>;

export const ImageDetailScreen = ({ route }: Props) => {
  const { image } = route.params;
  const { colors } = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const isFavorite = favoriteIds.has(image.id);
  const imageUri = getDetailUrl(image);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadImageToGallery(image);
      Alert.alert('Saved', 'The image was saved to your gallery.');
    } catch (error) {
      Alert.alert('Download failed', error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setDownloading(false);
    }
  }, [downloading, image]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: `Photo by ${image.author}: ${image.url}` });
    } catch {
      Alert.alert('Could not share', 'Sharing is not available right now.');
    }
  }, [image]);

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Pressable
        onPress={() => setViewerOpen(true)}
        accessibilityRole="imagebutton"
        accessibilityLabel="Open image in full screen"
      >
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { aspectRatio: image.width / image.height, backgroundColor: colors.border }]}
          resizeMode="contain"
        />
        <View style={styles.expandHint}>
          <Ionicons name="expand-outline" size={18} color="#FFFFFF" />
        </View>
      </Pressable>

      <View style={styles.infoRow}>
        <View style={styles.info}>
          <Text style={[styles.author, { color: colors.text }]}>{image.author}</Text>
          <Text style={{ color: colors.textMuted, marginTop: 2 }}>Image ID: {image.id}</Text>
          <Text style={{ color: colors.textMuted, marginTop: 2 }}>
            {image.width} × {image.height}
          </Text>
        </View>
        <Pressable
          onPress={() => toggleFavorite(image)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={30}
            color={isFavorite ? colors.heart : colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Button title="Download" onPress={handleDownload} loading={downloading} style={styles.action} />
        <Button title="Share" onPress={handleShare} variant="outline" style={styles.action} />
      </View>
      <Button title="View full screen" onPress={() => setViewerOpen(true)} variant="outline" />

      <FullScreenImageViewer
        visible={viewerOpen}
        uri={imageUri}
        author={image.author}
        onClose={() => setViewerOpen(false)}
        onDownload={handleDownload}
        downloading={downloading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  image: { width: '100%', borderRadius: 12 },
  expandHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1 },
  author: { fontSize: 22, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1 },
});
