import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';

export function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    dailyReminder: true,
    reminderTime: '08:00',
    emailNotifications: true,
    darkMode: false,
    showMotivations: true,
  });

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearData = () => {
    Alert.alert('Clear All Data', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => {
          Alert.alert('Success', 'All data has been cleared');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <Card style={styles.setting}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Reminder</Text>
                <Text style={styles.settingDescription}>Get reminded to complete your daily check-in</Text>
              </View>
              <Switch
                value={settings.dailyReminder}
                onValueChange={() => handleToggle('dailyReminder')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={settings.dailyReminder ? Colors.primary : Colors.white}
              />
            </View>
          </Card>

          {settings.dailyReminder && (
            <Card style={styles.setting}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Reminder Time</Text>
                  <Text style={styles.settingDescription}>{settings.reminderTime}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          <Card style={styles.setting}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive weekly summaries and tips</Text>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={() => handleToggle('emailNotifications')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={settings.emailNotifications ? Colors.primary : Colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>

          <Card style={styles.setting}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Coming soon</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggle('darkMode')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={settings.darkMode ? Colors.primary : Colors.white}
                disabled={true}
              />
            </View>
          </Card>

          <Card style={styles.setting}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Motivational Messages</Text>
                <Text style={styles.settingDescription}>Show encouragement & insights</Text>
              </View>
              <Switch
                value={settings.showMotivations}
                onValueChange={() => handleToggle('showMotivations')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={settings.showMotivations ? Colors.primary : Colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>

          <Card style={styles.setting}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Goal Tracking</Text>
                <Text style={styles.settingDescription}>You have 3 active goals</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(main)/goals')}>
                <Text style={styles.editButton}>View</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <Card style={styles.setting}>
            <TouchableOpacity>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Export Data</Text>
                  <Text style={styles.settingDescription}>Download your check-ins and goals</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={styles.setting}>
            <TouchableOpacity>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Privacy Policy</Text>
                  <Text style={styles.settingDescription}>Read our privacy practices</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={styles.setting}>
            <TouchableOpacity onPress={handleClearData}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: Colors.error }]}>Clear All Data</Text>
                  <Text style={styles.settingDescription}>Delete all check-ins and goals</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <Card>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>App Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Build Number</Text>
              <Text style={styles.aboutValue}>1</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Last Updated</Text>
              <Text style={styles.aboutValue}>June 13, 2026</Text>
            </View>
          </Card>

          <Text style={styles.footerText}>Made with ❤️ by the Northstar4Life team</Text>
        </View>
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  setting: {
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  editButton: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  aboutItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
});
