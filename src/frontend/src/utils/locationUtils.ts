export async function captureLocation(): Promise<{
  lat: number;
  lng: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 10000 },
    );
  });
}

export function formatGPS(lat: number, lng: number): string {
  return `[GPS:${lat.toFixed(5)},${lng.toFixed(5)}]`;
}

export function parseGPS(text: string): { lat: number; lng: number } | null {
  const m = text.match(/\[GPS:([-\d.]+),([-\d.]+)\]/);
  if (!m) return null;
  return { lat: Number.parseFloat(m[1]), lng: Number.parseFloat(m[2]) };
}

export function gpsToMapsURL(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}
