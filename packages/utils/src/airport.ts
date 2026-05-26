export const KAC_AIRPORTS = [
  { code: 'GMP', name: '김포국제공항' },
  { code: 'PUS', name: '김해국제공항' },
  { code: 'CJU', name: '제주국제공항' },
  { code: 'TAE', name: '대구국제공항' },
  { code: 'CJJ', name: '청주국제공항' },
  { code: 'MWX', name: '무안국제공항' },
  { code: 'YNY', name: '양양국제공항' },
  { code: 'USN', name: '울산공항' },
  { code: 'KWJ', name: '광주공항' },
  { code: 'RSU', name: '여수공항' },
  { code: 'KPO', name: '포항경주공항' },
  { code: 'HIN', name: '사천공항' },
  { code: 'KUV', name: '군산공항' },
  { code: 'WJU', name: '원주공항' },
] as const;

export const ALL_AIRPORTS = [
  { code: 'ICN', name: '인천국제공항', type: 'INCHEON' as const },
  ...KAC_AIRPORTS.map(a => ({ ...a, type: 'KAC' as const })),
];

export function getAirportName(code: string): string {
  return ALL_AIRPORTS.find(a => a.code === code)?.name ?? code;
}
