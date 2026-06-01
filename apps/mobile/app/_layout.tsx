import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDeviceInit } from '../src/hooks/useDeviceInit';
import { useAdMob } from '../src/hooks/useAdMob';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2 },
  },
});

function AppInitializer() {
  useDeviceInit();
  useAdMob();
  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppInitializer />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="flight/[flightNo]" options={{ title: '항공편 상세' }} />
          <Stack.Screen name="airport/[code]" options={{ title: '공항 현황' }} />
          <Stack.Screen name="immigration/index" options={{ title: '입출국장 현황' }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
