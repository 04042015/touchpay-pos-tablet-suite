import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Product, Category, Table, Order, Payment, Transaction, AppSettings, DashboardStats } from '@/types';
import { sampleCategories, sampleProducts, sampleTables, sampleUsers } from '@/lib/sampleData';

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  
  // Core Data
  products: Product[];
  categories: Category[];
  tables: Table[];
  orders: Order[];
  payments: Payment[];
  transactions: Transaction[];
  
  // Settings
  settings: AppSettings;
  
  // UI State
  isLoading: boolean;
  selectedTable: Table | null;
  currentOrder: Order | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  
  | { type: 'ADD_TABLE'; payload: Table }
  | { type: 'UPDATE_TABLE'; payload: Table }
  | { type: 'DELETE_TABLE'; payload: string }
  | { type: 'SET_TABLES'; payload: Table[] }
  | { type: 'SELECT_TABLE'; payload: Table | null }
  
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

const initialSettings: AppSettings = {
  restaurantName: 'TouchPay Restaurant',
  taxRate: 10,
  defaultDiscount: 0,
  openTime: '08:00',
  closeTime: '22:00',
  paymentMethods: ['tunai', 'transfer', 'e-wallet'],
};

const initialState: AppState = {
  currentUser: null,
  users: [],
  products: [],
  categories: [],
  tables: [],
  orders: [],
  payments: [],
  transactions: [],
  settings: initialSettings,
  isLoading: false,
  selectedTable: null,
  currentOrder: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        )
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_TABLE':
      return { ...state, tables: [...state.tables, action.payload] };
    
    case 'UPDATE_TABLE':
      return {
        ...state,
        tables: state.tables.map(table => 
          table.id === action.payload.id ? action.payload : table
        )
      };
    
    case 'DELETE_TABLE':
      return {
        ...state,
        tables: state.tables.filter(table => table.id !== action.payload)
      };
    
    case 'SET_TABLES':
      return { ...state, tables: action.payload };
    
    case 'SELECT_TABLE':
      return { ...state, selectedTable: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        )
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment => 
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Helper functions
  getDashboardStats: () => DashboardStats;
  generateOrderNumber: () => string;
  generateReceiptNumber: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load sample data on first load
  useEffect(() => {
    const hasLoadedData = localStorage.getItem('touchpay-sample-data-loaded');
    
    if (!hasLoadedData) {
      // Load sample data
      dispatch({ type: 'SET_CATEGORIES', payload: sampleCategories });
      dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
      dispatch({ type: 'SET_TABLES', payload: sampleTables });
      dispatch({ type: 'SET_USERS', payload: sampleUsers });
      
      // Mark as loaded
      localStorage.setItem('touchpay-sample-data-loaded', 'true');
    }
  }, []);
  
  const getDashboardStats = (): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = state.transactions.filter(
      t => new Date(t.createdAt) >= today
    ).length;
    
    const todayRevenue = state.transactions
      .filter(t => new Date(t.createdAt) >= today)
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    const activeOrders = state.orders.filter(
      o => ['baru', 'dimasak', 'siap', 'diantar'].includes(o.status)
    ).length;
    
    return {
      todayTransactions,
      todayRevenue,
      activeOrders,
      totalTables: state.tables.length,
    };
  };
  
  const generateOrderNumber = (): string => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                   (now.getMonth() + 1).toString().padStart(2, '0') + 
                   now.getDate().toString().padStart(2, '0');
    const orderCount = state.orders.filter(o => 
      o.orderNumber.includes(dateStr)
    ).length + 1;
    return `TP-${dateStr}-${orderCount.toString().padStart(4, '0')}`;
  };
  
  const generateReceiptNumber = (): string => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                   (now.getMonth() + 1).toString().padStart(2, '0') + 
                   now.getDate().toString().padStart(2, '0');
    const receiptCount = state.transactions.filter(t => 
      t.receiptNumber.includes(dateStr)
    ).length + 1;
    return `RCP-${dateStr}-${receiptCount.toString().padStart(4, '0')}`;
  };
  
  const value: AppContextType = {
    state,
    dispatch,
    getDashboardStats,
    generateOrderNumber,
    generateReceiptNumber,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}