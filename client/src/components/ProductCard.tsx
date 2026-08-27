import { Link } from 'react-router-dom';
import { formatPrice, formatRating } from '../lib/format';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

  const productId = product._id || (product as any).id || '';
  const priceDisplay = formatPrice(product.price);
  const ratingDisplay = formatRating(product.ratingAvg);
  const reviewsCount = product.numReviews ?? 0;
  const isAvailable = (product.stock ?? 0) > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col p-3.5 sm:p-4 group">
      {/* Product Image */}
      <Link
        to={`/products/${productId}`}
        className="block aspect-square w-full mb-3 overflow-hidden rounded bg-gray-50 flex items-center justify-center relative"
      >
        <img
          src={imageUrl}
          alt={product.name || 'Product'}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!isAvailable && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Category badge */}
      <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
        {product.category || 'General'}
      </span>

      {/* Title */}
      <Link
        to={`/products/${productId}`}
        className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-amber-600 transition mb-1 leading-snug"
        title={product.name}
      >
        {product.name || 'Untitled Product'}
      </Link>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-1.5 mb-2 text-xs">
        <span className="text-amber-500 font-bold">★ {ratingDisplay}</span>
        <span className="text-gray-400">({reviewsCount})</span>
      </div>

      {/* Price & Stock */}
      <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-gray-100">
        <div>
          <span className="text-base sm:text-lg font-extrabold text-gray-900">
            {priceDisplay}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {isAvailable ? 'In Stock' : 'Unavailable'}
        </span>
      </div>
    </div>
  );
}
