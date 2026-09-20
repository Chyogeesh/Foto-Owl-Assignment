import { useMemo } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';

export const useFavorites = () => {
  const favorites = useGalleryStore((state) => state.favorites);
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const favoriteIds = useMemo(() => new Set(favorites.map((image) => image.id)), [favorites]);
  return { favorites, favoriteIds, toggleFavorite };
};
