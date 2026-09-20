import { create } from 'zustand';
import type { PicsumImage } from '../types/gallery';
import { STORAGE_KEYS, getItem, setItem } from '../utils/storage';

interface GalleryState {
  favorites: PicsumImage[];
  /** Email of the user the in-memory favorites belong to. */
  ownerEmail: string | null;
  loadFavorites: (email: string) => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  clearFavorites: () => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],
  ownerEmail: null,

  loadFavorites: async (email) => {
    set({ ownerEmail: email, favorites: [] });
    const saved = await getItem<PicsumImage[]>(STORAGE_KEYS.favorites(email));
    // Ignore the result if the user changed while we were reading.
    if (get().ownerEmail === email) {
      set({ favorites: Array.isArray(saved) ? saved : [] });
    }
  },

  toggleFavorite: async (image) => {
    const { favorites, ownerEmail } = get();
    if (!ownerEmail) return;
    const exists = favorites.some((item) => item.id === image.id);
    const next = exists ? favorites.filter((item) => item.id !== image.id) : [image, ...favorites];
    set({ favorites: next });
    try {
      await setItem(STORAGE_KEYS.favorites(ownerEmail), next);
    } catch (error) {
      console.warn('Could not persist favorites', error);
    }
  },

  clearFavorites: () => set({ favorites: [], ownerEmail: null }),
}));
