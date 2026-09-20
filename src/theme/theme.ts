export interface Palette {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  danger: string;
  heart: string;
  overlay: string;
}

export const lightPalette: Palette = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  danger: '#DC2626',
  heart: '#EF4444',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkPalette: Palette = {
  background: '#0F1115',
  surface: '#1A1D24',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  border: '#2A2F3A',
  primary: '#818CF8',
  onPrimary: '#0F1115',
  danger: '#F87171',
  heart: '#F87171',
  overlay: 'rgba(0,0,0,0.7)',
};
