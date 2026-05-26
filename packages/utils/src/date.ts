export function formatTime(date: Date | string | null): string {
  if (!date) return '--:--';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function calcDelayMinutes(scheduled: Date | string, actual: Date | string | null): number {
  if (!actual) return 0;
  const s = typeof scheduled === 'string' ? new Date(scheduled) : scheduled;
  const a = typeof actual === 'string' ? new Date(actual) : actual;
  return Math.max(0, Math.round((a.getTime() - s.getTime()) / 60000));
}

export function toKstIsoString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}
