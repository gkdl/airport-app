'use client';
import { useQuery } from '@tanstack/react-query';
import { BatchApi } from '@/lib/api';

export default function BatchPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['batch-logs'],
    queryFn: () => BatchApi.fetchLogs(),
    refetchInterval: 30_000,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">배치 실행 로그</h1>
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="py-3 px-4">작업명</th>
                <th className="py-3 px-4">공항</th>
                <th className="py-3 px-4">상태</th>
                <th className="py-3 px-4">처리건수</th>
                <th className="py-3 px-4">소요시간</th>
                <th className="py-3 px-4">시작시각</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((log: { logId: number; jobName: string; airportCode?: string; status: string; recordsCount: number; durationMs?: number; startedAt: string }) => (
                <tr key={log.logId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">{log.jobName}</td>
                  <td className="py-3 px-4">{log.airportCode ?? '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{log.recordsCount.toLocaleString()}</td>
                  <td className="py-3 px-4">{log.durationMs ? `${log.durationMs}ms` : '-'}</td>
                  <td className="py-3 px-4">{new Date(log.startedAt).toLocaleString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
