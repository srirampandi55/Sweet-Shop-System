export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'STAFF';
  createdAt?: string;
  updatedAt?: string;
}

export interface Sweet {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sweet: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
