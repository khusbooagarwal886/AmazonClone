import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ReviewsSection } from '../components/ReviewsSection';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Product } from '../types';

interface ProductDetailResponse {
  success: boolean;
  product: Product;
  message?: string;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);
  const [buyNowError, setBuyNowError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<ProductDetailResponse>(`/api/products/${id}`);
      if (data.product) {
        setProduct(data.product);
        if (data.product.images && data.product.images.length > 0) {
          setSelectedImage(data.product.images[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch product details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedMessage(`Added ${quantity} item(s) to cart!`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsBuyingNow(true);
      setBuyNowError(null);

      const payload = {
        items: [
          {
            productId: product._id || product.id || '',
            quantity: quantity,
          },
        ],
      };

      const response = await apiPost<{ url: string; sessionId: string }>(
        '/api/orders/checkout-session',
        payload
      );

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to start checkout. Please try again.';
      setBuyNowError(message);
      setIsBuyingNow(false);
    }
  };


  return (
    <div className="space-y-4">
      {/* Back breadcrumb */}
      <nav className="text-xs text-gray-500 flex flex-wrap items-center gap-1.5">
        <Link to="/" className="hover:text-amber-600 hover:underline">
          &larr; Back to all products
        </Link>
        {product && (
          <>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
          </>
        )}
      </nav>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="space-y-4">
          <ErrorMessage
            title="Product Not Found"
            message={error}
            onRetry={loadProduct}
          />
          <div className="text-center pt-2">
            <Link
              to="/"
              className="inline-block bg-amazon-amber hover:bg-yellow-400 text-gray-900 text-xs font-semibold py-2 px-6 rounded-full transition shadow-sm"
            >
              Return to Store
            </Link>
          </div>
        </div>
      )}

      {/* Product Detail Content */}
      {product && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={selectedImage || product.images?.[0] || 'https://placehold.co/600x600?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails if multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded border-2 overflow-hidden flex-shrink-0 cursor-pointer ${
                        selectedImage === imgUrl ? 'border-amber-500' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Middle Column: Product Details */}
            <div className="lg:col-span-4 space-y-4">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                {product.category}
              </span>

              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {/* Star Ratings */}
              <div className="flex items-center space-x-2 border-b pb-3">
                <div className="flex items-center text-amber-500 text-sm font-bold">
                  ★ {(product.ratingAvg || 0).toFixed(1)}
                </div>
                <span className="text-xs text-gray-500">
                  ({(product.numReviews || 0).toLocaleString()} customer ratings)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-gray-500 align-top">Price:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">About this item</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Right Column: Buy Box */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4 bg-gray-50 shadow-sm lg:sticky lg:top-20">
                <div className="text-2xl font-bold text-gray-900">
                  ${(product.price * quantity).toFixed(2)}
                </div>

                {/* Stock status */}
                <div>
                  {product.stock > 0 ? (
                    <span className="text-sm font-semibold text-emerald-700 block">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-red-700 block">
                      Currently Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                {product.stock > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="text-gray-700 font-medium">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2.5 py-1 text-sm bg-white focus:outline-none focus:border-amber-500"
                    >
                      {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2 px-4 rounded-full text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0 || isBuyingNow}
                    className={`w-full font-semibold py-2 px-4 rounded-full text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2 ${
                      isBuyingNow
                        ? 'bg-amber-300 text-gray-700 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-gray-900 cursor-pointer'
                    }`}
                  >
                    {isBuyingNow ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Redirecting to Stripe...</span>
                      </>
                    ) : (
                      <span>Buy Now</span>
                    )}
                  </button>
                </div>

                {/* Buy Now error notification */}
                {buyNowError && (
                  <div className="p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs rounded text-center font-medium">
                    {buyNowError}
                  </div>
                )}

                {/* Added to cart notification */}
                {addedMessage && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs rounded text-center font-medium animate-fade-in">
                    ✓ {addedMessage}
                  </div>
                )}


                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 space-y-1">
                  <p>Ships from: <span className="font-medium text-gray-700">Amazon Clone Warehouse</span></p>
                  <p>Sold by: <span className="font-medium text-gray-700">Amazon Clone Direct</span></p>
                  <p>Returns: <span className="font-medium text-gray-700">30-day refund / replacement</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      {product && !loading && (
        <ReviewsSection
          productId={product._id || product.id || ''}
          ratingAvg={product.ratingAvg}
          numReviews={product.numReviews}
          onReviewAdded={loadProduct}
        />
      )}
    </div>
  );
}
