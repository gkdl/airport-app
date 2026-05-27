import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6' }}>
      <Tabs.Screen name="index" options={{ title: '홈', tabBarLabel: '홈' }} />
      <Tabs.Screen name="flights" options={{ title: '항공편', tabBarLabel: '항공편' }} />
      <Tabs.Screen name="parking" options={{ title: '주차', tabBarLabel: '주차' }} />
      <Tabs.Screen name="settings" options={{ title: '설정', tabBarLabel: '설정' }} />
    </Tabs>
  );
}
