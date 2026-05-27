'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { ImmigrationApi } from '@/lib/api';
import { CongestionBadge } from '@/components/CongestionBadge';

export default function ImmigrationPage() {
  const [direction, setDirection] = useState<'ARRIVAL' | 'DEPARTURE'>('ARRIVAL');
  const [terminal, setTerminal] = useState('T1');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.immigration.list({ airportCode: 'ICN', direction, terminal }),
    queryFn: () => ImmigrationApi.fetchImmigration({ airportCode: 'ICN', direction, terminal }),
    refetchInterval: 30_000,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">입출국장 혼잡도 (인천공항)</h1>
      <div className="flex gap-3 mb-6">
        <div className="flex rounded border overflow-hidden">
          {(['ARRIVAL', 'DEPARTURE'] as const).map((d) => (
            <button key={d}
              className={`px-4 py-2 text-sm ${direction === d ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setDirection(d)}
            >
              {d === 'ARRIVAL' ? '입국장' : '출국장'}
            </button>
          ))}
        </div>
        <div className="flex rounded border overflow-hidden">
          {['T1', 'T2'].map((t) => (
            <button key={t}
              className={`px-4 py-2 text-sm ${terminal === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setTerminal(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(data?.data ?? []).map((g: { immigrationId: string; gate: string; waitingCount: number; congestionLevel: string }) => (
            <div key={g.immigrationId} className="bg-white rounded-xl p-4 shadow text-center">
              <p className="text-sm text-gray-500 mb-1">게이트 {g.gate}</p>
              <p className="text-2xl font-bold mb-2">{g.waitingCount}<span className="text-sm font-normal text-gray-400">명</span></p>
              <CongestionBadge level={g.congestionLevel} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
