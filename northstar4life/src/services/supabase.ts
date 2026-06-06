import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const authService = {
  async signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};

export const userService = {
  async createUserProfile(userId: string, email: string, displayName: string) {
    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      display_name: displayName,
      subscription: 'free',
    });
    if (error) throw error;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const checkInService = {
  async createCheckIn(userId: string, scores: Record<string, number>, notes: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_check_ins')
      .insert({
        user_id: userId,
        date: today,
        scores,
        notes,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTodayCheckIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getCheckInHistory(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data, error } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateCheckIn(checkInId: string, scores: Record<string, number>, notes: string) {
    const { data, error } = await supabase
      .from('daily_check_ins')
      .update({ scores, notes })
      .eq('id', checkInId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const goalService = {
  async createGoal(userId: string, pillar: string, title: string, description: string, targetDate: string) {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        pillar,
        title,
        description,
        target_date: targetDate,
        progress: 0,
        status: 'active',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateGoal(goalId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteGoal(goalId: string) {
    const { error } = await supabase.from('goals').delete().eq('id', goalId);
    if (error) throw error;
  },
};

export const recommendationService = {
  async generateRecommendations(userId: string, scores: Record<string, number>) {
    const { data, error } = await supabase.functions.invoke('generate-recommendations', {
      body: { userId, scores },
    });
    if (error) throw error;
    return data;
  },

  async getTodayRecommendations(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);
    if (error) throw error;
    return data || [];
  },
};
