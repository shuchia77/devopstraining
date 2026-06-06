import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layouts/SafeLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(auth)/welcome');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
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
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Display Name</Text>
            <Text style={styles.itemValue}>{user?.displayName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Email</Text>
            <Text style={styles.itemValue}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Subscription</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>{user?.subscription || 'Free'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <Text style={styles.subscriptionInfo}>
            {user?.subscription === 'free'
              ? 'Upgrade to Premium for unlimited goals, advanced analytics, and more!'
              : 'Thank you for being a Premium member!'}
          </Text>
          {user?.subscription === 'free' && (
            <Button
              title="Upgrade to Premium"
              onPress={() => {}}
              variant="primary"
              size="small"
              style={styles.upgradeButton}
            />
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About Northstar4Life</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity>
            <Text style={styles.link}>Contact Us</Text>
          </TouchableOpacity>
        </Card>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="secondary"
          size="large"
          style={styles.signOutButton}
        />
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
  profileCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 12,
  },
  itemLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 0,
  },
  subscriptionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    marginTop: 4,
  },
  subscriptionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  subscriptionInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    marginTop: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    paddingVertical: 12,
  },
  signOutButton: {
    marginBottom: 32,
    marginTop: 20,
  },
});
