import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  const slides = [
    {
      emoji: '🌟',
      title: 'Welcome to Northstar4Life',
      description: 'Your personal guide to a balanced and fulfilling life',
    },
    {
      emoji: '📊',
      title: 'Track Your Progress',
      description: 'Daily check-ins across 5 life pillars: Health, Wealth, Career, Relationships, and Goals',
    },
    {
      emoji: '💡',
      title: 'Get Smart Recommendations',
      description: 'AI-powered suggestions tailored to your unique situation',
    },
    {
      emoji: '🎯',
      title: 'Achieve Balance',
      description: 'Build better habits and reach your full potential',
    },
  ];

  return (
    <SafeLayout scrollable={false}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.slides}
        >
          {slides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Get Started"
            onPress={() => router.replace('/(main)/home')}
            variant="primary"
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
  },
  slides: {
    flex: 1,
  },
  slide: {
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  button: {
    width: '100%',
  },
});
