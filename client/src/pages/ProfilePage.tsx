import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import type { User, Order } from '../types';

interface MeResponse {
  success: boolean;
  user: User;
}

interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

export function ProfilePage() {
  const { clearAuth } = useAuthStore();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setProfileError(null);
      const data = await apiGet<MeResponse>('/api/auth/me');
      setProfileData(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setProfileError(err.message);
      } else {
        setProfileError('Failed to fetch user profile');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const ordersData = await apiGet<OrdersResponse>('/api/orders/myorders');
      if (ordersData && ordersData.orders) {
        setOrders(ordersData.orders);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order history';
      setOrdersError(message);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, [fetchProfile, fetchOrders]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-8 space-y-5 sm:space-y-6 text-gray-900">
      {/* Account Header */}
      <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Your Account</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage your profile and track recent purchases</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-medium py-1.5 px-4 rounded transition cursor-pointer border border-gray-300 self-start sm:self-auto"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Error State */}
      {profileError && (
        <ErrorMessage
          title="Could not load profile details"
          message={profileError}
          onRetry={fetchProfile}
        />
      )}

      {/* Profile Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Details */}
      {!loading && profileData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm text-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block">Name</span>
            <span className="text-sm sm:text-base font-medium">{profileData.name}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block">Email</span>
            <span className="text-sm sm:text-base font-medium break-all">{profileData.email}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block">Role</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold capitalize mt-0.5">
              {profileData.role || 'user'}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block">Account ID</span>
            <span className="text-xs font-mono text-gray-600 block mt-0.5 truncate">{profileData.id}</span>
          </div>
        </div>
      )}

      {/* Your Orders Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Orders ({orders.length})</h2>
        </div>

        {ordersError && (
          <div className="p-4 sm:p-5">
            <ErrorMessage
              title="Could not load order history"
              message={ordersError}
              onRetry={fetchOrders}
            />
          </div>
        )}

        {ordersLoading ? (
          <div className="divide-y divide-gray-100 p-4 sm:p-5 space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : !ordersError && orders.length === 0 ? (
          <div className="p-6 sm:p-8">
            <EmptyState
              icon="🛍️"
              title="No orders yet"
              description="You haven't placed any orders yet. Explore our catalog to find exciting products!"
              actionText="Start Shopping"
              actionHref="/"
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-4 sm:p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      Order #{ord._id.slice(-8)}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded capitalize">
                      {ord.status}
                    </span>
                    {ord.isPaid && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                        Paid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} &bull;{' '}
                    {ord.orderItems.length} {ord.orderItems.length === 1 ? 'item' : 'items'} &bull; Total: $
                    {ord.totalPrice.toFixed(2)}
                  </p>
                </div>

                <Link
                  to={`/orders/${ord._id}`}
                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 text-xs font-semibold px-4 py-2 rounded transition whitespace-nowrap self-start sm:self-auto"
                >
                  View Order Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
