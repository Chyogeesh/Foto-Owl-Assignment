import { create } from 'zustand';
import type {
  ActionResult,
  ProfileUpdate,
  RegisterPayload,
  StoredUser,
  User,
} from '../types/auth';
import { hashPassword } from '../utils/security';
import { STORAGE_KEYS, getItem, removeItem, setItem } from '../utils/storage';

type UsersMap = Record<string, StoredUser>;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** false until the persisted session has been read from AsyncStorage. */
  isHydrated: boolean;
  register: (payload: RegisterPayload) => Promise<ActionResult>;
  login: (email: string, password: string) => Promise<ActionResult>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (update: ProfileUpdate) => Promise<ActionResult>;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const toPublicUser = ({ passwordHash: _passwordHash, ...user }: StoredUser): User => user;

const readUsers = async (): Promise<UsersMap> => (await getItem<UsersMap>(STORAGE_KEYS.users)) ?? {};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  register: async (payload) => {
    try {
      const email = normalizeEmail(payload.email);
      const users = await readUsers();
      if (users[email]) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      const { password, ...profile } = payload;
      users[email] = {
        ...profile,
        fullName: profile.fullName.trim(),
        address: profile.address.trim(),
        mobile: profile.mobile.trim(),
        email,
        passwordHash: await hashPassword(email, password),
      };
      await setItem(STORAGE_KEYS.users, users);
      return { success: true };
    } catch (error) {
      console.warn('register failed', error);
      return { success: false, error: 'Could not save your account. Please try again.' };
    }
  },

  login: async (email, password) => {
    try {
      const key = normalizeEmail(email);
      const users = await readUsers();
      const stored = users[key];
      const hash = stored ? await hashPassword(key, password) : null;
      if (!stored || stored.passwordHash !== hash) {
        return { success: false, error: 'Invalid email or password.' };
      }
      await setItem(STORAGE_KEYS.session, key);
      set({ user: toPublicUser(stored), isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.warn('login failed', error);
      return { success: false, error: 'Could not log you in. Please try again.' };
    }
  },

  logout: async () => {
    try {
      await removeItem(STORAGE_KEYS.session);
    } catch (error) {
      console.warn('logout: could not clear session', error);
    }
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      const email = await getItem<string>(STORAGE_KEYS.session);
      if (email) {
        const users = await readUsers();
        const stored = users[email];
        if (stored) {
          set({ user: toPublicUser(stored), isAuthenticated: true });
        } else {
          await removeItem(STORAGE_KEYS.session);
        }
      }
    } catch (error) {
      console.warn('loadSession failed', error);
    } finally {
      set({ isHydrated: true });
    }
  },

  updateProfile: async (update) => {
    const current = get().user;
    if (!current) return { success: false, error: 'You are not logged in.' };
    try {
      const users = await readUsers();
      const stored = users[current.email];
      if (!stored) return { success: false, error: 'Account not found.' };
      const next: StoredUser = {
        ...stored,
        ...update,
        fullName: update.fullName.trim(),
        address: update.address.trim(),
        mobile: update.mobile.trim(),
      };
      users[current.email] = next;
      await setItem(STORAGE_KEYS.users, users);
      set({ user: toPublicUser(next) });
      return { success: true };
    } catch (error) {
      console.warn('updateProfile failed', error);
      return { success: false, error: 'Could not save your changes. Please try again.' };
    }
  },
}));
