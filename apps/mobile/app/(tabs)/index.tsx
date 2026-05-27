import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { queryKeys } from '@airport-app/hooks';
import { useAppStore } from '../../src/store/appStore';
import { FlightApi, ParkingApi } from '../../src/lib/api';
import { formatTime } from '@airport-app/utils';
import { FlightStatus } from '@airport-app/types';

export default function HomeScreen() {
  const { defaultAirport } = useAppStore();

  const { data: departures } = useQuery({
    queryKey: queryKeys.flights.realtime({ airportCode: defaultAirport, direction: 'DEPARTURE' }),
    queryFn: () => FlightApi.getRealtime({ airportCode: defaultAirport, direction: 'DEPARTURE' }),
    refetchInterval: 60_000,
  });

  const { data: parkingSummary } = useQuery({
    queryKey: queryKeys.parking.summary(defaultAirport),
    queryFn: () => ParkingApi.getSummary(defaultAirport),
    refetchInterval: 60_000,
  });

  const topFlights = departures?.data?.slice(0, 5) ?? [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-1">공항 통합 정보</Text>
        <Text className="text-gray-500 text-sm mb-6">{defaultAirport} 기준</Text>

        {parkingSummary?.data && (
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm mb-4"
            onPress={() => router.push('/parking')}
          >
            <Text className="text-sm text-gray-500 mb-1">주차 현황</Text>
            <Text className="text-lg font-semibold">
              잔여 {parkingSummary.data.availableSpots.toLocaleString()} / 전체{' '}
              {parkingSummary.data.totalSpots.toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-lg font-semibold mb-3">오늘 출발편</Text>
        <View className="gap-2">
          {topFlights.map((flight: FlightStatus) => (
            <TouchableOpacity
              key={flight.flightId}
              className="bg-white rounded-xl p-3 shadow-sm"
              onPress={() => router.push(`/flight/${flight.flightNo}`)}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-mono font-bold">{flight.flightNo}</Text>
                  <Text className="text-gray-500 text-sm">{flight.destination}</Text>
                </View>
                <View className="items-end">
                  <Text className="font-semibold">{formatTime(flight.scheduledTime)}</Text>
                  <Text className="text-xs text-gray-400">
                    {flight.gate ? `Gate ${flight.gate}` : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
