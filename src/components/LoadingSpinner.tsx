import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface LoadingSpinnerProps {
  message?: string;
  /** Fill the whole screen (true) or just the parent's height (false). */
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ message, fullScreen = true }: LoadingSpinnerProps) => {
  const { colors } = useTheme();
  return (
    <View style={[fullScreen ? styles.full : styles.inline, { backgroundColor: fullScreen ? colors.background : 'transparent' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inline: { paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
  message: { marginTop: 12, fontSize: 14 },
});
