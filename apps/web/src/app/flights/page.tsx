'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { FlightQueryDto, FlightApi, FlightStatusEntity } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { formatTime } from '@airport-app/utils';

export default function FlightsPage() {
  const [query, setQuery] = useState<FlightQueryDto>({ airportCode: 'ICN', direction: 'DEPARTURE' });

  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: queryKeys.flights.realtime(query),
    queryFn: () => FlightApi.fetchRealtime(query),
    refetchInterval: 60_000,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">실시간 운항 현황</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={query.airportCode}
          onChange={(e) => setQuery(q => ({ ...q, airportCode: e.target.value }))}
        >
          <option value="ICN">인천국제공항</option>
          <option value="GMP">김포국제공항</option>
          <option value="PUS">김해국제공항</option>
          <option value="CJU">제주국제공항</option>
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={query.direction}
          onChange={(e) => setQuery(q => ({ ...q, direction: e.target.value as 'DEPARTURE' | 'ARRIVAL' }))}
        >
          <option value="DEPARTURE">출발</option>
          <option value="ARRIVAL">도착</option>
        </select>
      </div>

      {dataUpdatedAt > 0 && (
        <p className="text-xs text-gray-400 mb-3">업데이트: {new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')}</p>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">데이터 로딩 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="py-3 px-4">편명</th>
                <th className="py-3 px-4">항공사</th>
                <th className="py-3 px-4">목적지/출발지</th>
                <th className="py-3 px-4">예정</th>
                <th className="py-3 px-4">변경</th>
                <th className="py-3 px-4">탑승구</th>
                <th className="py-3 px-4">상태</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((flight: FlightStatusEntity) => (
                <tr key={flight.flightId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-semibold">{flight.flightNo}</td>
                  <td className="py-3 px-4">{flight.airline}</td>
                  <td className="py-3 px-4">{flight.destination ?? flight.origin}</td>
                  <td className="py-3 px-4">{formatTime(flight.scheduledTime)}</td>
                  <td className="py-3 px-4">{flight.estimatedTime ? formatTime(flight.estimatedTime) : '-'}</td>
                  <td className="py-3 px-4">{flight.gate ?? '-'}</td>
                  <td className="py-3 px-4"><StatusBadge status={flight.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
