import { Category, Product, Table, User } from '@/types';

export const sampleCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Makanan Utama',
    description: 'Hidangan utama seperti nasi, mie, dan lauk',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-2',
    name: 'Minuman',
    description: 'Minuman segar, kopi, teh, dan jus',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-3',
    name: 'Makanan Ringan',
    description: 'Camilan dan makanan pembuka',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-4',
    name: 'Dessert',
    description: 'Pencuci mulut dan makanan manis',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Nasi Gudeg Yogya',
    description: 'Nasi gudeg khas Yogyakarta dengan ayam, telur, dan sambal krecek',
    price: 25000,
    categoryId: 'cat-1',
    stock: 50,
    unit: 'porsi',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-2',
    name: 'Mie Ayam Bakso',
    description: 'Mie ayam dengan bakso, pangsit, dan sayuran segar',
    price: 18000,
    categoryId: 'cat-1',
    stock: 40,
    unit: 'mangkuk',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-3',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, udang, dan kerupuk',
    price: 22000,
    categoryId: 'cat-1',
    stock: 30,
    unit: 'porsi',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-4',
    name: 'Ayam Bakar Madu',
    description: 'Ayam bakar dengan bumbu madu dan nasi putih',
    price: 28000,
    categoryId: 'cat-1',
    stock: 25,
    unit: 'porsi',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-5',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin yang menyegarkan',
    price: 5000,
    categoryId: 'cat-2',
    stock: 100,
    unit: 'gelas',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-6',
    name: 'Jus Alpukat',
    description: 'Jus alpukat segar dengan susu kental manis',
    price: 12000,
    categoryId: 'cat-2',
    stock: 20,
    unit: 'gelas',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-7',
    name: 'Kopi Tubruk',
    description: 'Kopi hitam tradisional Indonesia',
    price: 8000,
    categoryId: 'cat-2',
    stock: 50,
    unit: 'cangkir',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-8',
    name: 'Keripik Tempe',
    description: 'Keripik tempe renyah dengan bumbu balado',
    price: 10000,
    categoryId: 'cat-3',
    stock: 15,
    unit: 'bungkus',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-9',
    name: 'Lumpia Semarang',
    description: 'Lumpia khas Semarang dengan isian rebung dan telur',
    price: 15000,
    categoryId: 'cat-3',
    stock: 20,
    unit: 'porsi',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prod-10',
    name: 'Es Krim Vanila',
    description: 'Es krim vanila dengan topping cokelat',
    price: 8000,
    categoryId: 'cat-4',
    stock: 30,
    unit: 'cup',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const sampleTables: Table[] = [
  { id: 'table-1', number: '01', area: 'VIP', capacity: 4, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-2', number: '02', area: 'VIP', capacity: 6, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-3', number: '03', area: 'VIP', capacity: 8, status: 'dipesan', createdAt: new Date('2024-01-01') },
  { id: 'table-4', number: '04', area: 'Regular', capacity: 4, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-5', number: '05', area: 'Regular', capacity: 4, status: 'makan', createdAt: new Date('2024-01-01') },
  { id: 'table-6', number: '06', area: 'Regular', capacity: 4, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-7', number: '07', area: 'Regular', capacity: 6, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-8', number: '08', area: 'Regular', capacity: 4, status: 'selesai', createdAt: new Date('2024-01-01') },
  { id: 'table-9', number: '09', area: 'Outdoor', capacity: 4, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-10', number: '10', area: 'Outdoor', capacity: 6, status: 'kosong', createdAt: new Date('2024-01-01') },
  { id: 'table-11', number: '11', area: 'Outdoor', capacity: 8, status: 'dipesan', createdAt: new Date('2024-01-01') },
  { id: 'table-12', number: '12', area: 'Outdoor', capacity: 4, status: 'kosong', createdAt: new Date('2024-01-01') }
];

export const sampleUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@touchpay.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    username: 'kasir1',
    email: 'kasir1@touchpay.com',
    role: 'kasir',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user-3',
    username: 'waiter1',
    email: 'waiter1@touchpay.com',
    role: 'waiter',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];