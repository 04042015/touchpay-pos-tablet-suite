// TouchPay POS Types

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'kasir' | 'waiter';
  isActive: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Table {
  id: string;
  number: string;
  area: string;
  status: 'kosong' | 'dipesan' | 'makan' | 'selesai';
  capacity: number;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  items: OrderItem[];
  status: 'baru' | 'dimasak' | 'siap' | 'diantar' | 'selesai';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'tunai' | 'transfer' | 'e-wallet';
  amount: number;
  received: number;
  change: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  orderId: string;
  paymentId: string;
  receiptNumber: string;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  createdAt: Date;
}

export interface AppSettings {
  restaurantName: string;
  logoUrl?: string;
  taxRate: number;
  defaultDiscount: number;
  openTime: string;
  closeTime: string;
  paymentMethods: string[];
  printerSettings?: {
    enabled: boolean;
    printerName?: string;
  };
}

export interface DashboardStats {
  todayTransactions: number;
  todayRevenue: number;
  activeOrders: number;
  totalTables: number;
}