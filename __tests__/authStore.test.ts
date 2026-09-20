import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../src/store/useAuthStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// expo-crypto needs the native module, so use a deterministic stand-in here.
jest.mock('../src/utils/security', () => ({
  hashPassword: async (email: string, password: string) =>
    `hash:${[...`${email.trim().toLowerCase()}:${password}`].map((c) => c.charCodeAt(0) + 1).join('-')}`,
}));

const payload = {
  fullName: 'Asha Rao',
  email: 'Asha@Example.com',
  gender: 'Female' as const,
  mobile: '9876543210',
  address: '12 Main Road',
  city: 'Vijayawada',
  password: 'secret1',
};

const resetStore = () => useAuthStore.setState({ user: null, isAuthenticated: false, isHydrated: false });

beforeEach(async () => {
  await AsyncStorage.clear();
  resetStore();
});

describe('useAuthStore', () => {
  it('registers a user and rejects duplicates', async () => {
    expect(await useAuthStore.getState().register(payload)).toEqual({ success: true });
    const duplicate = await useAuthStore.getState().register({ ...payload, email: 'asha@example.com' });
    expect(duplicate.success).toBe(false);
  });

  it('never stores the plain-text password', async () => {
    await useAuthStore.getState().register(payload);
    const raw = (await AsyncStorage.getItem('@foto_owl/users')) ?? '';
    expect(raw).not.toContain('secret1');
  });

  it('logs in with correct credentials and rejects wrong ones', async () => {
    await useAuthStore.getState().register(payload);

    const bad = await useAuthStore.getState().login('asha@example.com', 'wrong');
    expect(bad.success).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    const good = await useAuthStore.getState().login('ASHA@example.com', 'secret1');
    expect(good.success).toBe(true);
    expect(useAuthStore.getState().user?.fullName).toBe('Asha Rao');
    expect(useAuthStore.getState().user).not.toHaveProperty('passwordHash');
  });

  it('restores the session after a "restart"', async () => {
    await useAuthStore.getState().register(payload);
    await useAuthStore.getState().login(payload.email, payload.password);

    resetStore(); // simulate app restart: memory is gone, AsyncStorage remains
    await useAuthStore.getState().loadSession();

    expect(useAuthStore.getState().isHydrated).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('asha@example.com');
  });

  it('updates the profile and persists it', async () => {
    await useAuthStore.getState().register(payload);
    await useAuthStore.getState().login(payload.email, payload.password);

    const result = await useAuthStore.getState().updateProfile({
      fullName: 'Asha R',
      gender: 'Female',
      mobile: '9123456780',
      address: 'New address',
      city: 'Pune',
    });
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user?.city).toBe('Pune');

    resetStore();
    await useAuthStore.getState().loadSession();
    expect(useAuthStore.getState().user?.mobile).toBe('9123456780');
  });

  it('clears the session on logout', async () => {
    await useAuthStore.getState().register(payload);
    await useAuthStore.getState().login(payload.email, payload.password);
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    resetStore();
    await useAuthStore.getState().loadSession();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
