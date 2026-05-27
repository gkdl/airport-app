import { colors } from '@airport-app/tokens';

const LEVEL_LABELS: Record<string, string> = {
  AVAILABLE: '여유', NORMAL: '보통', CONGESTED: '혼잡', FULL: '매우혼잡',
};

const LEVEL_COLORS: Record<string, string> = {
  AVAILABLE: colors.congestion.available,
  NORMAL:    colors.congestion.normal,
  CONGESTED: colors.congestion.congested,
  FULL:      colors.congestion.full,
};

export function CongestionBadge({ level }: { level: string }) {
  const color = LEVEL_COLORS[level] ?? LEVEL_COLORS['NORMAL'];
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: color }}>
      {LEVEL_LABELS[level] ?? level}
    </span>
  );
}
