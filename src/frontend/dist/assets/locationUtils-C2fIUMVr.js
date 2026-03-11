async function captureLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 1e4 }
    );
  });
}
function formatGPS(lat, lng) {
  return `[GPS:${lat.toFixed(5)},${lng.toFixed(5)}]`;
}
function parseGPS(text) {
  const m = text.match(/\[GPS:([-\d.]+),([-\d.]+)\]/);
  if (!m) return null;
  return { lat: Number.parseFloat(m[1]), lng: Number.parseFloat(m[2]) };
}
function gpsToMapsURL(lat, lng) {
  return `https://maps.google.com/?q=${lat},${lng}`;
}
export {
  captureLocation as c,
  formatGPS as f,
  gpsToMapsURL as g,
  parseGPS as p
};
