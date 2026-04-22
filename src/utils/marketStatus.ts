export function isUSMarketOpen(): boolean {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const est = new Date(utc + 3600000 * -5); // EST offset

  const day = est.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = est.getHours();
  const minutes = est.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Market open: Mon-Fri 9:30 AM - 4:00 PM EST
  const marketOpen = 9 * 60 + 30; // 570
  const marketClose = 16 * 60; // 960

  if (day === 0 || day === 6) return false; // weekend
  return totalMinutes >= marketOpen && totalMinutes < marketClose;
}
