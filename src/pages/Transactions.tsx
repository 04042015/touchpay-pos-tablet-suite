import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Search, Download, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function Transactions() {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  const filterTransactions = () => {
    let filtered = state.transactions;

    // Date filter
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(t => new Date(t.createdAt) >= startOfToday);
        break;
      case 'week':
        filtered = filtered.filter(t => new Date(t.createdAt) >= startOfWeek);
        break;
      case 'month':
        filtered = filtered.filter(t => new Date(t.createdAt) >= startOfMonth);
        break;
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredTransactions = filterTransactions();

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <Layout title="Riwayat Transaksi">
      <div className="space-y-6">
        {/* Stats Cards */}
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
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Order</p>
                  <p className="text-2xl font-bold">Rp {Math.round(averageOrderValue).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Periode</p>
                  <p className="text-2xl font-bold">
                    {dateFilter === 'today' ? 'Hari Ini' : 
                     dateFilter === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor pesanan atau nama pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'today', label: 'Hari Ini' },
                  { value: 'week', label: 'Minggu Ini' },
                  { value: 'month', label: 'Bulan Ini' },
                  { value: 'all', label: 'Semua' }
                ].map(filter => (
                  <Button
                    key={filter.value}
                    variant={dateFilter === filter.value ? "default" : "outline"}
                    onClick={() => setDateFilter(filter.value)}
                    size="sm"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Transaksi #{transaction.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                      <span className="text-xl font-bold">
                        Rp {transaction.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Meja {transaction.tableId}</span>
                    <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                    {transaction.customerName && <span>Pelanggan: {transaction.customerName}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-medium">
                        <span>Total</span>
                        <span>Rp {transaction.total.toLocaleString()}</span>
                      </div>
                      {transaction.paymentMethod && (
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Metode Pembayaran</span>
                          <span>{transaction.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}