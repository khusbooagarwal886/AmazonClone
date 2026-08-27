import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import type { Product, ProductsResponse } from '../types';

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'computers', label: 'Computers & Accessories' },
  { id: 'home', label: 'Home & Kitchen' },
  { id: 'apparel', label: 'Clothing & Apparel' },
  { id: 'books', label: 'Books' },
  { id: 'sports', label: 'Sports & Outdoors' },
];

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query parameter states derived from URL
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local form inputs for controlled editing before submit
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  // Data fetching state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products function
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryString = searchParams.toString();
      const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
      const data = await apiGet<ProductsResponse>(endpoint);

      setProducts(data.products || []);
      setTotal(data.total ?? (data.products ? data.products.length : 0));
      setTotalPages(data.pages ?? 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch products from the server');
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Synchronize local price inputs if URL search params change externally
  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Synchronize search input only if currentSearch in URL was cleared or changed externally
  useEffect(() => {
    if (currentSearch !== searchInput && (currentSearch === '' || searchInput === '')) {
      setSearchInput(currentSearch);
    }
  }, [currentSearch]);

  // Debounce search input changes (300ms delay)
  useEffect(() => {
    if (searchInput.trim() === currentSearch) return;

    const debounceTimer = setTimeout(() => {
      updateFilter({ search: searchInput.trim() || null });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, currentSearch]);

  // Fetch products whenever searchParams change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Helper to update URL search params with functional state update
  const updateFilter = (updates: Record<string, string | null>, resetPage = true) => {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams);

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '') {
          nextParams.delete(key);
        } else {
          nextParams.set(key, val);
        }
      });

      if (resetPage) {
        nextParams.delete('page'); // Reset to page 1
      }

      return nextParams;
    });
  };


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput.trim() || null });
  };

  const handleCategorySelect = (categoryId: string) => {
    updateFilter({ category: categoryId || null });
  };

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const nextParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', newPage.toString());
    }
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Boolean(currentSearch || currentCategory || currentMinPrice || currentMaxPrice);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1 sm:mb-2">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Top electronics, computers, home essentials, apparel, and books with instant delivery.
          </p>
        </div>
        <div className="text-xs text-amber-400 bg-slate-800/90 px-2.5 py-1 rounded border border-amber-500/30 shrink-0">
          Fast &amp; Reliable Shipping
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-gray-200 shadow-sm space-y-3.5">
        {/* Top row: Search input & Price filters */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateFilter({ search: null });
                  }}
                  className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 py-2 rounded text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* Price Range Filter Form */}
          <form
            onSubmit={handlePriceFilterSubmit}
            className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm pt-1 md:pt-0"
          >
            <span className="text-gray-600 font-medium text-xs">Price:</span>
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <input
                type="number"
                placeholder="Min ₹"
                min="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-amber-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                min="0"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-xs font-semibold border border-gray-300 transition cursor-pointer shrink-0"
            >
              Go
            </button>
          </form>
        </div>

        {/* Bottom row: Category Pills & Reset button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-gray-500 shrink-0 mr-1">Category:</span>
            {CATEGORIES.map((cat) => {
              const isSelected = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer shrink-0 self-end sm:self-auto"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <ErrorMessage
          title="Failed to load catalog"
          message={error}
          onRetry={loadProducts}
        />
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md border border-gray-200 p-4 animate-pulse space-y-3"
            >
              <div className="aspect-square bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 pt-2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid & Results Header */}
      {!loading && !error && products.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm text-gray-600 border-b border-gray-200 pb-2">
            <span className="font-medium truncate">
              Showing {products.length} of {total} products
              {currentCategory && ` in "${CATEGORIES.find((c) => c.id === currentCategory)?.label || currentCategory}"`}
              {currentSearch && ` matching "${currentSearch}"`}
            </span>
            <span className="text-xs text-gray-500 shrink-0">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-gray-900 border border-amber-500 shadow-xs'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon="📦"
          title="No products found"
          description={
            hasActiveFilters
              ? 'No products match your search keyword or selected price and category filters.'
              : 'The product catalog is currently empty. Run the seed script to populate sample items.'
          }
          actionText={hasActiveFilters ? 'Clear All Filters' : undefined}
          onAction={hasActiveFilters ? handleClearAllFilters : undefined}
        />
      )}
    </div>
  );
}
