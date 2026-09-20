import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { InputField } from '../../components/InputField';
import { RadioGroup } from '../../components/RadioGroup';
import { CITIES, GENDERS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../types/navigation';
import { RegisterErrors, RegisterFormValues, validateRegisterForm } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  email: '',
  gender: '',
  mobile: '',
  address: '',
  city: '',
  password: '',
  confirmPassword: '',
};

export const RegisterScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const setField = <K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleRegister = async () => {
    const validation = validateRegisterForm(values);
    setErrors(validation);
    setFormError(null);
    if (Object.keys(validation).length > 0 || values.gender === '') return;

    setSubmitting(true);
    const result = await register({
      fullName: values.fullName,
      email: values.email,
      gender: values.gender,
      mobile: values.mobile,
      address: values.address,
      city: values.city,
      password: values.password,
    });
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    Alert.alert('Account created', 'You can now log in with your email and password.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>All fields are required</Text>

          <InputField
            label="Full name"
            value={values.fullName}
            onChangeText={(text) => setField('fullName', text)}
            error={errors.fullName}
            autoCapitalize="words"
            placeholder="Your full name"
          />
          <InputField
            label="Email"
            value={values.email}
            onChangeText={(text) => setField('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
          />
          <RadioGroup
            label="Gender"
            options={GENDERS}
            value={values.gender}
            onChange={(gender) => setField('gender', gender)}
            error={errors.gender}
          />
          <InputField
            label="Mobile number"
            value={values.mobile}
            onChangeText={(text) => setField('mobile', text)}
            error={errors.mobile}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="10-digit mobile number"
          />
          <InputField
            label="Address"
            value={values.address}
            onChangeText={(text) => setField('address', text)}
            error={errors.address}
            multiline
            placeholder="Street, area"
          />
          <Dropdown
            label="City"
            options={CITIES}
            value={values.city}
            onSelect={(city) => setField('city', city)}
            placeholder="Select your city"
            error={errors.city}
          />
          <InputField
            label="Password"
            value={values.password}
            onChangeText={(text) => setField('password', text)}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            placeholder="At least 6 characters"
          />
          <InputField
            label="Confirm password"
            value={values.confirmPassword}
            onChangeText={(text) => setField('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Re-enter your password"
          />

          {formError ? <Text style={[styles.formError, { color: colors.danger }]}>{formError}</Text> : null}

          <Button title="Register" onPress={handleRegister} loading={submitting} />

          <View style={styles.footer}>
            <Text style={{ color: colors.textMuted }}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="link">
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24 },
  formError: { fontSize: 14, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
