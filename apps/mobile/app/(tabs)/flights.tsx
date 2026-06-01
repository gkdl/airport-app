import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { router } from 'expo-router';
import { queryKeys } from '@airport-app/hooks';
import { FlightApi } from '../../src/lib/api';
import { useAppStore } from '../../src/store/appStore';
import { formatTime } from '@airport-app/utils';
import { colors } from '@airport-app/tokens';
import { FlightStatus, FlightStatusCode } from '@airport-app/types';
import { AdBanner } from '../../src/components/AdBanner';

const STATUS_LABELS: Partial<Record<FlightStatusCode, string>> = {
  [FlightStatusCode.SCHEDULED]: '예정',
  [FlightStatusCode.DELAYED]: '지연',
  [FlightStatusCode.CANCELLED]: '결항',
  [FlightStatusCode.BOARDING]: '탑승',
  [FlightStatusCode.DEPARTED]: '출발',
  [FlightStatusCode.ARRIVED]: '도착',
  [FlightStatusCode.DIVERTED]: '우회',
  [FlightStatusCode.LANDED]: '착륙',
};

export default function FlightsScreen() {
  const { defaultAirport } = useAppStore();
  const [direction, setDirection] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.flights.realtime({ airportCode: defaultAirport, direction }),
    queryFn: () => FlightApi.getRealtime({ airportCode: defaultAirport, direction }),
    refetchInterval: 60_000,
  });

  const flights = (data?.data ?? []).filter(
    (f: FlightStatus) => !search || f.flightNo.includes(search.toUpperCase()),
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-100">
        <View className="flex-row mb-3 gap-2">
          {(['DEPARTURE', 'ARRIVAL'] as const).map((d) => (
            <TouchableOpacity
              key={d}
              className={`flex-1 py-2 rounded-lg items-center ${direction === d ? 'bg-blue-600' : 'bg-gray-100'}`}
              onPress={() => setDirection(d)}
            >
              <Text className={direction === d ? 'text-white font-semibold' : 'text-gray-600'}>
                {d === 'DEPARTURE' ? '출발' : '도착'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="편명 검색 (예: KE123)"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="characters"
        />
      </View>

      <AdBanner />
      <FlashList
        data={flights}
        estimatedItemSize={80}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item: flight }: { item: FlightStatus }) => {
          const statusKey = flight.status.toLowerCase() as keyof typeof colors.status;
          const statusColor = colors.status[statusKey] ?? '#6b7280';
          return (
            <TouchableOpacity
              className="bg-white mx-4 mt-2 rounded-xl p-4 shadow-sm"
              onPress={() => router.push(`/flight/${flight.flightNo}`)}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-mono font-bold text-base">{flight.flightNo}</Text>
                  <Text className="text-gray-500 text-sm">{flight.airline}</Text>
                  <Text className="text-gray-700 mt-1">{flight.destination ?? flight.origin}</Text>
                </View>
                <View className="items-end gap-1">
                  <Text className="font-semibold">{formatTime(flight.scheduledTime)}</Text>
                  {flight.estimatedTime && (
                    <Text className="text-orange-500 text-sm">
                      {formatTime(flight.estimatedTime)}
                    </Text>
                  )}
                  <View
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  >
                    <Text className="text-white text-xs">
                      {STATUS_LABELS[flight.status as FlightStatusCode] ?? flight.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item: FlightStatus) => item.flightId}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
