import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { FlightApi, ParkingApi, WeatherApi } from '../../src/lib/api';
import { getAirportName } from '@airport-app/utils';
import { colors } from '@airport-app/tokens';
import { FlightStatus, ParkingStatus } from '@airport-app/types';
import { formatTime, calcOccupancyRate } from '@airport-app/utils';

const LEVEL_LABELS: Record<string, string> = {
  AVAILABLE: '여유', NORMAL: '보통', CONGESTED: '혼잡', FULL: '만차',
};

const LEVEL_COLORS: Record<string, string> = {
  AVAILABLE: colors.congestion.available,
  NORMAL: colors.congestion.normal,
  CONGESTED: colors.congestion.congested,
  FULL: colors.congestion.full,
};

export default function AirportScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const airportName = getAirportName(code);

  const { data: depData, isLoading: depLoading, refetch: refetchDep } = useQuery({
    queryKey: queryKeys.flights.realtime({ airportCode: code, direction: 'DEPARTURE' }),
    queryFn: () => FlightApi.getRealtime({ airportCode: code, direction: 'DEPARTURE' }),
    refetchInterval: 60_000,
  });

  const { data: parkData, refetch: refetchPark } = useQuery({
    queryKey: queryKeys.parking.list(code),
    queryFn: () => ParkingApi.getList({ airportCode: code }),
    refetchInterval: 60_000,
  });

  const { data: weatherData } = useQuery({
    queryKey: queryKeys.weather.byAirport(code),
    queryFn: () => WeatherApi.get(code),
    refetchInterval: 1_800_000,
  });

  const refetch = () => { refetchDep(); refetchPark(); };
  const topFlights = depData?.data?.slice(0, 5) ?? [];
  const parking = parkData?.data ?? [];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={depLoading} onRefresh={refetch} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-1">{airportName}</Text>
        <Text className="text-gray-400 text-sm mb-4">{code}</Text>

        {weatherData?.data && (
          <View className="bg-blue-50 rounded-2xl p-4 mb-4">
            <Text className="text-sm text-blue-600 mb-1">현재 날씨</Text>
            <Text className="text-3xl font-bold text-blue-800">
              {weatherData.data.temperature?.toFixed(1)}°C
            </Text>
            <Text className="text-sm text-blue-600 mt-1">
              습도 {weatherData.data.humidity}% · 풍속 {weatherData.data.windSpeed}m/s
            </Text>
          </View>
        )}

        {parking.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">주차 현황</Text>
            {parking.slice(0, 3).map((p: ParkingStatus) => {
              const pct = calcOccupancyRate(p.occupiedSpots, p.totalSpots);
              const color = LEVEL_COLORS[p.congestionLevel] ?? LEVEL_COLORS['NORMAL']!;
              return (
                <View key={p.parkingId} className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                  <View className="flex-row justify-between mb-1">
                    <Text className="font-medium">{p.zone}</Text>
                    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: color }}>
                      <Text className="text-white text-xs">
                        {LEVEL_LABELS[p.congestionLevel] ?? p.congestionLevel}
                      </Text>
                    </View>
                  </View>
                  <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">출발 항공편</Text>
          <TouchableOpacity onPress={() => router.push('/flights')}>
            <Text className="text-blue-600 text-sm">전체 보기</Text>
          </TouchableOpacity>
        </View>
        {topFlights.map((flight: FlightStatus) => (
          <TouchableOpacity
            key={flight.flightId}
            className="bg-white rounded-xl p-3 mb-2 shadow-sm"
            onPress={() => router.push(`/flight/${flight.flightNo}`)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-mono font-bold">{flight.flightNo}</Text>
                <Text className="text-gray-500 text-sm">{flight.destination}</Text>
              </View>
              <Text className="font-semibold">{formatTime(flight.scheduledTime)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
