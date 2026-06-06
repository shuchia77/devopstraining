import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export function SigninScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, loading, error: authError, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async () => {
    clearError();
    if (!validateForm()) return;

    try {
      await signIn(email, password);
      router.replace('/(main)/home');
    } catch (error) {
      Alert.alert('Error', authError || 'Failed to sign in');
    }
  };

  return (
    <SafeLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            containerStyle={styles.input}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            containerStyle={styles.input}
          />

          {authError && <Text style={styles.generalError}>{authError}</Text>}

          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSignin}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.link}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  forgotPassword: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  generalError: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
