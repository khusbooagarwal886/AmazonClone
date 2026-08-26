import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://placehold.co/400x400?text=No+Image';

  return (
    <div className="bg-white rounded-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col p-4">
      {/* Product Image */}
      <Link
        to={`/products/${product._id || product.id}`}
        className="block aspect-square w-full mb-3 overflow-hidden rounded bg-gray-100 flex items-center justify-center"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </Link>

      {/* Category badge */}
      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
        {product.category}
      </span>

      {/* Title */}
      <Link
        to={`/products/${product._id || product.id}`}
        className="font-medium text-sm text-gray-900 line-clamp-2 hover:text-amber-600 transition mb-1"
        title={product.name}
      >
        {product.name}
      </Link>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-1.5 mb-2 text-xs">
        <span className="text-amber-500 font-bold">★ {(product.ratingAvg || 0).toFixed(1)}</span>
        <span className="text-gray-400">({product.numReviews || 0})</span>
      </div>

      {/* Price & Stock */}
      <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500 align-top">$</span>
          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)}</span>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            product.stock > 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
}
