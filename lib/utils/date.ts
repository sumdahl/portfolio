export const DATE_PRESETS = {
  short: { month: 'short', day: 'numeric', year: 'numeric' } as const,
  long: { year: 'numeric', month: 'long', day: 'numeric' } as const,
  full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const,
  datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as const,
};

export function formatDate(
  date: string | Date | number,
  options: Intl.DateTimeFormatOptions = DATE_PRESETS.long
): string {
  const d = new Date(date);
  // Handle invalid dates gracefully or throw? For UI text, usually returning a fallback or empty string is safer,
  // but let's assume valid dates for now or return 'Invalid Date' string from native method.
  return d.toLocaleDateString('en-US', options);
}
