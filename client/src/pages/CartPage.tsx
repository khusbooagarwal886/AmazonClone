import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAddressStore } from '../store/useAddressStore';
import { AddressModal } from '../components/AddressModal';
import { apiPost } from '../lib/api';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { getSelectedAddress } = useAddressStore();
  const selectedAddress = getSelectedAddress();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      const payload = {
        items: items.map((item) => ({
          productId: item.product._id || item.product.id || '',
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress
          ? {
              address: `${selectedAddress.street}${
                selectedAddress.apartment ? `, ${selectedAddress.apartment}` : ''
              }`,
              city: selectedAddress.city,
              postalCode: selectedAddress.postalCode,
              country: selectedAddress.country || 'India',
            }
          : undefined,
      };

      const response = await apiPost<{ url: string; sessionId: string }>(
        '/api/orders/checkout-session',
        payload
      );

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to start checkout. Please try again.';
      setCheckoutError(message);
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-4">
          <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-4xl text-amber-600">
            🛒
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Amazon Cart is empty</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your shopping cart is waiting. Give it purpose — explore our latest electronics, books, apparel, and more!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-full text-sm transition shadow-sm"
            >
              Continue Shopping
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-full text-sm transition border border-gray-300"
              >
                Sign in to your account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <span className="text-xs text-gray-500 hidden sm:inline">Price</span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-200">
              {items.map(({ product, quantity }) => {
                const productId = product._id || product.id || '';
                const maxStock = product.stock > 0 ? Math.min(product.stock, 10) : 1;
                const imageUrl =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://placehold.co/300x300?text=No+Image';

                return (
                  <div key={productId} className="py-4 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/products/${productId}`}
                      className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded border border-gray-100 overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/products/${productId}`}
                            className="font-medium text-gray-900 text-sm sm:text-base hover:text-amber-600 line-clamp-2 transition"
                          >
                            {product.name}
                          </Link>
                          <span className="font-bold text-gray-900 text-base sm:hidden shrink-0">
                            ₹{(product.price * quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* In Stock status */}
                        <p
                          className={`text-xs font-semibold mt-1 ${
                            product.stock > 0 ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {product.stock > 0 ? 'In Stock' : 'Currently Out of Stock'}
                        </p>

                        <p className="text-xs text-gray-500 capitalize">
                          Category: {product.category}
                        </p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center space-x-3 text-xs pt-1">
                        <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-300 rounded px-2 py-1">
                          <label htmlFor={`qty-${productId}`} className="text-gray-600 font-medium">
                            Qty:
                          </label>
                          <select
                            id={`qty-${productId}`}
                            value={quantity}
                            onChange={(e) => updateQuantity(productId, Number(e.target.value))}
                            className="bg-transparent font-semibold text-gray-900 focus:outline-none cursor-pointer"
                          >
                            {Array.from({ length: maxStock }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <span className="text-gray-300">|</span>

                        <button
                          onClick={() => removeItem(productId)}
                          className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal for desktop */}
                    <div className="hidden sm:block text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        ₹{(product.price * quantity).toFixed(2)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          (₹{product.price.toFixed(2)} each)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-gray-200 pt-4 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-red-600 hover:underline cursor-pointer transition"
              >
                Clear Cart
              </button>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-gray-700">
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):{' '}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4 lg:sticky lg:top-20">
            {/* Free delivery promo banner */}
            <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-3 flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Your order qualifies for <strong>FREE Standard Delivery</strong>.</span>
            </div>

            {/* Delivery Address Box */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1">
                  <span>📍</span> Delivery Location
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-amber-700 hover:text-amber-900 hover:underline font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>

              {selectedAddress ? (
                <div className="text-gray-700 leading-snug space-y-0.5">
                  <p className="font-bold text-gray-900">{selectedAddress.fullName}</p>
                  <p className="text-gray-600 truncate">
                    {selectedAddress.street}{selectedAddress.apartment ? `, ${selectedAddress.apartment}` : ''}
                  </p>
                  <p className="text-gray-600">
                    {selectedAddress.city}, {selectedAddress.state} - <span className="font-semibold text-gray-900">{selectedAddress.postalCode}</span>
                  </p>
                  <p className="text-gray-500 text-[11px]">Phone: {selectedAddress.phone}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-amber-700 font-semibold hover:underline cursor-pointer block py-1"
                >
                  + Add Delivery Address
                </button>
              )}
            </div>

            {/* Subtotal */}
            <div className="text-base text-gray-900 border-t border-gray-100 pt-3">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}): </span>
              <span className="text-2xl font-bold block mt-1">₹{totalPrice.toFixed(2)}</span>
            </div>

            {/* Gift checkbox mockup */}
            <div className="flex items-center space-x-2 text-xs text-gray-700">
              <input type="checkbox" id="gift" className="rounded border-gray-300 text-amber-500" />
              <label htmlFor="gift">This order contains a gift</label>
            </div>

            {/* Checkout Error Message */}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded leading-relaxed">
                {checkoutError}
              </div>
            )}

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={isCheckingOut}
              className={`w-full font-semibold py-2.5 px-4 rounded-full text-sm transition shadow-sm flex items-center justify-center space-x-2 ${
                isCheckingOut
                  ? 'bg-amber-200 text-gray-600 cursor-not-allowed'
                  : 'bg-amazon-amber hover:bg-yellow-400 text-gray-900 cursor-pointer'
              }`}
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Redirecting to Checkout...</span>
                </>
              ) : (
                <span>Proceed to Checkout</span>
              )}
            </button>

            {/* Secure transaction notice */}
            <div className="text-xs text-gray-500 text-center pt-1 flex items-center justify-center space-x-1">
              <span>🔒</span>
              <span>Secure checkout &amp; encrypted transaction</span>
            </div>
          </div>
        </div>
      </div>

      <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </>
  );
}
