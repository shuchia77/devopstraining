import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';

// Mock in-memory storage fallback
const mockDB: Record<string, any> = {
  users: {},
  daily_check_ins: [],
  goals: [],
  daily_recommendations: [],
};

// Mock user for testing
const MOCK_USER = {
  id: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
};

export const supabase = {
  auth: {
    async signUp({ email, password, options }: any) {
      const userId = uuid();
      const user = { id: userId, email, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      mockDB.users[userId] = { ...MOCK_USER, id: userId, email };
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      await AsyncStorage.setItem('auth_session', JSON.stringify({ user, access_token: 'mock-token' }));
      return { user, session: { user, access_token: 'mock-token' } };
    },

    async signInWithPassword({ email, password }: any) {
      const user = { ...MOCK_USER, id: 'test-user-123', email, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      await AsyncStorage.setItem('auth_session', JSON.stringify({ user, access_token: 'mock-token' }));
      return { user, session: { user, access_token: 'mock-token' } };
    },

    async signOut() {
      await AsyncStorage.removeItem('auth_user');
      await AsyncStorage.removeItem('auth_session');
      return {};
    },

    async resetPasswordForEmail(email: string) {
      console.log('Password reset email sent to:', email);
      return {};
    },

    async getSession() {
      const session = await AsyncStorage.getItem('auth_session');
      return { session: session ? JSON.parse(session) : null };
    },

    async getUser() {
      const user = await AsyncStorage.getItem('auth_user');
      return { user: user ? JSON.parse(user) : null };
    },
  },

  from: (table: string) => ({
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          const id = uuid();
          const record = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          if (!mockDB[table]) mockDB[table] = [];
          if (Array.isArray(mockDB[table])) {
            mockDB[table].push(record);
          } else {
            mockDB[table][id] = record;
          }
          await AsyncStorage.setItem(`${table}_${id}`, JSON.stringify(record));
          return { data: record, error: null };
        },
      }),
    }),
    select: () => ({
      eq: (field: string, value: any) => ({
        maybeSingle: async () => {
          const items = mockDB[table] || [];
          const item = items.find((x: any) => x[field] === value);
          return { data: item || null, error: null };
        },
        single: async () => {
          const items = mockDB[table] || [];
          const item = items.find((x: any) => x[field] === value);
          return { data: item, error: null };
        },
        eq: (field2: string, value2: any) => ({
          maybeSingle: async () => {
            const items = mockDB[table] || [];
            const item = items.find((x: any) => x[field] === value && x[field2] === value2);
            return { data: item || null, error: null };
          },
        }),
        gte: (field2: string, value2: any) => ({
          order: (field3: string, { ascending }: any) => ({
            then: async (cb: any) => {
              const items = (mockDB[table] || []).filter((x: any) => x[field] === value && x[field2] >= value2);
              const sorted = ascending ? items.sort((a: any, b: any) => a[field3]?.localeCompare(b[field3])) : items.reverse();
              return cb({ data: sorted, error: null });
            },
          }),
        }),
      }),
      order: (field: string, { ascending }: any) => ({
        then: async (cb: any) => {
          const items = mockDB[table] || [];
          const sorted = ascending ? items.sort((a: any, b: any) => a[field]?.localeCompare(b[field])) : items.reverse();
          return cb({ data: sorted, error: null });
        },
      }),
    }),
    update: (data: any) => ({
      eq: (field: string, value: any) => ({
        select: () => ({
          single: async () => {
            const items = mockDB[table] || [];
            const index = items.findIndex((x: any) => x[field] === value);
            if (index >= 0) {
              items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
              await AsyncStorage.setItem(`${table}_${items[index].id}`, JSON.stringify(items[index]));
              return { data: items[index], error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (field: string, value: any) => ({
        then: async (cb: any) => {
          if (Array.isArray(mockDB[table])) {
            mockDB[table] = mockDB[table].filter((x: any) => x[field] !== value);
          }
          return cb({ error: null });
        },
      }),
    }),
  }),

  functions: {
    invoke: async (name: string, { body }: any) => {
      // Mock recommendation generation
      return { data: [], error: null };
    },
  },
};

export const authService = {
  async signUp(email: string, password: string, displayName: string) {
    return supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
  },

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  },

  async getCurrentSession() {
    const { session } = await supabase.auth.getSession();
    return session;
  },

  async getCurrentUser() {
    const { user } = await supabase.auth.getUser();
    return user;
  },
};

export const userService = {
  async createUserProfile(userId: string, email: string, displayName: string) {
    const user = { id: userId, email, display_name: displayName, subscription: 'free', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockDB.users[userId] = user;
    await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(user));
    return user;
  },

  async getUserProfile(userId: string) {
    return mockDB.users[userId] || { id: userId, email: '', display_name: '', subscription: 'free' };
  },

  async updateUserProfile(userId: string, updates: Record<string, any>) {
    const user = mockDB.users[userId];
    if (user) {
      const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
      mockDB.users[userId] = updated;
      await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(updated));
      return updated;
    }
    return null;
  },
};

export const checkInService = {
  async createCheckIn(userId: string, scores: Record<string, number>, notes: string) {
    const today = new Date().toISOString().split('T')[0];
    const checkIn = {
      id: uuid(),
      user_id: userId,
      date: today,
      scores,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDB.daily_check_ins.push(checkIn);
    await AsyncStorage.setItem(`checkin_${checkIn.id}`, JSON.stringify(checkIn));
    return checkIn;
  },

  async getTodayCheckIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const checkIn = mockDB.daily_check_ins.find((c: any) => c.user_id === userId && c.date === today);
    return checkIn || null;
  },

  async getCheckInHistory(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return mockDB.daily_check_ins.filter(
      (c: any) => c.user_id === userId && c.date >= startDate.toISOString().split('T')[0]
    );
  },

  async updateCheckIn(checkInId: string, scores: Record<string, number>, notes: string) {
    const checkIn = mockDB.daily_check_ins.find((c: any) => c.id === checkInId);
    if (checkIn) {
      checkIn.scores = scores;
      checkIn.notes = notes;
      checkIn.updated_at = new Date().toISOString();
      await AsyncStorage.setItem(`checkin_${checkInId}`, JSON.stringify(checkIn));
      return checkIn;
    }
    return null;
  },
};

export const goalService = {
  async createGoal(userId: string, pillar: string, title: string, description: string, targetDate: string) {
    const goal = {
      id: uuid(),
      user_id: userId,
      pillar,
      title,
      description,
      target_date: targetDate,
      progress: 0,
      status: 'active',
      milestones: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDB.goals.push(goal);
    await AsyncStorage.setItem(`goal_${goal.id}`, JSON.stringify(goal));
    return goal;
  },

  async getGoals(userId: string) {
    return mockDB.goals.filter((g: any) => g.user_id === userId && g.status === 'active');
  },

  async updateGoal(goalId: string, updates: Record<string, any>) {
    const goal = mockDB.goals.find((g: any) => g.id === goalId);
    if (goal) {
      Object.assign(goal, updates, { updated_at: new Date().toISOString() });
      await AsyncStorage.setItem(`goal_${goalId}`, JSON.stringify(goal));
      return goal;
    }
    return null;
  },

  async deleteGoal(goalId: string) {
    const index = mockDB.goals.findIndex((g: any) => g.id === goalId);
    if (index >= 0) {
      mockDB.goals.splice(index, 1);
      await AsyncStorage.removeItem(`goal_${goalId}`);
    }
  },
};

export const recommendationService = {
  async generateRecommendations(userId: string, scores: Record<string, number>) {
    return { data: [], error: null };
  },

  async getTodayRecommendations(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    return mockDB.daily_recommendations.filter((r: any) => r.user_id === userId && r.date === today);
  },
};
