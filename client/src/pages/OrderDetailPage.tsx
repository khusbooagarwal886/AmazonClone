import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPut } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Order } from '../types';

interface OrderResponse {
  success: boolean;
  order: Order;
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<OrderResponse>(`/api/orders/${id}`);
      if (data && data.order) {
        setOrder(data.order);
      } else {
        setError('Order data is missing');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load order details';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!id || !order) return;
    try {
      setUpdatingStatus(true);
      setStatusMessage(null);
      setStatusError(null);

      const response = await apiPut<{ success: boolean; message: string; order: Order }>(
        `/api/orders/${id}/status`,
        { status: newStatus }
      );

      if (response && response.order) {
        setOrder(response.order);
        setStatusMessage(`Order status updated to ${newStatus}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      setStatusError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading order details..." fullPage />;
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto my-10 space-y-4">
        <ErrorMessage
          title="Unable to Load Order"
          message={error || 'The requested order could not be found.'}
          onRetry={fetchOrder}
        />
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-block bg-amazon-amber hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-sm text-xs transition"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Cancelled
          </span>
        );
      case 'processing':
      default:
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Processing
          </span>
        );
    }
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paidDate = order.paidAt
    ? new Date(order.paidAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-gray-600">
          <Link to="/" className="hover:text-amazon-amber hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link to="/profile" className="hover:text-amazon-amber hover:underline">
            Your Account
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            Order #{order._id}
          </span>
        </div>

        <Link
          to="/"
          className="text-xs sm:text-sm font-medium text-blue-600 hover:underline flex items-center space-x-1 self-start sm:self-auto"
        >
          <span>← Continue Shopping</span>
        </Link>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-xs text-gray-500 mt-1">
              Order ID: <span className="font-mono text-gray-700 select-all">{order._id}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="text-xs sm:text-sm text-gray-500">Status:</span>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-500 block text-xs font-semibold uppercase">Order Date</span>
            <span className="text-gray-800 font-medium">{orderDate}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs font-semibold uppercase">Total Amount</span>
            <span className="text-gray-900 font-bold text-base">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs font-semibold uppercase">Payment Status</span>
            {order.isPaid ? (
              <span className="text-green-700 font-semibold flex items-center space-x-1">
                <span>✓ Paid</span>
                {paidDate && <span className="text-xs text-gray-500 font-normal">({paidDate})</span>}
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Pending Payment</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid: Items and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Items list and Shipping details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                Items in this Order ({order.orderItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item, index) => {
                const productId =
                  typeof item.product === 'object' && item.product !== null && '_id' in item.product
                    ? (item.product as { _id: string })._id
                    : (item.product as string);

                return (
                  <div key={index} className="p-3.5 sm:p-6 flex items-center space-x-3 sm:space-x-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-2xl text-gray-400">📦</span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      {productId ? (
                        <Link
                          to={`/products/${productId}`}
                          className="text-base font-semibold text-gray-900 hover:text-amazon-amber line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Unit Price: <span className="font-medium text-gray-700">${item.price.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                      </p>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right">
                      <span className="text-base font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 border-b border-gray-100 pb-2">
                <span>📍</span>
                <span>Shipping Information</span>
              </h3>
              {order.shippingAddress && order.shippingAddress.address ? (
                <div className="text-xs text-gray-700 space-y-1">
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Standard delivery to address on file.
                </p>
              )}
            </div>

            {/* Payment Method / Verification Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 border-b border-gray-100 pb-2">
                <span>💳</span>
                <span>Payment Details</span>
              </h3>
              <div className="text-xs text-gray-700 space-y-1">
                <p>
                  <span className="text-gray-500">Method: </span>
                  <span className="font-semibold">Credit / Debit Card (Stripe)</span>
                </p>
                {order.paymentResult?.id && (
                  <p className="truncate">
                    <span className="text-gray-500">Stripe Ref: </span>
                    <span className="font-mono text-gray-600">{order.paymentResult.id}</span>
                  </p>
                )}
                {order.paymentResult?.email_address && (
                  <p>
                    <span className="text-gray-500">Receipt Email: </span>
                    <span>{order.paymentResult.email_address}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Financial Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-gray-900 font-medium">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling:</span>
                <span className="text-green-700 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax:</span>
                <span className="text-gray-900 font-medium">$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-amazon-amber text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="w-full block text-center bg-amazon-amber hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded shadow-sm text-sm transition cursor-pointer"
              >
                Buy Again / Browse More
              </Link>
            </div>
          </div>

          {/* Admin Management Section (Visible only to Admin role) */}
          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg border border-purple-200 p-6 shadow-sm mt-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-purple-100 pb-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Admin Controls</h3>
                  <p className="text-xs text-purple-700 font-medium">Order Management & Fulfillment</p>
                </div>
              </div>

              {statusMessage && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium">
                  ✓ {statusMessage}
                </div>
              )}

              {statusError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-medium">
                  ⚠️ {statusError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase">
                  Update Order Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus || order.status === st}
                      onClick={() => handleStatusChange(st)}
                      className={`text-xs font-bold py-2 px-3 rounded capitalize transition cursor-pointer border ${
                        order.status === st
                          ? 'bg-purple-600 text-white border-purple-600 shadow-inner'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                      } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
