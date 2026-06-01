import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { ParkingApi } from '../../src/lib/api';
import { useAppStore } from '../../src/store/appStore';
import { calcOccupancyRate } from '@airport-app/utils';
import { colors } from '@airport-app/tokens';
import { ParkingStatus } from '@airport-app/types';
import { AdBanner } from '../../src/components/AdBanner';

const LEVEL_COLORS: Record<string, string> = {
  AVAILABLE: colors.congestion.available,
  NORMAL: colors.congestion.normal,
  CONGESTED: colors.congestion.congested,
  FULL: colors.congestion.full,
};

const LEVEL_LABELS: Record<string, string> = {
  AVAILABLE: '여유',
  NORMAL: '보통',
  CONGESTED: '혼잡',
  FULL: '만차',
};

export default function ParkingScreen() {
  const { defaultAirport } = useAppStore();
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.parking.list(defaultAirport),
    queryFn: () => ParkingApi.getList({ airportCode: defaultAirport }),
    refetchInterval: 60_000,
  });

  const parking = data?.data ?? [];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">주차 현황</Text>
        <AdBanner />
        {parking.map((p: ParkingStatus) => {
          const pct = calcOccupancyRate(p.occupiedSpots, p.totalSpots);
          const color = LEVEL_COLORS[p.congestionLevel] ?? LEVEL_COLORS['NORMAL']!;
          return (
            <View key={p.parkingId} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row justify-between mb-2">
                <Text className="font-semibold">{p.zone}</Text>
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                >
                  <Text className="text-white text-xs">
                    {LEVEL_LABELS[p.congestionLevel] ?? p.congestionLevel}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500 text-sm mb-2">
                잔여 {p.availableSpots} / 전체 {p.totalSpots}
              </Text>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
