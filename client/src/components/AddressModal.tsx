import { useState } from 'react';
import { useAddressStore } from '../store/useAddressStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCurrentLocation } from '../lib/geolocation';
import { lookupPincode } from '../lib/pincodeLookup';
import type { Address } from '../types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const {
    getAddresses,
    getSelectedAddress,
    selectAddress,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressStore();

  const { user } = useAuthStore();

  const addresses = getAddresses();
  const selectedAddress = getSelectedAddress();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeFeedback, setPincodeFeedback] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Handle PIN code change with auto-fill for City and State
   */
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanPin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, postalCode: cleanPin }));

    if (cleanPin.length === 6) {
      setIsPincodeLoading(true);
      setPincodeFeedback(null);
      try {
        const details = await lookupPincode(cleanPin);
        if (details) {
          setFormData((prev) => ({
            ...prev,
            city: details.city,
            state: details.state,
          }));
          setPincodeFeedback(`✓ Auto-filled: ${details.city}, ${details.state}`);
          setTimeout(() => {
            setPincodeFeedback(null);
          }, 5000);
        }
      } catch (err) {
        console.warn('Pincode lookup error:', err);
      } finally {
        setIsPincodeLoading(false);
      }
    } else {
      setPincodeFeedback(null);
    }
  };

  /**
   * Fetches the user's live GPS location and auto-fills or creates address
   */
  const handleFetchCurrentLocation = async (autoSaveDirectly = false) => {
    try {
      setIsLocating(true);
      setFormError(null);
      setLocationSuccessMsg(null);

      const loc = await getCurrentLocation();

      const updatedFormData = {
        fullName: formData.fullName || user?.name || 'My Location',
        phone: formData.phone || '9876543210',
        street: loc.street || 'Current GPS Location',
        apartment: loc.apartment || '',
        city: loc.city || 'Mumbai',
        state: loc.state || 'Maharashtra',
        postalCode: loc.postalCode || '400001',
        country: loc.country || 'India',
        isDefault: formData.isDefault,
      };

      setFormData(updatedFormData);

      if (autoSaveDirectly && (user?.name || formData.fullName)) {
        addAddress(updatedFormData);
        setLocationSuccessMsg(`✓ Added & Selected: ${loc.city}, ${loc.state} (${loc.postalCode})`);
        setTimeout(() => {
          setLocationSuccessMsg(null);
        }, 4000);
      } else {
        // Switch to the form view so user can enter or confirm their contact details
        setIsAddingNew(true);
        setLocationSuccessMsg(`✓ Location detected: ${loc.city}, ${loc.state} ${loc.postalCode}`);
        setTimeout(() => {
          setLocationSuccessMsg(null);
        }, 5000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('denied')) {
          setFormError('Location access was denied. Please allow location permissions in your browser.');
        } else {
          setFormError(err.message || 'Unable to fetch your GPS location.');
        }
      } else {
        setFormError('Failed to detect GPS location. Please enter manually.');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      setFormError('Please fill in all required fields (Name, Phone, Street, City, PIN Code).');
      return;
    }

    addAddress(formData);
    setIsAddingNew(false);
    setFormData({
      fullName: user?.name || '',
      phone: '',
      street: '',
      apartment: '',
      city: '',
      state: 'Maharashtra',
      postalCode: '',
      country: 'India',
      isDefault: false,
    });
    setFormError(null);
    setLocationSuccessMsg(null);
    setPincodeFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📍</span>
            <h2 className="text-base font-bold tracking-tight">Choose your delivery location</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick GPS Location Detection Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                {isLocating ? '📡' : '📍'}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Deliver to your current location
                </p>
                <p className="text-[11px] text-gray-600">
                  Detect your GPS coordinates &amp; auto-fill city, state and PIN code.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFetchCurrentLocation(false)}
              disabled={isLocating}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-3.5 py-1.5 rounded-md text-xs transition cursor-pointer flex items-center space-x-1.5 shadow-xs disabled:opacity-50 shrink-0"
            >
              {isLocating ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <span>🛰️</span>
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          {locationSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold text-xs flex items-center space-x-2 animate-in fade-in">
              <span>🎉</span>
              <span>{locationSuccessMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-xs flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-900 hover:underline font-bold text-xs ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {!isAddingNew ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Saved Delivery Addresses ({addresses.length})
                </h3>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {addresses.map((addr: Address) => {
                  const isCurrent = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => selectAddress(addr.id)}
                      className={`p-3.5 rounded-lg border text-xs transition cursor-pointer flex flex-col space-y-1.5 ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={isCurrent}
                            onChange={() => selectAddress(addr.id)}
                            className="text-amber-500 focus:ring-amber-400 cursor-pointer"
                          />
                          <span className="font-bold text-gray-900">{addr.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {addr.isDefault && (
                            <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                              Default
                            </span>
                          )}
                          {isCurrent && (
                            <span className="bg-amber-500 text-gray-900 font-bold px-2 py-0.5 rounded text-[10px]">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 pl-5">
                        {addr.street} {addr.apartment && `, ${addr.apartment}`}
                      </p>
                      <p className="text-gray-600 pl-5">
                        {addr.city}, {addr.state} - <span className="font-semibold text-gray-900">{addr.postalCode}</span>
                      </p>
                      <p className="text-gray-500 pl-5 text-[11px]">
                        Phone: {addr.phone}
                      </p>

                      <div className="pl-5 pt-1.5 flex items-center space-x-3 text-[11px]">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDefaultAddress(addr.id);
                            }}
                            className="text-amber-700 hover:underline font-semibold cursor-pointer"
                          >
                            Set as default
                          </button>
                        )}
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr.id);
                            }}
                            className="text-red-600 hover:underline font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fullName: user?.name || '',
                    phone: '',
                    street: '',
                    apartment: '',
                    city: '',
                    state: 'Maharashtra',
                    postalCode: '',
                    country: 'India',
                    isDefault: false,
                  });
                  setIsAddingNew(true);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 px-4 rounded-lg text-xs transition border border-gray-300 flex items-center justify-center space-x-2 cursor-pointer mt-3"
              >
                <span>➕</span>
                <span>Add a new delivery address</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase tracking-wide">
                  Add New Delivery Address
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  ← Back to saved
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Khusboo Agarwal"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">
                    Flat, House no., Building, Company, Apartment *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleFetchCurrentLocation(false)}
                    disabled={isLocating}
                    className="text-[11px] text-amber-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>📍</span>
                    <span>{isLocating ? 'Locating...' : 'Auto-fill GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. 402 Galaxy Heights, MG Road"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Area, Street, Sector, Village (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="e.g. Indiranagar"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* PIN Code with live Auto-Fill indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-gray-700">
                      PIN Code *
                    </label>
                    {isPincodeLoading && (
                      <span className="text-[10px] text-amber-600 font-bold animate-pulse">
                        Searching...
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="postalCode"
                      required
                      maxLength={6}
                      placeholder="e.g. 560001"
                      value={formData.postalCode}
                      onChange={handlePostalCodeChange}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    {formData.postalCode.length === 6 && !isPincodeLoading && (
                      <span className="absolute right-2.5 top-2 text-xs text-emerald-600 font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Town/City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Auto-filled from PIN"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      pincodeFeedback ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white ${
                      pincodeFeedback ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-300'
                    }`}
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PIN Code Auto-Fill Feedback Badge */}
              {pincodeFeedback && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] font-semibold flex items-center space-x-1.5 animate-in fade-in">
                  <span>⚡</span>
                  <span>{pincodeFeedback}</span>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-xs text-gray-700">Make this my default delivery address</span>
                </label>
              </div>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-amazon-amber hover:bg-yellow-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  Save &amp; Use Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-amazon-amber hover:bg-yellow-400 text-gray-900 font-bold py-2 px-5 rounded-full text-xs transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
