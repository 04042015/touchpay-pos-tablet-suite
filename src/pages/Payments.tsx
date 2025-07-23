import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { CreditCard, Banknote, Smartphone, QrCode, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Payments() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [amount, setAmount] = useState<string>('');

  const unpaidOrders = state.orders.filter(order => order.status === 'pending');

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', icon: Banknote },
    { id: 'card', name: 'Kartu Debit/Kredit', icon: CreditCard },
    { id: 'qris', name: 'QRIS', icon: QrCode },
    { id: 'ewallet', name: 'E-Wallet', icon: Smartphone },
  ];

  const handlePayment = () => {
    if (!selectedOrder) {
      toast({
        title: "Error",
        description: "Pilih pesanan yang akan dibayar",
        variant: "destructive",
      });
      return;
    }

    const order = state.orders.find(o => o.id === selectedOrder);
    if (!order) return;

    const paymentAmount = parseFloat(amount) || order.total;

    if (paymentAmount < order.total) {
      toast({
        title: "Error",
        description: "Jumlah pembayaran kurang dari total pesanan",
        variant: "destructive",
      });
      return;
    }

    // Create payment record
    const newPayment = {
      id: `payment_${Date.now()}`,
      orderId: order.id,
      amount: paymentAmount,
      method: paymentMethod,
      createdAt: new Date(),
      status: 'completed' as const,
    };

    // Update order status
    const updatedOrders = state.orders.map(o =>
      o.id === selectedOrder
        ? { ...o, status: 'completed' as const }
        : o
    );

    // Add payment to state
    const updatedPayments = [...state.payments, newPayment];

    dispatch({ type: 'SET_ORDERS', payload: updatedOrders });
    dispatch({ type: 'SET_PAYMENTS', payload: updatedPayments });

    const change = paymentAmount - order.total;
    
    toast({
      title: "Pembayaran Berhasil",
      description: `Pembayaran sebesar Rp ${paymentAmount.toLocaleString()} berhasil diproses${change > 0 ? `. Kembalian: Rp ${change.toLocaleString()}` : ''}`,
    });

    // Reset form
    setSelectedOrder('');
    setAmount('');
    setPaymentMethod('cash');
  };

  const selectedOrderData = state.orders.find(o => o.id === selectedOrder);

  return (
    <Layout title="Pembayaran">
      <div className="space-y-6">
        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Hari Ini</p>
                  <p className="text-2xl font-bold">
                    Rp {state.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pembayaran Tunai</p>
                  <p className="text-2xl font-bold">
                    {state.payments.filter(p => p.method === 'cash').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">QRIS</p>
                  <p className="text-2xl font-bold">
                    {state.payments.filter(p => p.method === 'qris').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Kartu</p>
                  <p className="text-2xl font-bold">
                    {state.payments.filter(p => p.method === 'card').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Proses Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Select Order */}
              <div>
                <label className="text-sm font-medium">Pilih Pesanan</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">-- Pilih Pesanan --</option>
                  {unpaidOrders.map(order => (
                    <option key={order.id} value={order.id}>
                      #{order.orderNumber} - Meja {order.tableId} - Rp {order.total.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-sm font-medium">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        onClick={() => setPaymentMethod(method.id)}
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {method.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium">Jumlah Bayar</label>
                <Input
                  type="number"
                  placeholder={selectedOrderData ? `Min: ${selectedOrderData.total}` : "0"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
                {selectedOrderData && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Total pesanan: Rp {selectedOrderData.total.toLocaleString()}
                  </p>
                )}
              </div>

              <Button 
                onClick={handlePayment} 
                className="w-full"
                disabled={!selectedOrder}
              >
                Proses Pembayaran
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Belum ada pembayaran hari ini
                  </p>
                ) : (
                  state.payments
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Rp {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {paymentMethods.find(m => m.id === payment.method)?.name}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            #{state.orders.find(o => o.id === payment.orderId)?.orderNumber}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}