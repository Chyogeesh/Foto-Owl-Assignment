import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { InputField } from '../../components/InputField';
import { RadioGroup } from '../../components/RadioGroup';
import { CITIES, GENDERS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import type { User } from '../../types/auth';
import { ProfileErrors, ProfileFormValues, validateProfileForm } from '../../utils/validation';

const toFormValues = (user: User): ProfileFormValues => ({
  fullName: user.fullName,
  gender: user.gender,
  mobile: user.mobile,
  address: user.address,
  city: user.city,
});

export const ProfileScreen = () => {
  const { colors } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState<boolean>(false);
  const [values, setValues] = useState<ProfileFormValues | null>(null);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState<boolean>(false);

  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const startEditing = () => {
    setValues(toFormValues(user));
    setErrors({});
    setEditing(true);
  };

  const setField = <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    if (!values) return;
    const validation = validateProfileForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0 || values.gender === '') return;

    setSaving(true);
    const result = await updateProfile({
      fullName: values.fullName,
      gender: values.gender,
      mobile: values.mobile,
      address: values.address,
      city: values.city,
    });
    setSaving(false);

    if (result.success) {
      setEditing(false);
    } else {
      Alert.alert('Could not save', result.error);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Full name', value: user.fullName },
    { label: 'Email', value: user.email },
    { label: 'Mobile number', value: user.mobile },
    { label: 'Gender', value: user.gender },
    { label: 'Address', value: user.address },
    { label: 'City', value: user.city },
  ];

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.onPrimary }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
        </View>

        {editing && values ? (
          <View>
            <InputField
              label="Full name"
              value={values.fullName}
              onChangeText={(text) => setField('fullName', text)}
              error={errors.fullName}
              autoCapitalize="words"
            />
            <InputField label="Email (cannot be changed)" value={user.email} readOnly />
            <InputField
              label="Mobile number"
              value={values.mobile}
              onChangeText={(text) => setField('mobile', text)}
              error={errors.mobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <RadioGroup
              label="Gender"
              options={GENDERS}
              value={values.gender}
              onChange={(gender) => setField('gender', gender)}
              error={errors.gender}
            />
            <InputField
              label="Address"
              value={values.address}
              onChangeText={(text) => setField('address', text)}
              error={errors.address}
              multiline
            />
            <Dropdown
              label="City"
              options={CITIES}
              value={values.city}
              onSelect={(city) => setField('city', city)}
              error={errors.city}
            />
            <View style={styles.row}>
              <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} style={styles.flex} />
              <Button title="Save changes" onPress={handleSave} loading={saving} style={styles.flex} />
            </View>
          </View>
        ) : (
          <View>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {rows.map((row, index) => (
                <View
                  key={row.label}
                  style={[
                    styles.detailRow,
                    index < rows.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{row.label}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{row.value}</Text>
                </View>
              ))}
            </View>
            <Button title="Edit profile" onPress={startEditing} style={styles.gap} />
            <Button title="Log out" variant="danger" onPress={confirmLogout} style={styles.gap} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginVertical: 16 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 30, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', marginTop: 12 },
  card: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16 },
  detailRow: { paddingVertical: 12 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  row: { flexDirection: 'row', gap: 12, marginTop: 6 },
  gap: { marginTop: 14 },
});
