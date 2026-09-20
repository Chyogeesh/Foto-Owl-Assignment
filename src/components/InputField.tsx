import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  /** Renders the value as plain, non-editable text styling. */
  readOnly?: boolean;
}

export const InputField = ({ label, error, readOnly, secureTextEntry, style, ...rest }: InputFieldProps) => {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState<boolean>(true);
  const isPassword = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: readOnly ? colors.background : colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <TextInput
          {...rest}
          editable={readOnly ? false : rest.editable}
          secureTextEntry={isPassword && hidden}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: readOnly ? colors.textMuted : colors.text }, style]}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: { flex: 1, minHeight: 46, fontSize: 16 },
  error: { fontSize: 13, marginTop: 4 },
});
