import React from 'react';
import { ScrollView, SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

interface SafeLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showPadding?: boolean;
  backgroundColor?: string;
}

export function SafeLayout({
  children,
  scrollable = true,
  showPadding = true,
  backgroundColor = Colors.background,
}: SafeLayoutProps) {
  const content = showPadding ? <View style={styles.padding}>{children}</View> : children;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {scrollable ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
