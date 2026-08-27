export interface DetectedLocation {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

/**
 * Normalizes state name to match Indian states list if applicable
 */
function normalizeState(rawState?: string): string {
  if (!rawState) return 'Maharashtra';
  const clean = rawState.trim().toLowerCase();
  const match = INDIAN_STATES.find((s) => s.toLowerCase() === clean || clean.includes(s.toLowerCase()));
  return match || rawState;
}

/**
 * Fetches user's current GPS location and reverse geocodes to street, city, state, PIN code.
 */
export async function getCurrentLocation(): Promise<DetectedLocation> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  // 1. Get GPS coordinates
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 30000,
    });
  });

  const { latitude, longitude } = position.coords;

  // 2. Try Nominatim (OpenStreetMap) first with fallback to BigDataCloud
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AmazonCloneApp/1.0',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const street =
        addr.road ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.commercial ||
        data.display_name.split(',')[0] ||
        'Current Location';

      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.state_district ||
        addr.county ||
        'Mumbai';

      const state = normalizeState(addr.state);
      const postalCode = addr.postcode || '';
      const country = addr.country || 'India';

      return {
        street,
        apartment: addr.neighbourhood || addr.suburb || '',
        city,
        state,
        postalCode,
        country,
        formattedAddress: data.display_name || `${street}, ${city}, ${state} ${postalCode}`,
        latitude,
        longitude,
      };
    }
  } catch (nominatimErr) {
    console.warn('Nominatim reverse geocode failed, trying fallback provider:', nominatimErr);
  }

  // 3. Fallback provider (BigDataCloud Free Reverse Geocode)
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (response.ok) {
      const data = await response.json();
      const street = data.locality || data.localityInfo?.administrative?.[3]?.name || 'Current Location';
      const city = data.city || data.principalSubdivision || 'Bengaluru';
      const state = normalizeState(data.principalSubdivision);
      const postalCode = data.postcode || '';
      const country = data.countryName || 'India';

      return {
        street,
        city,
        state,
        postalCode,
        country,
        formattedAddress: `${street}, ${city}, ${state} ${postalCode}`,
        latitude,
        longitude,
      };
    }
  } catch (fallbackErr) {
    console.warn('Fallback geocoding error:', fallbackErr);
  }

  // Generic coordinate fallback if reverse geocoding APIs fail
  return {
    street: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    city: 'Local Area',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    formattedAddress: `GPS Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    latitude,
    longitude,
  };
}
