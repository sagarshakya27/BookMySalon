const DEFAULT_USER_LOCATION = {
  latitude: 28.6139,
  longitude: 77.209,
  label: "Your area",
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const getSalonCoordinates = (salon) => {
  const latitude =
    toNumber(salon?.latitude) ??
    toNumber(salon?.lat) ??
    toNumber(salon?.locationLat) ??
    toNumber(salon?.locationLatitude);
  const longitude =
    toNumber(salon?.longitude) ??
    toNumber(salon?.lng) ??
    toNumber(salon?.locationLng) ??
    toNumber(salon?.locationLongitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return { latitude, longitude };
};

const toRadians = (value) => (value * Math.PI) / 180;

export const getDistanceInKm = (origin, destination) => {
  if (!origin || !destination) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(destination.latitude);

  const distance =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));
  return earthRadiusKm * arc;
};

export const getSalonDistanceLabel = (salon, userLocation = DEFAULT_USER_LOCATION) => {
  const salonCoordinates = getSalonCoordinates(salon);
  const distance = getDistanceInKm(userLocation, salonCoordinates);

  if (distance === null) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
};

export const buildGoogleMapsUrl = (salon, userLocation = DEFAULT_USER_LOCATION) => {
  const salonCoordinates = getSalonCoordinates(salon);
  const destination = salonCoordinates
    ? `${salonCoordinates.latitude},${salonCoordinates.longitude}`
    : encodeURIComponent(salon?.address || salon?.location || salon?.name || "Salon");

  const origin = `${userLocation.latitude},${userLocation.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
};

export { DEFAULT_USER_LOCATION };
