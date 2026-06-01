import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDeviceInit } from '../src/hooks/useDeviceInit';
import { initAds } from '../src/lib/initAds';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2 },
  },
});

function AppInitializer() {
  useDeviceInit();

  // Google AdMob SDK 초기화 (BannerAd 렌더링 전에 반드시 1회 필요)
  // web 번들에서는 initAds.web.ts 의 no-op 가 자동 선택됨
  useEffect(() => {
    initAds();
  }, []);

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
