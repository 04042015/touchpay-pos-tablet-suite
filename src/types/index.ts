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

// Advanced Features Types
export interface CustomerProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  product_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_name?: string;
  is_primary: boolean;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  usage_limit?: number;
  used_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  role: 'admin' | 'kasir' | 'waiter' | 'all';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistCompletion {
  id: string;
  task_id: string;
  completed_by: string;
  completed_at: string;
  date: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface KitchenOrder {
  id: string;
  order_id: string;
  table_number?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimated_time: number;
  started_at?: string;
  completed_at?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Installment {
  id: string;
  order_id: string;
  customer_id?: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  installment_count: number;
  payment_schedule?: any;
  status: 'active' | 'completed' | 'defaulted';
  created_at: string;
  updated_at: string;
}

export interface InstallmentPayment {
  id: string;
  installment_id: string;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  paid_by: string;
  payment_date: string;
  notes?: string;
}

export interface CashLedger {
  id: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  category: string;
  reference_id?: string;
  handled_by: string;
  shift_id?: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  display_name: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  type: 'manual' | 'qris' | 'bank_transfer' | 'ewallet';
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentReference {
  id: string;
  order_id: string;
  payment_method_id: string;
  reference_code: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expired';
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: string;
  shift_name: string;
  opened_by: string;
  closed_by?: string;
  opening_balance: number;
  closing_balance?: number;
  total_sales: number;
  total_cash_in: number;
  total_cash_out: number;
  opened_at: string;
  closed_at?: string;
  status: 'open' | 'closed';
  notes?: string;
}

export interface RestaurantSettings {
  id: string;
  setting_key: string;
  setting_value: string;
  data_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_by: string;
  updated_at: string;
}

// Enhanced Order interface with advanced features
export interface OrderWithExtras extends Order {
  order_notes?: OrderNote[];
  customer?: CustomerProfile;
  promo_code?: PromoCode;
  kitchen_order?: KitchenOrder;
  installment?: Installment;
}

// Enhanced Payment interface
export interface PaymentWithDetails extends Payment {
  split_payments?: {
    method_id: string;
    amount: number;
    reference?: string;
  }[];
  payment_references?: PaymentReference[];
}