import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, label, color = Colors.primary, showLabel = true }: ProgressBarProps) {
  const bounded = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.container}>
      {label && showLabel && <Text style={styles.label}>{label}</Text>}
      <View style={styles.trackContainer}>
        <View style={[styles.track, { backgroundColor: color, width: `${bounded}%` }]} />
      </View>
      {showLabel && <Text style={styles.percentage}>{Math.round(bounded)}%</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  trackContainer: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  track: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
