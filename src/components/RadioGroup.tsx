import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface RadioGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
}

export function RadioGroup<T extends string>({ label, options, value, onChange, error }: RadioGroupProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option)}
              style={styles.option}
            >
              <View style={[styles.outer, { borderColor: selected ? colors.primary : colors.border }]}>
                {selected ? <View style={[styles.inner, { backgroundColor: colors.primary }]} /> : null}
              </View>
              <Text style={{ color: colors.text, fontSize: 15 }}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { width: 11, height: 11, borderRadius: 6 },
  error: { fontSize: 13, marginTop: 4 },
});
