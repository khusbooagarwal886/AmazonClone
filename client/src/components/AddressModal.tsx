import { useState } from 'react';
import { useAddressStore } from '../store/useAddressStore';
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

  const addresses = getAddresses();
  const selectedAddress = getSelectedAddress();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setFormError('Please fill in all required fields (Name, Phone, Street, City, PIN Code).');
      return;
    }

    addAddress(formData);
    setIsAddingNew(false);
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      apartment: '',
      city: '',
      state: 'Karnataka',
      postalCode: '',
      country: 'India',
      isDefault: false,
    });
    setFormError(null);
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
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <p className="text-xs text-gray-600">
            Delivery options and delivery speeds may vary for different locations. Select a saved address or add a new one.
          </p>

          {!isAddingNew ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Saved Delivery Addresses
              </h3>

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
                onClick={() => setIsAddingNew(true)}
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

              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 font-medium text-xs">
                  {formError}
                </div>
              )}

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
                <label className="block font-semibold text-gray-700 mb-1">
                  Flat, House no., Building, Company, Apartment *
                </label>
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

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Town/City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    maxLength={6}
                    placeholder="6 digits [0-9]"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

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
