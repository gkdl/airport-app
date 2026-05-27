'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@airport-app/hooks';
import { WeatherApi } from '@/lib/api';
import { ALL_AIRPORTS } from '@airport-app/utils';

export default function WeatherPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">공항 날씨 정보</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_AIRPORTS.map((airport) => (
          <WeatherCard key={airport.code} code={airport.code} name={airport.name} />
        ))}
      </div>
    </main>
  );
}

function WeatherCard({ code, name }: { code: string; name: string }) {
  const { data } = useQuery({
    queryKey: queryKeys.weather.byAirport(code),
    queryFn: () => WeatherApi.fetchWeather(code),
    refetchInterval: 1_800_000,
  });

  const w = data?.data;

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="font-semibold mb-1">{name}</p>
      <p className="text-xs text-gray-400 mb-3">{code}</p>
      {w ? (
        <div>
          <p className="text-3xl font-bold">{w.temperature?.toFixed(1)}°C</p>
          <p className="text-sm text-gray-500 mt-1">습도 {w.humidity}% · 풍속 {w.windSpeed}m/s</p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">데이터 없음</p>
      )}
    </div>
  );
}
