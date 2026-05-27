import { colors } from '@airport-app/tokens';

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: '예정', DELAYED: '지연', CANCELLED: '결항',
  BOARDING: '탑승', DEPARTED: '출발', ARRIVED: '도착',
  DIVERTED: '우회', LANDED: '착륙',
};

export function StatusBadge({ status }: { status: string }) {
  const color = colors.status[status.toLowerCase() as keyof typeof colors.status] ?? '#6b7280';
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: color }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
