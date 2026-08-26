import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DummyPage } from './pages/DummyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';

function Navigation() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-amazon-header text-white px-3 sm:px-4 py-2.5 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Amazon Logo */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amazon-amber transition flex items-center shrink-0"
        >
          amazon<span className="text-amazon-amber">.clone</span>
        </Link>

        {/* Global Header Search Bar - Drops to full-width row on mobile (< sm) */}
        <form
          onSubmit={handleNavSearchSubmit}
          className="order-3 sm:order-none w-full sm:w-auto flex-1 sm:max-w-md md:max-w-lg lg:max-w-xl flex"
        >
          <input
            type="text"
            placeholder="Search Amazon Clone..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-white text-gray-900 rounded-l text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            aria-label="Search"
            className="bg-amazon-amber hover:bg-yellow-400 text-gray-900 px-3 sm:px-4 py-1.5 rounded-r text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center shrink-0"
          >
            🔍
          </button>
        </form>

        {/* Nav links & Auth */}
        <nav className="flex items-center space-x-3 sm:space-x-5 text-xs sm:text-sm font-medium shrink-0">
          <Link to="/" className="hover:text-amazon-amber transition hidden xs:inline">
            Home
          </Link>

          {/* Cart Navigation Link with Badge */}
          <Link
            to="/cart"
            className="flex items-center space-x-1 hover:text-amazon-amber transition relative py-1 px-1.5 rounded"
          >
            <span className="text-lg sm:text-xl">🛒</span>
            <span className="font-bold hidden xs:inline">Cart</span>
            <span className="bg-amazon-amber text-gray-900 text-xs font-extrabold rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
              {totalItems}
            </span>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/profile"
                className="text-amazon-amber hover:underline font-semibold max-w-[120px] sm:max-w-none truncate"
              >
                Hello, {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-amazon-amber transition">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-amazon-amber text-gray-900 px-2.5 sm:px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-400 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-amazon-bg text-amazon-text flex flex-col">
        {/* Navigation Header with Auth Controls */}
        <Navigation />

        {/* Main Content Area protected by ErrorBoundary */}
        <main className="max-w-6xl mx-auto w-full p-3 sm:p-6 flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dummy" element={<DummyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes (Requires active JWT) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
