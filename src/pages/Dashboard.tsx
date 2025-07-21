import { Layout } from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Package,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state, getDashboardStats } = useAppContext();
  const stats = getDashboardStats();
  
  // Recent orders for quick view
  const recentOrders = state.orders
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baru': return 'bg-blue-100 text-blue-800';
      case 'dimasak': return 'bg-yellow-100 text-yellow-800';
      case 'siap': return 'bg-green-100 text-green-800';
      case 'diantar': return 'bg-purple-100 text-purple-800';
      case 'selesai': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Tambah Pesanan',
      description: 'Buat pesanan baru',
      icon: ShoppingCart,
      href: '/orders',
      color: 'bg-blue-500'
    },
    {
      title: 'Kelola Produk',
      description: 'Tambah/edit produk',
      icon: Package,
      href: '/products',
      color: 'bg-green-500'
    },
    {
      title: 'Lihat Laporan',
      description: 'Analisa penjualan',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-purple-500'
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Selamat Datang, {state.currentUser?.username || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Kelola restoran Anda dengan mudah menggunakan TouchPay POS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 tablet-lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transaksi Hari Ini
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Total transaksi yang selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendapatan Hari Ini
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                Rp {stats.todayRevenue.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendapatan kotor hari ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pesanan Aktif
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {stats.activeOrders}
              </div>
              <p className="text-xs text-muted-foreground">
                Pesanan yang sedang diproses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Meja
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTables}</div>
              <p className="text-xs text-muted-foreground">
                Meja yang tersedia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="h-auto p-4 justify-start"
                  >
                    <Link to={action.href} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pesanan Terbaru</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/orders">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada pesanan hari ini
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/orders">Buat Pesanan Pertama</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="font-medium text-sm">
                          {order.orderNumber.slice(-4)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          Meja {state.tables.find(t => t.id === order.tableId)?.number || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          Rp {order.totalAmount.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}