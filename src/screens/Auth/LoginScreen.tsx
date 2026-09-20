import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../types/navigation';
import { LoginErrors, validateLoginForm } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);
    setErrors(validation);
    setFormError(null);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    const result = await login(email, password);
    // On success the root navigator swaps to the main stack and unmounts this screen.
    if (!result.success) {
      setFormError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>Foto Owl</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Log in to browse your gallery</Text>

          <InputField
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Your password"
          />

          {formError ? <Text style={[styles.formError, { color: colors.danger }]}>{formError}</Text> : null}

          <Button title="Log in" onPress={handleLogin} loading={submitting} style={styles.submit} />

          <View style={styles.footer}>
            <Text style={{ color: colors.textMuted }}>New here? </Text>
            <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="link">
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Create an account</Text>
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
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '800' },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 28 },
  formError: { fontSize: 14, marginBottom: 12 },
  submit: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
