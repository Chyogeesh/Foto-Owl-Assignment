import type { Gender } from '../types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile.trim());
};

export const MIN_PASSWORD_LENGTH = 6;

export interface RegisterFormValues {
  fullName: string;
  email: string;
  gender: Gender | '';
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobile?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export interface ProfileFormValues {
  fullName: string;
  gender: Gender | '';
  mobile: string;
  address: string;
  city: string;
}

export type ProfileErrors = Partial<Record<keyof ProfileFormValues, string>>;

const isBlank = (value: string): boolean => value.trim().length === 0;

const getEmailError = (email: string): string | undefined => {
  if (isBlank(email)) return 'Email is required';
  if (!validateEmail(email)) return 'Enter a valid email address';
  return undefined;
};

const getMobileError = (mobile: string): string | undefined => {
  const value = mobile.trim();
  if (value.length === 0) return 'Mobile number is required';
  if (!/^[0-9]+$/.test(value)) return 'Mobile number must contain digits only';
  if (!validateMobile(value)) return 'Mobile number must be exactly 10 digits';
  return undefined;
};

const getPasswordError = (password: string): string | undefined => {
  if (password.length === 0) return 'Password is required';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return undefined;
};

const stripUndefined = <T extends object>(errors: T): T => {
  const cleaned = {} as T;
  (Object.keys(errors) as (keyof T)[]).forEach((key) => {
    if (errors[key] !== undefined) cleaned[key] = errors[key];
  });
  return cleaned;
};

export const validateRegisterForm = (values: RegisterFormValues): RegisterErrors => {
  const errors: RegisterErrors = {
    fullName: isBlank(values.fullName) ? 'Full name is required' : undefined,
    email: getEmailError(values.email),
    gender: values.gender === '' ? 'Select a gender' : undefined,
    mobile: getMobileError(values.mobile),
    address: isBlank(values.address) ? 'Address is required' : undefined,
    city: isBlank(values.city) ? 'Select a city' : undefined,
    password: getPasswordError(values.password),
  };

  if (values.confirmPassword.length === 0) {
    errors.confirmPassword = 'Confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return stripUndefined(errors);
};

export const validateLoginForm = (email: string, password: string): LoginErrors =>
  stripUndefined<LoginErrors>({
    email: getEmailError(email),
    password: password.length === 0 ? 'Password is required' : undefined,
  });

export const validateProfileForm = (values: ProfileFormValues): ProfileErrors =>
  stripUndefined<ProfileErrors>({
    fullName: isBlank(values.fullName) ? 'Full name is required' : undefined,
    gender: values.gender === '' ? 'Select a gender' : undefined,
    mobile: getMobileError(values.mobile),
    address: isBlank(values.address) ? 'Address is required' : undefined,
    city: isBlank(values.city) ? 'Select a city' : undefined,
  });
