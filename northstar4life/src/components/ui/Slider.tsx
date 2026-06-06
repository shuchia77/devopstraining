import React, { useState } from 'react';
import { View, StyleSheet, Text, PanResponder, Animated } from 'react-native';
import { Colors } from '@/constants/theme';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 5, label }: SliderProps) {
  const [sliderPosition] = useState(new Animated.Value((value - min) / (max - min)));

  const updateValue = (newValue: number) => {
    const bounded = Math.max(min, Math.min(max, newValue));
    const stepped = Math.round(bounded / step) * step;
    onValueChange(stepped);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      )}
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${percentage}%` }]} />
      </View>
      <View style={styles.marksContainer}>
        {[0, 25, 50, 75, 100].map((mark) => (
          <Text key={mark} style={styles.mark}>
            {mark}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  marksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  mark: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
