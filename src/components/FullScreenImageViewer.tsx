import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FullScreenImageViewerProps {
  visible: boolean;
  uri: string;
  author: string;
  onClose: () => void;
  onDownload: () => void;
  downloading: boolean;
}

export const FullScreenImageViewer = ({
  visible,
  uri,
  author,
  onClose,
  onDownload,
  downloading,
}: FullScreenImageViewerProps) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onShow={() => setLoaded(false)}
    >
      <View style={styles.container}>
        <Image
          source={{ uri }}
          style={{ width, height }}
          resizeMode="contain"
          onLoadEnd={() => setLoaded(true)}
        />
        {!loaded ? <ActivityIndicator size="large" color="#FFFFFF" style={StyleSheet.absoluteFill} /> : null}

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={styles.roundButton}
            accessibilityRole="button"
            accessibilityLabel="Close full screen viewer"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
          <Pressable
            onPress={onDownload}
            disabled={downloading}
            hitSlop={10}
            style={styles.roundButton}
            accessibilityRole="button"
            accessibilityLabel="Download image"
          >
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name="download-outline" size={22} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    gap: 12,
  },
  roundButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  author: { flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
