import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface DropdownProps {
  label: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Dropdown = ({ label, options, value, onSelect, placeholder = 'Select', error }: DropdownProps) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border },
        ]}
      >
        <Text style={{ color: value ? colors.text : colors.textMuted, fontSize: 16 }}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  style={[styles.option, { borderBottomColor: colors.border }]}
                >
                  <Text style={{ color: colors.text, fontSize: 16 }}>{item}</Text>
                  {item === value ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  trigger: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: { fontSize: 13, marginTop: 4 },
  backdrop: { flex: 1, justifyContent: 'center', padding: 24 },
  sheet: { borderRadius: 14, maxHeight: '70%', paddingVertical: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 10 },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
