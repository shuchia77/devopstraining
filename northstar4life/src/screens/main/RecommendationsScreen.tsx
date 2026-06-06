import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';

const PILLARS = ['health', 'wealth', 'career', 'relationships', 'goals'];

const EMOJI_MAP: Record<string, string> = {
  health: '❤️',
  wealth: '💰',
  career: '💼',
  relationships: '👥',
  goals: '🎯',
};

const COLOR_MAP: Record<string, string> = {
  health: Colors.health,
  wealth: Colors.wealth,
  career: Colors.career,
  relationships: Colors.relationships,
  goals: Colors.goals,
};

export function RecommendationsScreen() {
  const { user } = useAuthStore();
  const { recommendations, lifeScore, loadRecommendations } = useDataStore();

  useEffect(() => {
    if (user?.id) {
      loadRecommendations(user.id);
    }
  }, [user?.id]);

  const getLowestPillar = () => {
    if (!lifeScore?.pillarScores) return null;
    let lowest = { pillar: 'health', score: 100 };
    Object.entries(lifeScore.pillarScores).forEach(([pillar, score]) => {
      if (score < lowest.score) {
        lowest = { pillar: pillar as any, score };
      }
    });
    return lowest;
  };

  const lowestPillar = getLowestPillar();

  const getMockRecommendations = () => {
    const recommendations: Array<{ pillar: string; title: string; description: string; actionItems: string[] }> = [
      {
        pillar: 'health',
        title: 'Daily Movement Challenge',
        description: 'Boost your physical health with consistent movement',
        actionItems: [
          'Take a 30-minute walk today',
          'Drink 8 glasses of water',
          'Do 10 minutes of stretching before bed',
        ],
      },
      {
        pillar: 'wealth',
        title: 'Smart Spending Review',
        description: 'Optimize your financial habits',
        actionItems: [
          'Review last month\'s expenses',
          'Set a budget for this month',
          'Research a new investment option',
        ],
      },
      {
        pillar: 'career',
        title: 'Skill Development Focus',
        description: 'Advance your professional growth',
        actionItems: [
          'Learn a new tool or skill',
          'Network with a colleague',
          'Document your achievements',
        ],
      },
      {
        pillar: 'relationships',
        title: 'Connection Time',
        description: 'Strengthen your relationships',
        actionItems: [
          'Call or text someone you care about',
          'Schedule a coffee date',
          'Send a thoughtful message',
        ],
      },
      {
        pillar: 'goals',
        title: 'Goal Review & Planning',
        description: 'Keep your goals on track',
        actionItems: [
          'Review your existing goals',
          'Create a new milestone',
          'Track your progress',
        ],
      },
    ];

    return recommendations;
  };

  const mockRecs = getMockRecommendations();
  const displayRecs = recommendations.length > 0 ? recommendations : mockRecs;

  return (
    <SafeLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Recommendations</Text>
        <Text style={styles.subtitle}>Personalized actions to improve your life</Text>
      </View>

      {lowestPillar && (
        <Card style={styles.focusCard}>
          <Text style={styles.focusTitle}>Focus Area</Text>
          <View style={styles.focusContent}>
            <Text style={styles.focusEmoji}>{EMOJI_MAP[lowestPillar.pillar]}</Text>
            <View style={styles.focusText}>
              <Text style={styles.focusLabel}>{lowestPillar.pillar.toUpperCase()}</Text>
              <Text style={styles.focusScore}>Current Score: {lowestPillar.score}</Text>
            </View>
          </View>
          <Text style={styles.focusHint}>
            This area needs your attention. Check the recommendations below!
          </Text>
        </Card>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {displayRecs.map((rec, idx) => (
          <Card
            key={idx}
            variant="elevated"
            style={[styles.recCard, { borderLeftColor: COLOR_MAP[rec.pillar] }]}
          >
            <View style={styles.recHeader}>
              <View style={styles.recTitleSection}>
                <Text style={styles.recEmoji}>{EMOJI_MAP[rec.pillar]}</Text>
                <View style={styles.recTitleContent}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recPillar}>{rec.pillar}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.recDescription}>{rec.description}</Text>

            <View style={styles.actionItems}>
              {rec.actionItems.map((item, itemIdx) => (
                <View key={itemIdx} style={styles.actionItem}>
                  <Text style={styles.actionBullet}>•</Text>
                  <Text style={styles.actionText}>{item}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Start This Action"
              onPress={() => {}}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          </Card>
        ))}

        <View style={styles.footerMessage}>
          <Text style={styles.footerEmoji}>💪</Text>
          <Text style={styles.footerText}>
            Consistency is key! Follow these recommendations daily to see improvement.
          </Text>
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
  focusCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#fef3c7',
  },
  focusTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  focusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  focusEmoji: {
    fontSize: 32,
  },
  focusText: {
    flex: 1,
  },
  focusLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  focusScore: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  focusHint: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  recHeader: {
    marginBottom: 12,
  },
  recTitleSection: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recEmoji: {
    fontSize: 28,
  },
  recTitleContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  recPillar: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  recDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionItems: {
    gap: 10,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBullet: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
    lineHeight: 18,
  },
  actionButton: {
    width: '100%',
  },
  footerMessage: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
