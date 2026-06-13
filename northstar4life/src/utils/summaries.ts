import { DailyCheckIn, LifePillar } from '@/types';

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  overallScore: number;
  pillarScores: Record<LifePillar, number>;
  checkInsCompleted: number;
  bestDay: string;
  bestScore: number;
  trends: Record<LifePillar, 'improving' | 'declining' | 'stable'>;
  insights: string[];
}

export function generateWeeklySummary(checkIns: DailyCheckIn[]): WeeklySummary | null {
  if (checkIns.length === 0) {
    return null;
  }

  // Calculate scores
  const pillarTotals: Record<LifePillar, number[]> = {
    health: [],
    wealth: [],
    career: [],
    relationships: [],
    goals: [],
  };

  let bestDay = '';
  let bestScore = 0;

  checkIns.forEach((checkIn) => {
    const scores = checkIn.scores as Record<LifePillar, number>;
    const dayScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;

    if (dayScore > bestScore) {
      bestScore = dayScore;
      bestDay = checkIn.date;
    }

    Object.keys(scores).forEach((pillar) => {
      pillarTotals[pillar as LifePillar].push(scores[pillar as LifePillar]);
    });
  });

  // Calculate averages
  const pillarScores: Record<LifePillar, number> = {
    health: 0,
    wealth: 0,
    career: 0,
    relationships: 0,
    goals: 0,
  };

  Object.keys(pillarTotals).forEach((pillar) => {
    const scores = pillarTotals[pillar as LifePillar];
    if (scores.length > 0) {
      pillarScores[pillar as LifePillar] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  });

  const overallScore = Math.round(Object.values(pillarScores).reduce((a, b) => a + b, 0) / 5);

  // Determine trends (very simplified)
  const trends: Record<LifePillar, 'improving' | 'declining' | 'stable'> = {
    health: 'stable',
    wealth: 'stable',
    career: 'stable',
    relationships: 'stable',
    goals: 'stable',
  };

  Object.keys(pillarTotals).forEach((pillar) => {
    const scores = pillarTotals[pillar as LifePillar];
    if (scores.length >= 2) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      if (secondAvg > firstAvg + 5) {
        trends[pillar as LifePillar] = 'improving';
      } else if (secondAvg < firstAvg - 5) {
        trends[pillar as LifePillar] = 'declining';
      }
    }
  });

  // Generate insights
  const insights: string[] = [];

  if (overallScore >= 75) {
    insights.push('🌟 Excellent week! You\'re maintaining great life balance.');
  } else if (overallScore >= 50) {
    insights.push('👍 Good week overall. Keep focusing on improvement.');
  } else {
    insights.push('💪 Keep pushing! Small steps lead to big changes.');
  }

  const improvingPillars = Object.entries(trends)
    .filter(([, trend]) => trend === 'improving')
    .map(([pillar]) => pillar);

  if (improvingPillars.length > 0) {
    insights.push(`📈 Great progress in ${improvingPillars.join(' and ')}!`);
  }

  const decliningPillars = Object.entries(trends)
    .filter(([, trend]) => trend === 'declining')
    .map(([pillar]) => pillar);

  if (decliningPillars.length > 0) {
    insights.push(`⚠️ ${decliningPillars.join(' and ')} need some attention this week.`);
  }

  insights.push(`✅ You completed ${checkIns.length} check-ins this week!`);

  return {
    weekStart: checkIns[checkIns.length - 1].date,
    weekEnd: checkIns[0].date,
    overallScore,
    pillarScores,
    checkInsCompleted: checkIns.length,
    bestDay,
    bestScore: Math.round(bestScore),
    trends,
    insights,
  };
}

export function exportAsJSON(data: {
  checkIns: DailyCheckIn[];
  exportDate: string;
}): string {
  return JSON.stringify(data, null, 2);
}

export function exportAsCSV(checkIns: DailyCheckIn[]): string {
  const headers = ['Date', 'Health', 'Wealth', 'Career', 'Relationships', 'Goals', 'Notes', 'Overall'];
  const rows = checkIns.map((c) => {
    const scores = c.scores as Record<LifePillar, number>;
    const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
    return [
      c.date,
      scores.health,
      scores.wealth,
      scores.career,
      scores.relationships,
      scores.goals,
      `"${c.notes || ''}"`,
      overall,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
