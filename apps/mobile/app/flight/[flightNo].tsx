import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { FlightApi, WeatherApi, DeviceApi } from '../../src/lib/api';
import { useAppStore } from '../../src/store/appStore';
import { formatTime, calcDelayMinutes } from '@airport-app/utils';
import { FlightStatus } from '@airport-app/types';

export default function FlightDetailScreen() {
  const { flightNo } = useLocalSearchParams<{ flightNo: string }>();
  const { deviceId } = useAppStore();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.flights.detail(flightNo),
    queryFn: () => FlightApi.getByFlightNo(flightNo),
    refetchInterval: 60_000,
  });

  const flight = data?.data as FlightStatus | undefined;

  const { data: weatherData } = useQuery({
    queryKey: queryKeys.weather.byAirport(flight?.destination ?? ''),
    queryFn: () => WeatherApi.get(flight?.destination ?? ''),
    enabled: !!flight?.destination,
  });

  const addFavMutation = useMutation({
    mutationFn: () =>
      DeviceApi.addFavorite(deviceId!, {
        flightNo,
        airportCode: flight?.airportCode ?? '',
        direction: flight?.direction ?? 'DEPARTURE',
        notifyDelay: true,
        notifyCancel: true,
        notifyBoarding: true,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.favorites.list(deviceId ?? '') }),
  });

  if (isLoading || !flight) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">로딩 중...</Text>
      </View>
    );
  }

  const delayMin = calcDelayMinutes(flight.scheduledTime, flight.estimatedTime ?? null);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View className="p-4">
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <Text className="text-3xl font-mono font-bold mb-1">{flight.flightNo}</Text>
          <Text className="text-gray-500 text-lg mb-4">{flight.airline}</Text>

          <View className="flex-row gap-6 mb-4">
            <View>
              <Text className="text-xs text-gray-400">출발지</Text>
              <Text className="font-semibold text-lg">{flight.origin}</Text>
            </View>
            <Text className="text-2xl text-gray-300 self-center">→</Text>
            <View>
              <Text className="text-xs text-gray-400">도착지</Text>
              <Text className="font-semibold text-lg">{flight.destination}</Text>
            </View>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">예정 시간</Text>
              <Text className="font-semibold">{formatTime(flight.scheduledTime)}</Text>
            </View>
            {flight.estimatedTime && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">변경 시간</Text>
                <Text className="font-semibold text-orange-500">
                  {formatTime(flight.estimatedTime)}
                </Text>
              </View>
            )}
            {delayMin > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">지연</Text>
                <Text className="text-orange-500 font-semibold">{delayMin}분</Text>
              </View>
            )}
            {flight.gate && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">탑승구</Text>
                <Text className="font-semibold">{flight.gate}</Text>
              </View>
            )}
            {flight.baggageClaim && (
              <View className="flex-row justify-between">
                <Text className="text-gray-400">수하물 수취대</Text>
                <Text className="font-semibold">{flight.baggageClaim}</Text>
              </View>
            )}
          </View>
        </View>

        {weatherData?.data && (
          <View className="bg-blue-50 rounded-2xl p-4 mb-4">
            <Text className="text-sm text-blue-600 mb-1">목적지 날씨</Text>
            <Text className="text-2xl font-bold text-blue-800">
              {weatherData.data.temperature?.toFixed(1)}°C
            </Text>
            <Text className="text-sm text-blue-600 mt-1">
              습도 {weatherData.data.humidity}% · 풍속 {weatherData.data.windSpeed}m/s
            </Text>
          </View>
        )}

        {deviceId && (
          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 items-center"
            onPress={() => addFavMutation.mutate()}
            disabled={addFavMutation.isPending}
          >
            <Text className="text-white font-semibold text-base">
              {addFavMutation.isPending ? '추가 중...' : '즐겨찾기 추가'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
