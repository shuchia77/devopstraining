import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { resetPassword, loading } = useAuthStore();

  const handleReset = async () => {
    if (!email.includes('@')) {
      setError('Valid email is required');
      return;
    }

    try {
      await resetPassword(email);
      setSubmitted(true);
      Alert.alert('Success', 'Check your email for a password reset link');
    } catch (err) {
      setError('Failed to send reset email');
    }
  };

  return (
    <SafeLayout>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {submitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>✓</Text>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to {email}
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => router.push('/auth/signin')}
                variant="primary"
                size="large"
                style={styles.button}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>

              <Input
                label="Email"
                placeholder="john@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={error}
                containerStyle={styles.input}
              />

              <Button
                title="Send Reset Link"
                onPress={handleReset}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.button}
              />
            </>
          )}
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 24,
  },
  content: {
    flex: 1,
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 0,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
});
