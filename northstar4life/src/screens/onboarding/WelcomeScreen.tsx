import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeLayout scrollable={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Northstar4Life</Text>
          <Text style={styles.subtitle}>
            Achieve balance across the five pillars of life and become your best self
          </Text>

          <View style={styles.pillars}>
            {[
              { emoji: '❤️', label: 'Health' },
              { emoji: '💰', label: 'Wealth' },
              { emoji: '💼', label: 'Career' },
              { emoji: '👥', label: 'Relationships' },
              { emoji: '🎯', label: 'Goals' },
            ].map((pillar) => (
              <View key={pillar.label} style={styles.pillarItem}>
                <Text style={styles.emoji}>{pillar.emoji}</Text>
                <Text style={styles.pillarLabel}>{pillar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Create Account"
            onPress={() => router.push('/(auth)/signup')}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/signin')}
            variant="secondary"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  pillars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  pillarItem: {
    width: '28%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
