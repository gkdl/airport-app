'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { ParkingApi } from '@/lib/api';
import { CongestionBar } from '@/components/CongestionBar';

export default function ParkingPage() {
  const [airportCode, setAirportCode] = useState('ICN');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.parking.list(airportCode),
    queryFn: () => ParkingApi.fetchParking({ airportCode }),
    refetchInterval: 60_000,
  });

  const { data: summary } = useQuery({
    queryKey: queryKeys.parking.summary(airportCode),
    queryFn: () => ParkingApi.fetchSummary(airportCode),
    refetchInterval: 60_000,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">주차 현황</h1>
      <select
        className="border rounded px-3 py-2 text-sm mb-6"
        value={airportCode}
        onChange={(e) => setAirportCode(e.target.value)}
      >
        <option value="ICN">인천국제공항</option>
        <option value="GMP">김포국제공항</option>
        <option value="PUS">김해국제공항</option>
        <option value="CJU">제주국제공항</option>
      </select>

      {summary?.data && (
        <div className="bg-white rounded-xl p-4 shadow mb-6 flex gap-8">
          <div>
            <p className="text-xs text-gray-400">전체</p>
            <p className="text-2xl font-bold">{summary.data.totalSpots.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">잔여</p>
            <p className="text-2xl font-bold text-green-600">{summary.data.availableSpots.toLocaleString()}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data ?? []).map((p: { parkingId: string; zone: string; terminal?: string; totalSpots: number; availableSpots: number; occupiedSpots: number; congestionLevel: string }) => (
            <div key={p.parkingId} className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{p.zone}</span>
                {p.terminal && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.terminal}</span>}
              </div>
              <p className="text-sm text-gray-500 mb-3">잔여: {p.availableSpots} / {p.totalSpots}</p>
              <CongestionBar occupied={p.occupiedSpots} total={p.totalSpots} level={p.congestionLevel} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
