import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { KitchenOrder } from '@/types';

const KitchenDisplay = () => {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('*')
        .in('status', ['pending', 'preparing', 'ready'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      setKitchenOrders((data as KitchenOrder[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading kitchen orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'preparing') updates.started_at = new Date().toISOString();
      if (status === 'ready') updates.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('kitchen_orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      await fetchKitchenOrders();
      
      toast({
        title: "Order status updated",
        description: `Order marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        () => fetchKitchenOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kitchen Display System</h1>
            <p className="text-muted-foreground">Monitor and manage order preparation</p>
          </div>
          <Button onClick={fetchKitchenOrders} variant="outline">
            Refresh Orders
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : kitchenOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No pending orders</h3>
              <p className="text-muted-foreground">All orders are complete!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenOrders.map((order) => (
              <Card key={order.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 ${getStatusColor(order.status)}`}></div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Table {order.table_number}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getPriorityColor(order.priority)}>
                          {order.priority.toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.estimated_time}m
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Order #{order.order_id.slice(-8)}</div>
                    <div className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1"
                      >
                        <ChefHat className="h-4 w-4 mr-1" />
                        Start Cooking
                      </Button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="flex-1"
                        variant="default"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Ready
                      </Button>
                    )}
                    
                    {order.status === 'ready' && (
                      <div className="flex-1 text-center">
                        <div className="bg-green-100 text-green-800 p-2 rounded text-sm font-medium">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Ready for Pickup
                        </div>
                      </div>
                    )}
                  </div>

                  {order.priority === 'urgent' && (
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="flex items-center text-red-800 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        URGENT ORDER - Priority handling required
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default KitchenDisplay;