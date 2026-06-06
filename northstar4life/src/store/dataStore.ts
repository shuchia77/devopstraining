import { create } from 'zustand';
import { DailyCheckIn, Goal, DailyRecommendation, LifeScore, LifePillar } from '@/types';
import { checkInService, goalService, recommendationService } from '@/services/supabase';

interface DataState {
  todayCheckIn: DailyCheckIn | null;
  checkInHistory: DailyCheckIn[];
  goals: Goal[];
  recommendations: DailyRecommendation[];
  lifeScore: LifeScore | null;
  loading: boolean;
  error: string | null;

  // Check-in actions
  loadTodayCheckIn: (userId: string) => Promise<void>;
  loadCheckInHistory: (userId: string, days?: number) => Promise<void>;
  saveCheckIn: (userId: string, scores: Record<LifePillar, number>, notes: string) => Promise<void>;
  updateCheckIn: (checkInId: string, scores: Record<LifePillar, number>, notes: string) => Promise<void>;

  // Goal actions
  loadGoals: (userId: string) => Promise<void>;
  createGoal: (userId: string, pillar: LifePillar, title: string, description: string, targetDate: string) => Promise<void>;
  updateGoal: (goalId: string, updates: Record<string, any>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;

  // Recommendations
  loadRecommendations: (userId: string) => Promise<void>;
  generateRecommendations: (userId: string, scores: Record<LifePillar, number>) => Promise<void>;

  // Life score
  calculateLifeScore: () => void;
  clearError: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  todayCheckIn: null,
  checkInHistory: [],
  goals: [],
  recommendations: [],
  lifeScore: null,
  loading: false,
  error: null,

  loadTodayCheckIn: async (userId) => {
    set({ loading: true, error: null });
    try {
      const checkIn = await checkInService.getTodayCheckIn(userId);
      set({ todayCheckIn: checkIn, loading: false });
      get().calculateLifeScore();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load check-in',
        loading: false,
      });
    }
  },

  loadCheckInHistory: async (userId, days = 30) => {
    set({ loading: true, error: null });
    try {
      const history = await checkInService.getCheckInHistory(userId, days);
      set({ checkInHistory: history, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load history',
        loading: false,
      });
    }
  },

  saveCheckIn: async (userId, scores, notes) => {
    set({ loading: true, error: null });
    try {
      const checkIn = await checkInService.createCheckIn(userId, scores, notes);
      set({ todayCheckIn: checkIn, loading: false });
      get().calculateLifeScore();
      get().generateRecommendations(userId, scores);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save check-in',
        loading: false,
      });
      throw error;
    }
  },

  updateCheckIn: async (checkInId, scores, notes) => {
    set({ loading: true, error: null });
    try {
      const updated = await checkInService.updateCheckIn(checkInId, scores, notes);
      set({ todayCheckIn: updated, loading: false });
      get().calculateLifeScore();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update check-in',
        loading: false,
      });
      throw error;
    }
  },

  loadGoals: async (userId) => {
    set({ loading: true, error: null });
    try {
      const goals = await goalService.getGoals(userId);
      set({ goals, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load goals',
        loading: false,
      });
    }
  },

  createGoal: async (userId, pillar, title, description, targetDate) => {
    set({ loading: true, error: null });
    try {
      const goal = await goalService.createGoal(userId, pillar, title, description, targetDate);
      set((state) => ({
        goals: [goal, ...state.goals],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create goal',
        loading: false,
      });
      throw error;
    }
  },

  updateGoal: async (goalId, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await goalService.updateGoal(goalId, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? updated : g)),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update goal',
        loading: false,
      });
      throw error;
    }
  },

  deleteGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      await goalService.deleteGoal(goalId);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete goal',
        loading: false,
      });
      throw error;
    }
  },

  loadRecommendations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const recommendations = await recommendationService.getTodayRecommendations(userId);
      set({ recommendations, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load recommendations',
        loading: false,
      });
    }
  },

  generateRecommendations: async (userId, scores) => {
    try {
      await recommendationService.generateRecommendations(userId, scores);
      get().loadRecommendations(userId);
    } catch (error) {
      // Silently fail for recommendations as they're optional
      console.error('Failed to generate recommendations:', error);
    }
  },

  calculateLifeScore: () => {
    const state = get();
    if (!state.todayCheckIn) {
      set({ lifeScore: null });
      return;
    }

    const scores = state.todayCheckIn.scores as Record<LifePillar, number>;
    const pillarScores = {
      health: scores.health || 0,
      wealth: scores.wealth || 0,
      career: scores.career || 0,
      relationships: scores.relationships || 0,
      goals: scores.goals || 0,
    };

    const overallScore = Math.round(
      Object.values(pillarScores).reduce((a, b) => a + b, 0) / 5
    );

    set({
      lifeScore: {
        overallScore,
        pillarScores,
        lastUpdated: state.todayCheckIn.updatedAt,
      },
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
