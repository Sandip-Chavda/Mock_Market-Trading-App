export function isUSMarketOpen(): boolean {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  // EDT is UTC-4 (March to November), EST is UTC-5 (November to March)
  const month = now.getUTCMonth() + 1; // 1-12
  const isDST = month >= 3 && month <= 11; // approximate DST period
  const offset = isDST ? -4 : -5;

  const et = new Date(utc + 3600000 * offset);

  const day = et.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 30; // 570
  const marketClose = 16 * 60; // 960

  if (day === 0 || day === 6) return false;
  return totalMinutes >= marketOpen && totalMinutes < marketClose;
}
