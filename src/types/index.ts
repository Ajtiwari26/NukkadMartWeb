// User Types
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  addresses?: Address[];
  created_at: string;
}

export interface Address {
  id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

// Store Types
export interface Store {
  store_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  is_demo?: boolean;
  image_url?: string;
  rating?: number;
  delivery_time?: string;
}

// Product Types
export interface Product {
  product_id: string;
  store_id: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  tags?: string[];
  description?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  store_id: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order Types
export interface Order {
  order_id: string;
  user_id: string;
  store_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  delivery_address: Address;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  name: string;
  email?: string;
}

export interface QuickRegisterRequest {
  name: string;
  phone: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
