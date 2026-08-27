import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import type { Product, ProductsResponse } from '../types';

const CATEGORIES = [
  { id: '', label: 'All Departments' },
  { id: 'electronics', label: 'Electronics & Gadgets' },
  { id: 'computers', label: 'Computers & Accessories' },
  { id: 'home', label: 'Home & Kitchen' },
  { id: 'apparel', label: 'Clothing & Apparel' },
  { id: 'books', label: 'Books & Media' },
  { id: 'sports', label: 'Sports & Outdoors' },
];

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: '', max: '1000' },
  { label: '₹1,000 - ₹5,000', min: '1000', max: '5000' },
  { label: '₹5,000 - ₹20,000', min: '5000', max: '20000' },
  { label: '₹20,000 - ₹50,000', min: '20000', max: '50000' },
  { label: 'Over ₹50,000', min: '50000', max: '' },
];

const RATING_FILTERS = [
  { rating: '4', label: '4★ & Up', stars: '★★★★☆' },
  { rating: '3', label: '3★ & Up', stars: '★★★☆☆' },
  { rating: '2', label: '2★ & Up', stars: '★★☆☆☆' },
  { rating: '1', label: '1★ & Up', stars: '★☆☆☆☆' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Featured: Newest Arrivals' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Avg. Customer Review' },
  { id: 'popular', label: 'Most Popular / Reviewed' },
];

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query parameter states derived from URL
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local form inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data fetching state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products function with instant fallback
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryString = searchParams.toString();
      const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
      const data = await apiGet<ProductsResponse>(endpoint);

      if (data && data.products && data.products.length > 0) {
        setProducts(data.products);
        setTotal(data.total ?? data.products.length);
        setTotalPages(data.pages ?? 1);
        return;
      }
    } catch (err: unknown) {
      console.warn('Backend waking up or unreachable, using instant catalog fallback:', err);
    }

    // Resilient fallback: Use local mock catalog with full filter and sort matching
    try {
      let filtered = [...MOCK_PRODUCTS];

      if (currentCategory) {
        const cat = currentCategory.toLowerCase();
        filtered = filtered.filter((p) => {
          if (cat === 'apparel' || cat === 'clothing') {
            return p.category === 'apparel' || p.category === 'clothing';
          }
          return p.category.toLowerCase() === cat;
        });
      }

      if (currentMinPrice) {
        const min = Number(currentMinPrice);
        if (!isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
      }

      if (currentMaxPrice) {
        const max = Number(currentMaxPrice);
        if (!isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
      }

      if (currentMinRating) {
        const rating = Number(currentMinRating);
        if (!isNaN(rating)) filtered = filtered.filter((p) => (p.ratingAvg || 0) >= rating);
      }

      if (currentInStock) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }

      if (currentSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      else if (currentSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      else if (currentSort === 'rating') filtered.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      else if (currentSort === 'popular') filtered.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));

      const limit = 16;
      const skip = (currentPage - 1) * limit;
      const paginated = filtered.slice(skip, skip + limit);

      setProducts(paginated as Product[]);
      setTotal(filtered.length);
      setTotalPages(Math.ceil(filtered.length / limit) || 1);
      setError(null);
    } catch {
      setError('Unable to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentCategory, currentMinPrice, currentMaxPrice, currentMinRating, currentInStock, currentSearch, currentSort, currentPage]);

  // Synchronize local price inputs if URL search params change externally
  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Synchronize search input if URL search changes externally
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

  // Helper to update URL search params
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

  const handlePricePreset = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    updateFilter({
      minPrice: min || null,
      maxPrice: max || null,
    });
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
  };

  const handleRatingSelect = (rating: string) => {
    const nextRating = currentMinRating === rating ? null : rating;
    updateFilter({ minRating: nextRating });
  };

  const handleInStockToggle = () => {
    updateFilter({ inStock: currentInStock ? null : 'true' });
  };

  const handleSortChange = (sortId: string) => {
    updateFilter({ sort: sortId === 'newest' ? null : sortId });
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

  const hasActiveFilters = Boolean(
    currentSearch ||
    currentCategory ||
    currentMinPrice ||
    currentMaxPrice ||
    currentMinRating ||
    currentInStock ||
    (currentSort && currentSort !== 'newest')
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-lg p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
            Amazon Storefront
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Browse 80+ products with verified customer reviews, fast delivery, and Indian Rupee (₹) pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-amber-400 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/30 font-medium">
            ⚡ Prime Fast Delivery
          </div>
        </div>
      </div>

      {/* Main Content Layout with Amazon Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ==================== LEFT FILTER SIDEBAR ==================== */}
        <aside
          className={`lg:col-span-1 bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header & Clear Filters */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <span>⚡</span> Filters &amp; Refine
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs text-amber-700 hover:text-amber-900 hover:underline font-semibold cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* 1. Department / Categories */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Department
            </h3>
            <div className="space-y-1 text-xs">
              {CATEGORIES.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-bold border-l-3 border-amber-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Customer Reviews Filter */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Customer Reviews
            </h3>
            <div className="space-y-1.5">
              {RATING_FILTERS.map((r) => {
                const isSelected = currentMinRating === r.rating;
                return (
                  <button
                    key={r.rating}
                    type="button"
                    onClick={() => handleRatingSelect(r.rating)}
                    className={`w-full text-left py-1 px-2 rounded text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-bold border-l-3 border-amber-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 tracking-wider text-sm">{r.stars}</span>
                      <span className="text-gray-800">{r.label}</span>
                    </div>
                    {isSelected && <span className="text-amber-600 font-bold text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Price Filter (Presets & Custom) */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Price
            </h3>
            <div className="space-y-1 text-xs">
              {PRICE_RANGES.map((range, idx) => {
                const isSelected = currentMinPrice === range.min && currentMaxPrice === range.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePricePreset(range.min, range.max)}
                    className={`w-full text-left py-1 px-2 rounded flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-bold border-l-3 border-amber-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span>{range.label}</span>
                    {isSelected && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Custom Price Range Form */}
            <form onSubmit={handleCustomPriceSubmit} className="pt-2 space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="₹ Min"
                  min="0"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-amber-500 bg-white"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="₹ Max"
                  min="0"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded text-xs font-semibold border border-gray-300 transition cursor-pointer"
              >
                Apply Price Filter
              </button>
            </form>
          </div>

          {/* 4. Availability Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Availability
            </h3>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={handleInStockToggle}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
              />
              <span className={currentInStock ? 'font-bold text-gray-900' : ''}>
                In Stock Only
              </span>
            </label>
          </div>
        </aside>

        {/* ==================== RIGHT PRODUCT GRID & CONTROLS ==================== */}
        <main className="lg:col-span-3 space-y-4">
          {/* Top Control Bar: Search input, Sort By dropdown, and Mobile filter toggle */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search 80+ products by title, category, or brand..."
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
                  className="bg-amazon-amber hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Mobile Filter Toggle & Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>☰</span>
                  <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters'}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-500 font-medium hidden sm:inline">Sort by:</span>
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-800 py-2 px-2.5 rounded text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips / Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-medium mr-1">Active:</span>

                {currentCategory && (
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    {CATEGORIES.find((c) => c.id === currentCategory)?.label || currentCategory}
                    <button
                      type="button"
                      onClick={() => updateFilter({ category: null })}
                      className="hover:text-red-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {currentSearch && (
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    Search: "{currentSearch}"
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        updateFilter({ search: null });
                      }}
                      className="hover:text-red-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {(currentMinPrice || currentMaxPrice) && (
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    Price: {currentMinPrice ? `₹${currentMinPrice}` : '₹0'} - {currentMaxPrice ? `₹${currentMaxPrice}` : 'Any'}
                    <button
                      type="button"
                      onClick={() => {
                        setMinPriceInput('');
                        setMaxPriceInput('');
                        updateFilter({ minPrice: null, maxPrice: null });
                      }}
                      className="hover:text-red-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {currentMinRating && (
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    Rating: {currentMinRating}★ &amp; Up
                    <button
                      type="button"
                      onClick={() => updateFilter({ minRating: null })}
                      className="hover:text-red-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {currentInStock && (
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    In Stock Only
                    <button
                      type="button"
                      onClick={handleInStockToggle}
                      className="hover:text-red-700 cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold ml-auto cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Summary Bar */}
          {!loading && !error && (
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
                {currentCategory && ` in ${CATEGORIES.find((c) => c.id === currentCategory)?.label || currentCategory}`}
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorMessage
              title="Failed to load catalog"
              message={error}
              onRetry={loadProducts}
            />
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, idx) => (
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

          {/* Product Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No products match your filters"
              description="Try adjusting your department, price bracket, star rating, or search keywords."
              actionText="Reset All Filters"
              onAction={handleClearAllFilters}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-6">
              <button
                type="button"
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
                    type="button"
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
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
