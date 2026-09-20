import * as Crypto from 'expo-crypto';

/**
 * Hashes the password with SHA-256, salted with the (lower-cased) email, so the
 * plain-text password is never written to AsyncStorage.
 * NOTE: this is a local-only demo scheme. A real backend should use a slow hash
 * (bcrypt/argon2) on the server.
 */
export const hashPassword = (email: string, password: string): Promise<string> =>
  Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${email.trim().toLowerCase()}:${password}`,
  );
