import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

export default function Reports() {
  const { state } = useAppContext();
  const [reportType, setReportType] = useState<'sales' | 'products' | 'payment'>('sales');

  // Calculate sales data
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const salesData = last7Days.map(date => {
    const dayTransactions = state.transactions.filter(t => 
      t.createdAt.toString().split('T')[0] === date
    );
    return {
      date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
      total: dayTransactions.reduce((sum, t) => sum + t.total, 0),
      orders: dayTransactions.length,
    };
  });

  // Calculate product sales
  const productSales = state.products.map(product => {
    const sold = state.transactions.reduce((sum, t) => {
      const item = t.items.find(i => i.id === product.id);
      return sum + (item ? item.quantity : 0);
    }, 0);
    return {
      name: product.name,
      sold,
      revenue: sold * product.price,
    };
  }).sort((a, b) => b.sold - a.sold).slice(0, 10);

  // Calculate payment method distribution
  const paymentData = state.payments.reduce((acc, payment) => {
    const method = payment.method;
    if (!acc[method]) {
      acc[method] = { name: method, value: 0, count: 0 };
    }
    acc[method].value += payment.amount;
    acc[method].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const paymentChartData = Object.values(paymentData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Summary stats
  const totalRevenue = state.transactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = state.transactions.length;
  const totalCustomers = new Set(state.transactions.map(t => t.customerName).filter(Boolean)).size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Layout title="Laporan">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <p className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pesanan</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pelanggan Unik</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Order</p>
                  <p className="text-2xl font-bold">Rp {Math.round(averageOrderValue).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Type Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { value: 'sales', label: 'Penjualan' },
                  { value: 'products', label: 'Produk' },
                  { value: 'payment', label: 'Pembayaran' }
                ].map(type => (
                  <Button
                    key={type.value}
                    variant={reportType === type.value ? "default" : "outline"}
                    onClick={() => setReportType(type.value as any)}
                    size="sm"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        {reportType === 'sales' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Penjualan 7 Hari Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, 'Penjualan']} />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {reportType === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productSales.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{index + 1}</span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sold} terjual
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">Rp {product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total pendapatan</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, 'Total']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentChartData.map((method, index) => (
                    <div key={method.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium capitalize">{method.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rp {method.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{method.count} transaksi</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}