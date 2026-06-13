import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
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

export function StatisticsScreen() {
  const { user } = useAuthStore();
  const { checkInHistory, loadCheckInHistory } = useDataStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [stats, setStats] = useState<Record<string, { avg: number; trend: string; best: number; worst: number }>>({});

  useEffect(() => {
    if (user?.id) {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      loadCheckInHistory(user.id, days);
    }
  }, [user?.id, timeRange]);

  useEffect(() => {
    if (checkInHistory.length === 0) return;

    const newStats: Record<string, { avg: number; trend: string; best: number; worst: number }> = {};

    PILLARS.forEach((p) => {
      const scores = checkInHistory
        .map((c: any) => c.scores?.[p.pillar] || 0)
        .filter((s) => s > 0);

      if (scores.length === 0) {
        newStats[p.pillar] = { avg: 0, trend: '→', best: 0, worst: 0 };
        return;
      }

      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const best = Math.max(...scores);
      const worst = Math.min(...scores);

      // Calculate trend
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      const trend = secondAvg > firstAvg ? '↑' : secondAvg < firstAvg ? '↓' : '→';

      newStats[p.pillar] = { avg, trend, best, worst };
    });

    setStats(newStats);
  }, [checkInHistory]);

  const getStreakDays = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (checkInHistory.some((c: any) => c.date === dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getStreakDays();
  const overallAvg =
    Object.values(stats).length > 0
      ? Math.round(
          Object.values(stats).reduce((sum, s) => sum + s.avg, 0) / Object.values(stats).length
        )
      : 0;

  return (
    <SafeLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics & Trends</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['7d', '30d', '90d'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
            >
              <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <Card variant="elevated" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Overall Average</Text>
              <Text style={styles.summaryValue}>{overallAvg}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Streak</Text>
              <Text style={styles.summaryValue}>{streak}</Text>
              <Text style={styles.summaryUnit}>days</Text>
            </View>
          </View>
        </Card>

        {/* Pillar Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pillar Performance</Text>

          {PILLARS.map((pillar) => {
            const pillarStats = stats[pillar.pillar];
            if (!pillarStats) return null;

            return (
              <Card key={pillar.pillar} style={[styles.pillarStats, { borderLeftColor: pillar.color }]}>
                <View style={styles.pillarHeader}>
                  <View style={styles.pillarTitle}>
                    <Text style={styles.emoji}>{pillar.emoji}</Text>
                    <Text style={styles.pillarName}>{pillar.label}</Text>
                  </View>
                  <Text style={[styles.trendBadge, { color: pillar.color }]}>
                    {pillarStats.trend}
                  </Text>
                </View>

                <ProgressBar
                  progress={pillarStats.avg}
                  color={pillar.color}
                  showLabel={false}
                />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Avg</Text>
                    <Text style={styles.statValue}>{pillarStats.avg}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Best</Text>
                    <Text style={[styles.statValue, { color: Colors.success }]}>
                      {pillarStats.best}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Worst</Text>
                    <Text style={[styles.statValue, { color: Colors.error }]}>
                      {pillarStats.worst}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>💡 Insights</Text>

          {checkInHistory.length === 0 ? (
            <Text style={styles.insightText}>Start daily check-ins to see insights and trends!</Text>
          ) : (
            <>
              <Text style={styles.insightText}>
                • You've completed {checkInHistory.length} check-ins in the last{' '}
                {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}.
              </Text>

              {streak > 0 && (
                <Text style={styles.insightText}>
                  • Amazing! You have a {streak}-day check-in streak. Keep it going! 🔥
                </Text>
              )}

              {overallAvg >= 75 && (
                <Text style={styles.insightText}>
                  • Your life score is excellent! You're maintaining great balance across all pillars.
                </Text>
              )}

              {overallAvg >= 50 && overallAvg < 75 && (
                <Text style={styles.insightText}>
                  • You're doing well! Focus on the pillars with lower scores to improve overall balance.
                </Text>
              )}

              {overallAvg < 50 && (
                <Text style={styles.insightText}>
                  • There's room for improvement. Start with small, consistent actions in your lowest pillars.
                </Text>
              )}

              {Object.values(stats).some((s) => s.trend === '↑') && (
                <Text style={styles.insightText}>
                  • Great progress! Some of your pillar scores are trending upward. 📈
                </Text>
              )}
            </>
          )}
        </Card>

        <View style={styles.footer} />
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  timeRangeTextActive: {
    color: Colors.white,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  summaryUnit: {
    fontSize: 11,
    color: Colors.textTertiary,
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
  pillarStats: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  pillarName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  trendBadge: {
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
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
  insightText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    height: 32,
  },
});
