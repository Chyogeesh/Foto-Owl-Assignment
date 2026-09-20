import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '../../components/EmptyState';
import { FilterChips } from '../../components/FilterChips';
import { ImageCard } from '../../components/ImageCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchBar } from '../../components/SearchBar';
import { SEARCH_DEBOUNCE_MS } from '../../constants';
import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../hooks/useFavorites';
import { useFetchImages } from '../../hooks/useFetchImages';
import { useTheme } from '../../hooks/useTheme';
import type { FilterMode, PicsumImage } from '../../types/gallery';
import type { MainStackParamList } from '../../types/navigation';
import { filterImages } from '../../utils/filterImages';

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'A-M', label: 'Author A–M' },
  { value: 'N-Z', label: 'Author N–Z' },
] as const;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { images, initialLoading, loadingMore, refreshing, error, hasMore, loadMore, refresh, retry } =
    useFetchImages();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [searchText, setSearchText] = useState<string>('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const debouncedSearch = useDebounce(searchText, SEARCH_DEBOUNCE_MS);

  const filteredImages = useMemo(
    () => filterImages(images, debouncedSearch, filterMode),
    [images, debouncedSearch, filterMode],
  );

  const handlePress = useCallback(
    (image: PicsumImage) => navigation.navigate('ImageDetail', { image }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <ImageCard
        image={item}
        isFavorite={favoriteIds.has(item.id)}
        onPress={handlePress}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favoriteIds, handlePress, toggleFavorite],
  );

  const keyExtractor = useCallback((item: PicsumImage) => item.id, []);

  if (initialLoading) return <LoadingSpinner message="Loading images..." />;

  if (error && images.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load images"
          message={error}
          actionLabel="Try again"
          onAction={retry}
        />
      </View>
    );
  }

  const isFiltering = debouncedSearch.trim().length > 0 || filterMode !== 'ALL';

  const renderFooter = () => {
    if (loadingMore) return <LoadingSpinner fullScreen={false} />;
    if (error) {
      return (
        <Pressable onPress={retry} style={styles.footerMessage} accessibilityRole="button">
          <Text style={{ color: colors.danger, textAlign: 'center' }}>{error} Tap to retry.</Text>
        </Pressable>
      );
    }
    if (!hasMore && images.length > 0) {
      return <Text style={[styles.footerMessage, { color: colors.textMuted }]}>You've reached the end.</Text>;
    }
    return null;
  };

  const renderEmpty = () => {
    if (images.length === 0) {
      return (
        <EmptyState
          icon="images-outline"
          title="No images available"
          message="Pull down to refresh."
          actionLabel="Refresh"
          onAction={refresh}
        />
      );
    }
    return (
      <EmptyState
        icon="search-outline"
        title="No matching images"
        message={
          hasMore
            ? 'Nothing among the loaded images matches. Load more or change your search.'
            : 'Try a different author name or filter.'
        }
        actionLabel={hasMore && isFiltering ? 'Load more images' : undefined}
        onAction={hasMore && isFiltering ? loadMore : undefined}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.controls}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FilterChips options={FILTER_OPTIONS} selected={filterMode} onChange={setFilterMode} />
      </View>
      <FlatList
        data={filteredImages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 10 },
  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 },
  footerMessage: { paddingVertical: 16, textAlign: 'center' },
});
