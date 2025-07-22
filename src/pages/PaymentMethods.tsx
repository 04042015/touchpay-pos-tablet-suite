import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, CreditCard, Smartphone, QrCode, Coins, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    icon: 'credit-card',
    type: 'manual' as 'manual' | 'qris' | 'bank_transfer' | 'ewallet',
    is_active: true,
  });

  const iconOptions = [
    { value: 'coins', label: 'Coins', icon: Coins },
    { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { value: 'smartphone', label: 'Smartphone', icon: Smartphone },
    { value: 'qr-code', label: 'QR Code', icon: QrCode },
  ];

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPaymentMethods((data as PaymentMethod[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading payment methods",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methodData = {
        ...formData,
        sort_order: selectedMethod?.sort_order || paymentMethods.length + 1,
      };

      if (selectedMethod) {
        const { error } = await supabase
          .from('payment_methods')
          .update(methodData)
          .eq('id', selectedMethod.id);

        if (error) throw error;
        toast({ title: "Payment method updated successfully" });
      } else {
        const { error } = await supabase
          .from('payment_methods')
          .insert([methodData]);

        if (error) throw error;
        toast({ title: "Payment method added successfully" });
      }

      await fetchPaymentMethods();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving payment method",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      icon: 'credit-card',
      type: 'manual',
      is_active: true,
    });
    setSelectedMethod(null);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormData({
      name: method.name,
      display_name: method.display_name,
      icon: method.icon || 'credit-card',
      type: method.type,
      is_active: method.is_active,
    });
    setDialogOpen(true);
  };

  const toggleMethodStatus = async (method: PaymentMethod) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: !method.is_active })
        .eq('id', method.id);

      if (error) throw error;
      
      await fetchPaymentMethods();
      toast({
        title: "Payment method updated",
        description: `Method ${!method.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating payment method",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'qris': return 'bg-blue-100 text-blue-800';
      case 'bank_transfer': return 'bg-green-100 text-green-800';
      case 'ewallet': return 'bg-purple-100 text-purple-800';
      case 'manual': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : CreditCard;
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-muted-foreground">Configure available payment options</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Method Code *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    placeholder="cash, qris, gopay"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique identifier (lowercase, no spaces)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="display_name">Display Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    placeholder="Cash, QRIS, GoPay"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Select 
                      value={formData.icon} 
                      onValueChange={(value) => setFormData({...formData, icon: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'manual' | 'qris' | 'bank_transfer' | 'ewallet') => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="qris">QRIS</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="ewallet">E-Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedMethod ? 'Update' : 'Add'} Method
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
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
        ) : paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No payment methods</h3>
              <p className="text-muted-foreground">Add your first payment method</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const IconComponent = getIconComponent(method.icon || 'credit-card');
              
              return (
                <Card key={method.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <IconComponent className="h-8 w-8 text-muted-foreground" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{method.display_name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {method.name}
                            </code>
                            <Badge className={getTypeColor(method.type)}>
                              {method.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {method.is_active ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(method)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={method.is_active ? "secondary" : "default"}
                          size="sm"
                          onClick={() => toggleMethodStatus(method)}
                        >
                          {method.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">
                    Drag and drop payment methods to reorder them. 
                    The order here determines how they appear in the payment interface.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentMethods;