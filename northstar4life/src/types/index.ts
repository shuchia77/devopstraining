export type LifePillar = 'health' | 'wealth' | 'career' | 'relationships' | 'goals';

export interface PillarScore {
  pillar: LifePillar;
  score: number; // 0-100
  label: string;
  icon: string;
  color: string;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  scores: Record<LifePillar, number>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  pillar: LifePillar;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyRecommendation {
  id: string;
  userId: string;
  date: string;
  pillar: LifePillar;
  recommendation: string;
  actionItems: string[];
  generatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  subscription: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'free' | 'premium' | 'enterprise';

export interface LifeScore {
  overallScore: number;
  pillarScores: Record<LifePillar, number>;
  lastUpdated: string;
}
