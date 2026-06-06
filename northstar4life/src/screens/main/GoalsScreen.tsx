import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

export function GoalsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { goals, loadGoals, createGoal, updateGoal, deleteGoal, loading } = useDataStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<LifePillar>('health');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadGoals(user.id);
    }
  }, [user?.id]);

  const handleCreateGoal = async () => {
    if (!formData.title.trim() || !formData.targetDate.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user?.id) return;

    try {
      await createGoal(user.id, selectedPillar, formData.title, formData.description, formData.targetDate);
      setFormData({ title: '', description: '', targetDate: '' });
      setModalVisible(false);
      Alert.alert('Success', 'Goal created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal');
    }
  };

  const handleUpdateProgress = async (goalId: string, currentProgress: number) => {
    const newProgress = Math.min(100, currentProgress + 10);
    try {
      await updateGoal(goalId, { progress: newProgress });
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert('Delete Goal', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteGoal(goalId);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete goal');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const getPillarColor = (pillar: LifePillar) => {
    return PILLARS.find((p) => p.pillar === pillar)?.color || Colors.primary;
  };

  const getPillarEmoji = (pillar: LifePillar) => {
    return PILLARS.find((p) => p.pillar === pillar)?.emoji || '';
  };

  const goalsGrouped = PILLARS.map((p) => ({
    ...p,
    items: goals.filter((g: any) => g.pillar === p.pillar),
  }));

  return (
    <SafeLayout>
      <View style={styles.header}>
        <Text style={styles.title}>My Goals</Text>
        <Button
          title="+ Add Goal"
          onPress={() => setModalVisible(true)}
          variant="primary"
          size="small"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goalsGrouped.map((group) => (
          <View key={group.pillar}>
            {group.items.length > 0 && (
              <View style={styles.pillarSection}>
                <View style={styles.pillarSectionHeader}>
                  <View style={styles.pillarLabel}>
                    <Text style={styles.emoji}>{group.emoji}</Text>
                    <Text style={styles.pillarTitle}>{group.label}</Text>
                  </View>
                  <Text style={styles.goalCount}>{group.items.length}</Text>
                </View>

                {group.items.map((goal: any) => (
                  <Card key={goal.id} style={[styles.goalCard, { borderLeftColor: group.color }]}>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalTitle}>{goal.title}</Text>
                        <Text style={styles.goalDate}>Due: {goal.target_date}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                        <Text style={styles.deleteButton}>×</Text>
                      </TouchableOpacity>
                    </View>

                    {goal.description && <Text style={styles.goalDescription}>{goal.description}</Text>}

                    <ProgressBar
                      progress={goal.progress}
                      color={group.color}
                      label="Progress"
                      showLabel={true}
                    />

                    <Button
                      title="+ 10% Progress"
                      onPress={() => handleUpdateProgress(goal.id, goal.progress)}
                      variant="secondary"
                      size="small"
                      style={styles.progressButton}
                    />
                  </Card>
                ))}
              </View>
            )}
          </View>
        ))}

        {goals.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>Create your first goal to start tracking progress</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <SafeLayout>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Goal</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.formLabel}>Select Life Pillar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillarSelector}
            >
              {PILLARS.map((p) => (
                <TouchableOpacity
                  key={p.pillar}
                  onPress={() => setSelectedPillar(p.pillar)}
                  style={[
                    styles.pillarOption,
                    selectedPillar === p.pillar && {
                      backgroundColor: p.color,
                    },
                  ]}
                >
                  <Text style={styles.pillarOptionEmoji}>{p.emoji}</Text>
                  <Text
                    style={[
                      styles.pillarOptionLabel,
                      selectedPillar === p.pillar && { color: Colors.white },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Goal Title"
              placeholder="e.g., Run a 5K marathon"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              containerStyle={styles.input}
            />

            <Input
              label="Description"
              placeholder="Why is this goal important?"
              multiline
              numberOfLines={3}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              containerStyle={styles.input}
            />

            <Input
              label="Target Date"
              placeholder="YYYY-MM-DD"
              value={formData.targetDate}
              onChangeText={(text) => setFormData({ ...formData, targetDate: text })}
              containerStyle={styles.input}
            />

            <Button
              title="Create Goal"
              onPress={handleCreateGoal}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            />
          </View>
        </SafeLayout>
      </Modal>
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
    paddingTop: 24,
  },
  pillarSection: {
    marginBottom: 24,
  },
  pillarSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  goalCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  goalCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  goalDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  deleteButton: {
    fontSize: 28,
    color: Colors.error,
    marginTop: -8,
  },
  progressButton: {
    marginTop: 12,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
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
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  pillarSelector: {
    marginBottom: 24,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  pillarOption: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pillarOptionEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  pillarOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});
