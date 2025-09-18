export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SweetWithStock {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithItems {
  id: string;
  customerName: string;
  totalPrice: number;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    sweet: {
      id: string;
      name: string;
    };
  }[];
}
