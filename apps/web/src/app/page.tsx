'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FlightApi, ParkingApi, BatchApi } from '@/lib/api';

function StatCard({
  title,
  value,
  sub,
  href,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  sub?: string;
  href: string;
  color?: 'blue' | 'green' | 'orange' | 'gray';
}) {
  const ring: Record<string, string> = {
    blue:   'border-blue-100 hover:border-blue-300',
    green:  'border-green-100 hover:border-green-300',
    orange: 'border-orange-100 hover:border-orange-300',
    gray:   'border-gray-100 hover:border-gray-300',
  };
  const text: Record<string, string> = {
    blue: 'text-blue-600', green: 'text-green-600',
    orange: 'text-orange-500', gray: 'text-gray-700',
  };
  return (
    <Link
      href={href}
      className={`block bg-white rounded-xl p-6 shadow-sm border transition-all ${ring[color]}`}
    >
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${text[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Link>
  );
}

export default function DashboardPage() {
  const { data: depFlights } = useQuery({
    queryKey: ['dashboard', 'flights', 'dep'],
    queryFn: () => FlightApi.fetchRealtime({ airportCode: 'ICN', direction: 'DEPARTURE' }),
    refetchInterval: 60_000,
  });

  const { data: arrFlights } = useQuery({
    queryKey: ['dashboard', 'flights', 'arr'],
    queryFn: () => FlightApi.fetchRealtime({ airportCode: 'ICN', direction: 'ARRIVAL' }),
    refetchInterval: 60_000,
  });

  const { data: parkingSummary } = useQuery({
    queryKey: ['dashboard', 'parking'],
    queryFn: () => ParkingApi.fetchSummary('ICN'),
    refetchInterval: 60_000,
  });

  const { data: batchLogs } = useQuery({
    queryKey: ['dashboard', 'batch'],
    queryFn: () => BatchApi.fetchLogs({ limit: 10 }),
    refetchInterval: 30_000,
  });

  const depCount  = depFlights?.data?.length ?? '-';
  const arrCount  = arrFlights?.data?.length ?? '-';
  const alerts    = [...(depFlights?.data ?? []), ...(arrFlights?.data ?? [])]
    .filter((f) => f.status === 'DELAYED' || f.status === 'CANCELLED').length;

  const parking    = parkingSummary?.data;
  const parkingPct = parking
    ? Math.round((parking.availableSpots / parking.totalSpots) * 100)
    : null;

  const logs      = batchLogs?.data ?? [];
  const lastBatch = logs[0] as { jobName: string; status: string; recordsCount: number; startedAt: string } | undefined;
  const failCount = logs.filter((l: { status: string }) => l.status === 'FAIL').length;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-1">대시보드</h1>
      <p className="text-gray-400 text-sm mb-8">인천국제공항 기준 · 60초 자동 갱신</p>

      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          운항 현황 (오늘 · ICN)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="오늘 출발편" value={depCount} href="/flights" color="blue" />
          <StatCard title="오늘 도착편" value={arrCount} href="/flights" color="blue" />
          <StatCard
            title="지연 · 결항"
            value={alerts}
            sub={alerts > 0 ? '확인 필요' : '정상 운항'}
            href="/flights"
            color={alerts > 0 ? 'orange' : 'green'}
          />
          <StatCard
            title="인천 주차 잔여율"
            value={parkingPct !== null ? `${parkingPct}%` : '-'}
            sub={
              parking
                ? `${parking.availableSpots.toLocaleString()} / ${parking.totalSpots.toLocaleString()} 면`
                : undefined
            }
            href="/parking"
            color={parkingPct !== null && parkingPct < 15 ? 'orange' : 'green'}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          배치 현황 (최근 10건)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="최근 실패"
            value={failCount}
            sub={
              lastBatch
                ? `마지막 실행: ${new Date(lastBatch.startedAt).toLocaleTimeString('ko-KR')}`
                : '데이터 없음'
            }
            href="/batch"
            color={failCount > 0 ? 'orange' : 'green'}
          />
          <StatCard
            title="마지막 작업"
            value={lastBatch?.jobName ?? '-'}
            sub={
              lastBatch
                ? lastBatch.status === 'SUCCESS'
                  ? `${lastBatch.recordsCount.toLocaleString()}건 처리`
                  : '실패'
                : undefined
            }
            href="/batch"
            color={lastBatch?.status === 'FAIL' ? 'orange' : 'gray'}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          바로가기
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: '/flights',     label: '운항 현황',  desc: '실시간 출도착' },
            { href: '/parking',     label: '주차 현황',  desc: '공항별 잔여' },
            { href: '/immigration', label: '입출국장',   desc: '게이트 혼잡도' },
            { href: '/weather',     label: '날씨 정보',  desc: '15개 공항' },
            { href: '/batch',       label: '배치 로그',  desc: '수집 현황' },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-sm mb-0.5">{c.label}</p>
              <p className="text-xs text-gray-400">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
