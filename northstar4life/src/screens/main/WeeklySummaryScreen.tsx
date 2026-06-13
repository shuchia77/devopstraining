import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { generateWeeklySummary, WeeklySummary } from '@/utils/summaries';
import { LifePillar } from '@/types';

const PILLARS: Array<{ pillar: LifePillar; label: string; emoji: string; color: string }> = [
  { pillar: 'health', label: 'Health', emoji: '❤️', color: Colors.health },
  { pillar: 'wealth', label: 'Wealth', emoji: '💰', color: Colors.wealth },
  { pillar: 'career', label: 'Career', emoji: '💼', color: Colors.career },
  { pillar: 'relationships', label: 'Relationships', emoji: '👥', color: Colors.relationships },
  { pillar: 'goals', label: 'Goals', emoji: '🎯', color: Colors.goals },
];

export function WeeklySummaryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { checkInHistory, loadCheckInHistory } = useDataStore();
  const [summary, setSummary] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadCheckInHistory(user.id, 7);
    }
  }, [user?.id]);

  useEffect(() => {
    const weeklySummary = generateWeeklySummary(checkInHistory.slice(0, 7));
    setSummary(weeklySummary);
  }, [checkInHistory]);

  if (!summary) {
    return (
      <SafeLayout>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>Complete daily check-ins to see your weekly summary</Text>
          <Button
            title="Start Check-in"
            onPress={() => router.push('/(main)/check-in')}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Summary</Text>
        <Text style={styles.dateRange}>
          {summary.weekStart} to {summary.weekEnd}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Score */}
        <Card variant="elevated" style={styles.scoreCard}>
          <View style={styles.scoreContent}>
            <Text style={styles.scoreLabel}>Your Week Score</Text>
            <Text style={styles.scoreValue}>{summary.overallScore}</Text>
            <ProgressBar progress={summary.overallScore} showLabel={false} />
            <Text style={styles.scoreSubtitle}>
              Based on {summary.checkInsCompleted} daily check-ins
            </Text>
          </View>
        </Card>

        {/* Best Day */}
        <Card style={styles.highlightCard}>
          <Text style={styles.highlightEmoji}>⭐</Text>
          <Text style={styles.highlightTitle}>Your Best Day</Text>
          <Text style={styles.highlightValue}>{summary.bestDay}</Text>
          <Text style={styles.highlightScore}>Score: {summary.bestScore}/100</Text>
        </Card>

        {/* Pillar Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pillar Performance</Text>

          {PILLARS.map((pillar) => {
            const score = summary.pillarScores[pillar.pillar];
            const trend = summary.trends[pillar.pillar];
            const trendEmoji = trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️';

            return (
              <Card key={pillar.pillar} style={styles.pillarCard}>
                <View style={styles.pillarHeader}>
                  <View style={styles.pillarInfo}>
                    <Text style={styles.emoji}>{pillar.emoji}</Text>
                    <View>
                      <Text style={styles.pillarName}>{pillar.label}</Text>
                      <Text style={styles.trendText}>{trendEmoji} {trend}</Text>
                    </View>
                  </View>
                  <Text style={[styles.pillarScore, { color: pillar.color }]}>{score}</Text>
                </View>
                <ProgressBar progress={score} color={pillar.color} showLabel={false} />
              </Card>
            );
          })}
        </View>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>💡 Weekly Insights</Text>

          {summary.insights.map((insight, idx) => (
            <View key={idx} style={styles.insightItem}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Continue This Momentum"
            onPress={() => router.push('/(main)/check-in')}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="View Detailed Analytics"
            onPress={() => router.push('/(main)/statistics')}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scoreCard: {
    marginBottom: 20,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  scoreSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  highlightCard: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fef3c7',
    marginBottom: 20,
  },
  highlightEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  highlightScore: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  pillarCard: {
    marginBottom: 12,
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  pillarName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  trendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  pillarScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  insightsCard: {
    backgroundColor: '#f0fdf4',
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  actionsSection: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});
