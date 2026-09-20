export type Gender = 'Male' | 'Female' | 'Other';

/** Public profile data kept in app state and shown on the Profile screen. */
export interface User {
  fullName: string;
  email: string;
  mobile: string;
  gender: Gender;
  address: string;
  city: string;
}

/** What actually lives in AsyncStorage: the user plus a salted password hash. */
export interface StoredUser extends User {
  passwordHash: string;
}

export interface RegisterPayload extends User {
  password: string;
}

/** Fields a user may edit after registering (email is the login key, so it is fixed). */
export type ProfileUpdate = Omit<User, 'email'>;

export type ActionResult = { success: true } | { success: false; error: string };
