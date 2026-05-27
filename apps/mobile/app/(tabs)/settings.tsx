import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { DeviceApi } from '../../src/lib/api';
import { useAppStore } from '../../src/store/appStore';
import { FavoriteFlight } from '@airport-app/types';

const AIRPORTS = [
  { code: 'ICN', name: '인천국제공항' },
  { code: 'GMP', name: '김포국제공항' },
  { code: 'PUS', name: '김해국제공항' },
  { code: 'CJU', name: '제주국제공항' },
];

export default function SettingsScreen() {
  const { deviceId, defaultAirport, isNotificationOn, setDefaultAirport, toggleNotification } =
    useAppStore();
  const qc = useQueryClient();

  const { data: favData } = useQuery({
    queryKey: queryKeys.favorites.list(deviceId ?? ''),
    queryFn: () => DeviceApi.getFavorites(deviceId!),
    enabled: !!deviceId,
  });

  const removeMutation = useMutation({
    mutationFn: ({ favoriteId }: { favoriteId: number }) =>
      DeviceApi.removeFavorite(deviceId!, favoriteId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.favorites.list(deviceId ?? '') }),
  });

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">설정</Text>

        <View className="bg-white rounded-xl mb-4 overflow-hidden">
          <Text className="px-4 pt-4 pb-2 text-sm text-gray-400 font-medium">기본 공항</Text>
          {AIRPORTS.map((a) => (
            <TouchableOpacity
              key={a.code}
              className="flex-row justify-between items-center px-4 py-3 border-t border-gray-50"
              onPress={() => setDefaultAirport(a.code)}
            >
              <Text>{a.name}</Text>
              {defaultAirport === a.code && <Text className="text-blue-600 font-bold">✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-white rounded-xl mb-4 p-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-medium">푸시 알림</Text>
            <Switch value={isNotificationOn} onValueChange={toggleNotification} />
          </View>
        </View>

        <View className="bg-white rounded-xl overflow-hidden">
          <Text className="px-4 pt-4 pb-2 text-sm text-gray-400 font-medium">즐겨찾기 항공편</Text>
          {(favData?.data ?? []).length === 0 ? (
            <Text className="px-4 pb-4 text-gray-400 text-sm">즐겨찾기가 없습니다</Text>
          ) : (
            (favData?.data ?? []).map((fav: FavoriteFlight) => (
              <View
                key={fav.favoriteId}
                className="flex-row justify-between items-center px-4 py-3 border-t border-gray-50"
              >
                <View>
                  <Text className="font-mono font-semibold">{fav.flightNo}</Text>
                  <Text className="text-gray-400 text-xs">
                    {fav.direction === 'DEPARTURE' ? '출발' : '도착'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeMutation.mutate({ favoriteId: fav.favoriteId })}
                  className="px-3 py-1 rounded bg-red-50"
                >
                  <Text className="text-red-500 text-sm">삭제</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
