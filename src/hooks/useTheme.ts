import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, type Palette } from '../theme/theme';

/** Follows the device light/dark setting. */
export const useTheme = (): { colors: Palette; isDark: boolean } => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: isDark ? darkPalette : lightPalette, isDark };
};
