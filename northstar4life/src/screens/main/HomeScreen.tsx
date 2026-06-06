import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
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

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { lifeScore, loadTodayCheckIn } = useDataStore();

  useEffect(() => {
    if (user?.id) {
      loadTodayCheckIn(user.id);
    }
  }, [user?.id]);

  const getPillarColor = (pillar: LifePillar) => {
    const p = PILLARS.find((p) => p.pillar === pillar);
    return p?.color || Colors.primary;
  };

  return (
    <SafeLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello, {user?.displayName}!</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(main)/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {lifeScore && (
          <Card variant="elevated" style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Your Life Score</Text>
              <Text style={styles.overallScore}>{lifeScore.overallScore}</Text>
            </View>
            <Text style={styles.scoreSubtitle}>Overall Balance</Text>
            <ProgressBar progress={lifeScore.overallScore} showLabel={false} />
          </Card>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Life Pillars</Text>
            <TouchableOpacity onPress={() => router.push('/(main)/check-in')}>
              <Text style={styles.updateLink}>Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pillarsGrid}>
            {PILLARS.map((pillar) => {
              const score = lifeScore?.pillarScores[pillar.pillar] ?? 0;
              return (
                <Card key={pillar.pillar} style={styles.pillarCard}>
                  <View
                    style={[
                      styles.pillarBorder,
                      { borderLeftColor: getPillarColor(pillar.pillar) },
                    ]}
                  >
                    <Text style={styles.pillarEmoji}>{pillar.emoji}</Text>
                    <Text style={styles.pillarName}>{pillar.label}</Text>
                    <Text style={[styles.pillarScore, { color: getPillarColor(pillar.pillar) }]}>
                      {score}
                    </Text>
                    <ProgressBar
                      progress={score}
                      color={getPillarColor(pillar.pillar)}
                      showLabel={false}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Button
              title="📝 Daily Check-in"
              onPress={() => router.push('/(main)/check-in')}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="🎯 My Goals"
              onPress={() => router.push('/(main)/goals')}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
          <Button
            title="💡 Get Recommendations"
            onPress={() => router.push('/(main)/recommendations')}
            variant="primary"
            size="large"
            style={styles.fullButton}
          />
        </View>

        {lifeScore && lifeScore.overallScore < 50 && (
          <Card style={styles.motivationCard}>
            <Text style={styles.motivationEmoji}>✨</Text>
            <Text style={styles.motivationText}>
              You're on a journey to balance! Check in daily and follow your recommendations to improve.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  scoreCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  overallScore: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
  },
  scoreSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  updateLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  pillarsGrid: {
    gap: 12,
  },
  pillarCard: {
    marginBottom: 0,
  },
  pillarBorder: {
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
  pillarEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  pillarName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  pillarScore: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  fullButton: {
    marginBottom: 0,
  },
  motivationCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fef3c7',
  },
  motivationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});
