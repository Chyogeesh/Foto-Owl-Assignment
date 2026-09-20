import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGalleryStore } from '../src/store/useGalleryStore';
import type { PicsumImage } from '../src/types/gallery';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const image: PicsumImage = {
  id: '10',
  author: 'Paul Jarvis',
  width: 2500,
  height: 1667,
  url: 'https://unsplash.com/photos/x',
  download_url: 'https://picsum.photos/id/10/2500/1667',
};

beforeEach(async () => {
  await AsyncStorage.clear();
  useGalleryStore.getState().clearFavorites();
});

describe('useGalleryStore', () => {
  it('toggles favorites on and off', async () => {
    await useGalleryStore.getState().loadFavorites('a@b.co');
    await useGalleryStore.getState().toggleFavorite(image);
    expect(useGalleryStore.getState().favorites).toHaveLength(1);
    await useGalleryStore.getState().toggleFavorite(image);
    expect(useGalleryStore.getState().favorites).toHaveLength(0);
  });

  it('persists favorites per user across a "restart"', async () => {
    await useGalleryStore.getState().loadFavorites('a@b.co');
    await useGalleryStore.getState().toggleFavorite(image);

    useGalleryStore.getState().clearFavorites();
    await useGalleryStore.getState().loadFavorites('a@b.co');
    expect(useGalleryStore.getState().favorites.map((i) => i.id)).toEqual(['10']);

    await useGalleryStore.getState().loadFavorites('someone-else@b.co');
    expect(useGalleryStore.getState().favorites).toHaveLength(0);
  });
});
