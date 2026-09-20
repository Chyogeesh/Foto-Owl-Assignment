import AsyncStorage from '@react-native-async-storage/async-storage';

/** All AsyncStorage keys live here so they are easy to audit. */
export const STORAGE_KEYS = {
  users: '@foto_owl/users',
  session: '@foto_owl/session_email',
  favorites: (email: string) => `@foto_owl/favorites/${email}`,
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch (error) {
    console.warn(`storage.getItem failed for ${key}`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
