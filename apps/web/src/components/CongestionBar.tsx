import { colors } from '@airport-app/tokens';

const LEVEL_COLORS: Record<string, string> = {
  AVAILABLE: colors.congestion.available,
  NORMAL:    colors.congestion.normal,
  CONGESTED: colors.congestion.congested,
  FULL:      colors.congestion.full,
};

export function CongestionBar({ occupied, total, level }: { occupied: number; total: number; level: string }) {
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const color = LEVEL_COLORS[level] ?? LEVEL_COLORS['NORMAL'];
  return (
    <div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-gray-400 mt-1 text-right">{pct}%</p>
    </div>
  );
}
