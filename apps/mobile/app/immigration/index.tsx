import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queryKeys } from '@airport-app/hooks';
import { ImmigrationApi } from '../../src/lib/api';
import { colors } from '@airport-app/tokens';
import { ImmigrationStatus } from '@airport-app/types';

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
  FULL: '매우혼잡',
};

export default function ImmigrationScreen() {
  const [direction, setDirection] = useState<'ARRIVAL' | 'DEPARTURE'>('ARRIVAL');
  const [terminal, setTerminal] = useState('T1');

  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.immigration.list({ airportCode: 'ICN', direction, terminal }),
    queryFn: () => ImmigrationApi.getList({ airportCode: 'ICN', direction, terminal }),
    refetchInterval: 30_000,
  });

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-1">입출국장 현황</Text>
        <Text className="text-gray-500 text-sm mb-4">인천국제공항</Text>

        <View className="flex-row gap-2 mb-4">
          <View className="flex-row rounded-xl border border-gray-200 overflow-hidden flex-1">
            {(['ARRIVAL', 'DEPARTURE'] as const).map((d) => (
              <TouchableOpacity
                key={d}
                className={`flex-1 py-2 items-center ${direction === d ? 'bg-blue-600' : 'bg-white'}`}
                onPress={() => setDirection(d)}
              >
                <Text
                  className={
                    direction === d ? 'text-white font-semibold text-sm' : 'text-gray-500 text-sm'
                  }
                >
                  {d === 'ARRIVAL' ? '입국장' : '출국장'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row rounded-xl border border-gray-200 overflow-hidden">
            {['T1', 'T2'].map((t) => (
              <TouchableOpacity
                key={t}
                className={`px-4 py-2 items-center ${terminal === t ? 'bg-blue-600' : 'bg-white'}`}
                onPress={() => setTerminal(t)}
              >
                <Text
                  className={
                    terminal === t ? 'text-white font-semibold text-sm' : 'text-gray-500 text-sm'
                  }
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {(data?.data ?? []).map((gate: ImmigrationStatus) => {
            const color = LEVEL_COLORS[gate.congestionLevel] ?? LEVEL_COLORS['NORMAL']!;
            return (
              <View
                key={gate.immigrationId}
                className="bg-white rounded-xl p-4 shadow-sm"
                style={{ width: '47%' }}
              >
                <Text className="text-sm text-gray-400 mb-1">게이트 {gate.gate}</Text>
                <Text className="text-2xl font-bold mb-1">{gate.waitingCount}</Text>
                <Text className="text-xs text-gray-400 mb-2">명 대기</Text>
                <View
                  className="self-start px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                >
                  <Text className="text-white text-xs">
                    {LEVEL_LABELS[gate.congestionLevel] ?? gate.congestionLevel}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
