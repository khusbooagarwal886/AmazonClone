export interface PincodeDetails {
  city: string;
  state: string;
  district?: string;
  country: string;
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
 * Normalizes state name to match Indian states dropdown
 */
export function normalizeIndianState(rawState?: string): string {
  if (!rawState) return 'Maharashtra';
  const clean = rawState.trim().toLowerCase();
  const match = INDIAN_STATES.find(
    (s) => s.toLowerCase() === clean || clean.includes(s.toLowerCase()) || s.toLowerCase().includes(clean)
  );
  return match || rawState;
}

/**
 * Fast offline prefix mapping for instant (0ms) state/city prediction
 */
const PIN_PREFIX_MAP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi' },
  '12': { city: 'Gurugram', state: 'Haryana' },
  '13': { city: 'Ambala', state: 'Haryana' },
  '14': { city: 'Ludhiana', state: 'Punjab' },
  '15': { city: 'Bathinda', state: 'Punjab' },
  '16': { city: 'Chandigarh', state: 'Punjab' },
  '17': { city: 'Shimla', state: 'Himachal Pradesh' },
  '18': { city: 'Jammu', state: 'Punjab' },
  '19': { city: 'Srinagar', state: 'Punjab' },
  '20': { city: 'Noida', state: 'Uttar Pradesh' },
  '21': { city: 'Prayagraj', state: 'Uttar Pradesh' },
  '22': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '23': { city: 'Mirzapur', state: 'Uttar Pradesh' },
  '24': { city: 'Dehradun', state: 'Uttarakhand' },
  '25': { city: 'Meerut', state: 'Uttar Pradesh' },
  '26': { city: 'Bareilly', state: 'Uttar Pradesh' },
  '27': { city: 'Gorakhpur', state: 'Uttar Pradesh' },
  '28': { city: 'Agra', state: 'Uttar Pradesh' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '31': { city: 'Udaipur', state: 'Rajasthan' },
  '32': { city: 'Kota', state: 'Rajasthan' },
  '33': { city: 'Bikaner', state: 'Rajasthan' },
  '34': { city: 'Jodhpur', state: 'Rajasthan' },
  '36': { city: 'Rajkot', state: 'Gujarat' },
  '37': { city: 'Bhuj', state: 'Gujarat' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '39': { city: 'Surat', state: 'Gujarat' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '41': { city: 'Pune', state: 'Maharashtra' },
  '42': { city: 'Nashik', state: 'Maharashtra' },
  '43': { city: 'Aurangabad', state: 'Maharashtra' },
  '44': { city: 'Nagpur', state: 'Maharashtra' },
  '45': { city: 'Indore', state: 'Madhya Pradesh' },
  '46': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '47': { city: 'Gwalior', state: 'Madhya Pradesh' },
  '48': { city: 'Jabalpur', state: 'Madhya Pradesh' },
  '49': { city: 'Raipur', state: 'Chhattisgarh' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '51': { city: 'Tirupati', state: 'Andhra Pradesh' },
  '52': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '53': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '56': { city: 'Bengaluru', state: 'Karnataka' },
  '57': { city: 'Mangaluru', state: 'Karnataka' },
  '58': { city: 'Hubballi', state: 'Karnataka' },
  '59': { city: 'Belagavi', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '61': { city: 'Thanjavur', state: 'Tamil Nadu' },
  '62': { city: 'Madurai', state: 'Tamil Nadu' },
  '63': { city: 'Salem', state: 'Tamil Nadu' },
  '64': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '67': { city: 'Kozhikode', state: 'Kerala' },
  '68': { city: 'Kochi', state: 'Kerala' },
  '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '71': { city: 'Howrah', state: 'West Bengal' },
  '72': { city: 'Kharagpur', state: 'West Bengal' },
  '73': { city: 'Siliguri', state: 'West Bengal' },
  '74': { city: 'Barasat', state: 'West Bengal' },
  '75': { city: 'Bhubaneswar', state: 'Odisha' },
  '76': { city: 'Cuttack', state: 'Odisha' },
  '77': { city: 'Rourkela', state: 'Odisha' },
  '78': { city: 'Guwahati', state: 'Assam' },
  '79': { city: 'Shillong', state: 'Meghalaya' },
  '80': { city: 'Patna', state: 'Bihar' },
  '81': { city: 'Bhagalpur', state: 'Bihar' },
  '82': { city: 'Gaya', state: 'Bihar' },
  '83': { city: 'Ranchi', state: 'Jharkhand' },
  '84': { city: 'Muzaffarpur', state: 'Bihar' },
  '85': { city: 'Purnia', state: 'Bihar' },
};

/**
 * Look up Indian PIN code and return City (District) and State.
 * Uses official India Post API with offline fallback.
 */
export async function lookupPincode(pincode: string): Promise<PincodeDetails | null> {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) return null;

  // 1. Check official India Post Postal PIN Code API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.District || postOffice.Block || postOffice.Name || 'City';
        const rawState = postOffice.State || 'Maharashtra';
        const state = normalizeIndianState(rawState);

        return {
          city,
          state,
          district: postOffice.District,
          country: 'India',
        };
      }
    }
  } catch (err) {
    console.warn('Online postal PIN code lookup timed out or failed, using local prefix lookup:', err);
  }

  // 2. Fast prefix lookup fallback
  const prefix2 = cleanPin.slice(0, 2);
  if (PIN_PREFIX_MAP[prefix2]) {
    const info = PIN_PREFIX_MAP[prefix2];
    return {
      city: info.city,
      state: info.state,
      country: 'India',
    };
  }

  return null;
}
