import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  index:    { active: 'home',         inactive: 'home-outline' },
  flights:  { active: 'airplane',     inactive: 'airplane-outline' },
  parking:  { active: 'car',          inactive: 'car-outline' },
  settings: { active: 'settings',     inactive: 'settings-outline' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const name = icons ? (focused ? icons.active : icons.inactive) : 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index"    options={{ title: '홈',    tabBarLabel: '홈' }} />
      <Tabs.Screen name="flights"  options={{ title: '항공편', tabBarLabel: '항공편' }} />
      <Tabs.Screen name="parking"  options={{ title: '주차',  tabBarLabel: '주차' }} />
      <Tabs.Screen name="settings" options={{ title: '설정',  tabBarLabel: '설정' }} />
    </Tabs>
  );
}
