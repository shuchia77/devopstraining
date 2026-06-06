import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export function SignupScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, loading, error: authError, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }
    if (!email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    clearError();
    if (!validateForm()) return;

    try {
      await signUp(email, password, displayName);
      router.replace('/(auth)/onboarding');
    } catch (error) {
      Alert.alert('Error', authError || 'Failed to create account');
    }
  };

  return (
    <SafeLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
            containerStyle={styles.input}
          />

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

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            containerStyle={styles.input}
          />

          {authError && <Text style={styles.generalError}>{authError}</Text>}

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/signin')}>
            <Text style={styles.link}>Sign In</Text>
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
  },
  form: {
    flex: 1,
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  submitButton: {
    marginTop: 8,
  },
  generalError: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
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
