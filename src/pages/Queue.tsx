import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Clock, Play, CheckCircle, AlertCircle } from 'lucide-react';

export default function Queue() {
  const { state, dispatch } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const queueOrders = state.orders.filter(order => order.status === 'pending');

  const handleStartOrder = (orderId: string) => {
    const updatedOrders = state.orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'in_progress' as const }
        : order
    );
    dispatch({ type: 'SET_ORDERS', payload: updatedOrders });
  };

  const handleCompleteOrder = (orderId: string) => {
    const updatedOrders = state.orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'completed' as const }
        : order
    );
    dispatch({ type: 'SET_ORDERS', payload: updatedOrders });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'in_progress':
        return 'Diproses';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getWaitingTime = (createdAt: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 1000 / 60);
    return `${diff} menit`;
  };

  return (
    <Layout title="Antrian Pesanan">
      <div className="space-y-6">
        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold">
                    {state.orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Diproses</p>
                  <p className="text-2xl font-bold">
                    {state.orders.filter(o => o.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Selesai Hari Ini</p>
                  <p className="text-2xl font-bold">
                    {state.orders.filter(o => o.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Antrian Pesanan</h2>
          
          {queueOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Tidak ada pesanan dalam antrian</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {queueOrders.map((order) => (
                <Card key={order.id} className={selectedOrder === order.id ? "ring-2 ring-primary" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Pesanan #{order.orderNumber}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getWaitingTime(order.createdAt)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Meja {order.tableId}</span>
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span>Rp {order.total.toLocaleString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{item.name} x{item.quantity}</span>
                            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        {order.status === 'pending' && (
                          <Button 
                            onClick={() => handleStartOrder(order.id)}
                            size="sm"
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Mulai Proses
                          </Button>
                        )}
                        {order.status === 'in_progress' && (
                          <Button 
                            onClick={() => handleCompleteOrder(order.id)}
                            size="sm"
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Selesai
                          </Button>
                        )}
                        <Button 
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          size="sm"
                          variant="outline"
                        >
                          {selectedOrder === order.id ? 'Tutup' : 'Detail'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}