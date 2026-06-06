/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  primary: '#6366f1',
  secondary: '#f59e0b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  health: '#ec4899',
  wealth: '#14b8a6',
  career: '#8b5cf6',
  relationships: '#f43f5e',
  goals: '#3b82f6',

  text: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  white: '#ffffff',
  background: '#f9fafb',
  surface: '#f3f4f6',
  border: '#e5e7eb',
  placeholder: '#d1d5db',

  light: {
    text: '#1f2937',
    background: '#f9fafb',
    backgroundElement: '#f3f4f6',
    backgroundSelected: '#e5e7eb',
    textSecondary: '#6b7280',
  },
  dark: {
    text: '#f9fafb',
    background: '#111827',
    backgroundElement: '#1f2937',
    backgroundSelected: '#374151',
    textSecondary: '#d1d5db',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
