import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../store/useAuthStore';

/** Thin selector hook so screens do not depend on the store's internals. */
export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isHydrated: state.isHydrated,
      register: state.register,
      login: state.login,
      logout: state.logout,
      loadSession: state.loadSession,
      updateProfile: state.updateProfile,
    })),
  );
