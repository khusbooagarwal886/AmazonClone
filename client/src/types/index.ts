// Shared TypeScript interfaces and types for the frontend

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  ratingAvg?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
  products: Product[];
  message?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingAddress {
  fullName?: string;
  phone?: string;
  street?: string;
  apartment?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  paymentResult?: {
    id?: string;
    status?: string;
    email_address?: string;
  };
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | string;
  product: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  reviews: Review[];
  message?: string;
}


