import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="check-in" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
