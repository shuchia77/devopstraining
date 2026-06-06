import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { LifePillar } from '@/types';

const PILLARS: Array<{ pillar: LifePillar; label: string; emoji: string; color: string }> = [
  { pillar: 'health', label: 'Health', emoji: '❤️', color: Colors.health },
  { pillar: 'wealth', label: 'Wealth', emoji: '💰', color: Colors.wealth },
  { pillar: 'career', label: 'Career', emoji: '💼', color: Colors.career },
  { pillar: 'relationships', label: 'Relationships', emoji: '👥', color: Colors.relationships },
  { pillar: 'goals', label: 'Goals', emoji: '🎯', color: Colors.goals },
];

export function CheckInScreen() {
  const { user } = useAuthStore();
  const { todayCheckIn, loadTodayCheckIn, saveCheckIn, updateCheckIn, loading } = useDataStore();

  const [scores, setScores] = useState<Record<LifePillar, number>>({
    health: 50,
    wealth: 50,
    career: 50,
    relationships: 50,
    goals: 50,
  });

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadTodayCheckIn(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (todayCheckIn) {
      setScores(todayCheckIn.scores as Record<LifePillar, number>);
      setNotes(todayCheckIn.notes || '');
    }
  }, [todayCheckIn]);

  const handleScoreChange = (pillar: LifePillar, value: number) => {
    setScores((prev) => ({ ...prev, [pillar]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      if (todayCheckIn?.id) {
        await updateCheckIn(todayCheckIn.id, scores, notes);
      } else {
        await saveCheckIn(user.id, scores, notes);
      }
      Alert.alert('Success', 'Your check-in has been saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in');
    }
  };

  return (
    <SafeLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Check-in</Text>
        <Text style={styles.subtitle}>How are you doing today?</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {PILLARS.map((pillar) => (
          <Card key={pillar.pillar} style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <View style={styles.pillarTitle}>
                <Text style={styles.emoji}>{pillar.emoji}</Text>
                <Text style={styles.pillarLabel}>{pillar.label}</Text>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: pillar.color }]}>
                <Text style={styles.scoreText}>{scores[pillar.pillar]}</Text>
              </View>
            </View>
            <Slider
              value={scores[pillar.pillar]}
              onValueChange={(value) => handleScoreChange(pillar.pillar, value)}
              min={0}
              max={100}
              step={5}
            />
          </Card>
        ))}

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Reflection Notes (Optional)</Text>
          <Input
            placeholder="What's on your mind? Any wins or challenges?"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
          />
        </View>

        <View style={styles.averageScore}>
          <Text style={styles.averageLabel}>Today's Score</Text>
          <Text style={styles.averageValue}>
            {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5)}
          </Text>
        </View>

        <Button
          title={todayCheckIn ? 'Update Check-in' : 'Save Check-in'}
          onPress={handleSubmit}
          loading={loading}
          variant="primary"
          size="large"
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  pillarCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  pillarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  notesSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  averageScore: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginVertical: 24,
  },
  averageLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
  },
  submitButton: {
    marginBottom: 32,
  },
});
