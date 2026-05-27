import Link from 'next/link';

export default function Home() {
  const cards = [
    { href: '/flights', title: '운항 현황', desc: '실시간 출/도착 항공편', icon: '✈️' },
    { href: '/parking', title: '주차 현황', desc: '공항별 주차장 잔여', icon: '🅿️' },
    { href: '/immigration', title: '입출국장', desc: '게이트별 혼잡도', icon: '🛂' },
    { href: '/weather', title: '날씨 정보', desc: '공항 목적지 기상', icon: '🌤️' },
    { href: '/batch', title: '배치 로그', desc: '데이터 수집 현황', icon: '📊' },
  ];

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">공항 통합 정보 관리</h1>
      <p className="text-gray-500 mb-8">전국 15개 공항 실시간 데이터 모니터링</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="block p-6 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-1">{card.title}</h2>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
