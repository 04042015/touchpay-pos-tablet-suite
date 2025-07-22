import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Ticket, Calendar, Percent, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PromoCode } from '@/types';

const PromoManagement = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_order_amount: '',
    max_discount_amount: '',
    valid_until: '',
    usage_limit: '',
    is_active: true,
  });

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes((data as PromoCode[]) || []);
    } catch (error: any) {
      toast({
        title: "Error loading promo codes",
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
      const promoData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
      };

      if (selectedPromo) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', selectedPromo.id);

        if (error) throw error;
        toast({ title: "Promo code updated successfully" });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([{ ...promoData, used_count: 0 }]);

        if (error) throw error;
        toast({ title: "Promo code added successfully" });
      }

      await fetchPromoCodes();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving promo code",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      valid_until: '',
      usage_limit: '',
      is_active: true,
    });
    setSelectedPromo(null);
  };

  const openEditDialog = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setFormData({
      code: promo.code,
      name: promo.name,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value.toString(),
      min_order_amount: promo.min_order_amount.toString(),
      max_discount_amount: promo.max_discount_amount?.toString() || '',
      valid_until: promo.valid_until ? new Date(promo.valid_until).toISOString().slice(0, 16) : '',
      usage_limit: promo.usage_limit?.toString() || '',
      is_active: promo.is_active,
    });
    setDialogOpen(true);
  };

  const togglePromoStatus = async (promo: PromoCode) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !promo.is_active })
        .eq('id', promo.id);

      if (error) throw error;
      
      await fetchPromoCodes();
      toast({
        title: "Promo status updated",
        description: `Promo ${!promo.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating promo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isExpired = (validUntil?: string) => {
    return validUntil ? new Date(validUntil) < new Date() : false;
  };

  const getPromoStatus = (promo: PromoCode) => {
    if (!promo.is_active) return { label: 'Inactive', color: 'secondary' };
    if (isExpired(promo.valid_until)) return { label: 'Expired', color: 'destructive' };
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) return { label: 'Used Up', color: 'destructive' };
    return { label: 'Active', color: 'default' };
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promo Management</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Promo Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Promo Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="DISKON10"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Display Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Diskon 10%"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Promo description..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount Type</Label>
                    <Select 
                      value={formData.discount_type} 
                      onValueChange={(value: 'percentage' | 'fixed') => setFormData({...formData, discount_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discount_value">
                      Discount Value * ({formData.discount_type === 'percentage' ? '%' : 'Rp'})
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                      placeholder={formData.discount_type === 'percentage' ? '10' : '50000'}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_order_amount">Minimum Order (Rp)</Label>
                    <Input
                      id="min_order_amount"
                      type="number"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  {formData.discount_type === 'percentage' && (
                    <div>
                      <Label htmlFor="max_discount_amount">Max Discount (Rp)</Label>
                      <Input
                        id="max_discount_amount"
                        type="number"
                        value={formData.max_discount_amount}
                        onChange={(e) => setFormData({...formData, max_discount_amount: e.target.value})}
                        placeholder="Optional"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valid_until">Valid Until</Label>
                    <Input
                      id="valid_until"
                      type="datetime-local"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usage_limit">Usage Limit</Label>
                    <Input
                      id="usage_limit"
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      placeholder="Unlimited"
                    />
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
                    {selectedPromo ? 'Update' : 'Create'} Promo
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
        ) : promoCodes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No promo codes yet</h3>
              <p className="text-muted-foreground">Start by creating your first promo code</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoCodes.map((promo) => {
              const status = getPromoStatus(promo);
              return (
                <Card key={promo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-mono">{promo.code}</CardTitle>
                        <p className="text-sm text-muted-foreground">{promo.name}</p>
                      </div>
                      <Badge variant={status.color as any}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {promo.discount_type === 'percentage' ? (
                        <Percent className="h-4 w-4 text-green-600" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium text-green-600">
                        {promo.discount_type === 'percentage' 
                          ? `${promo.discount_value}%` 
                          : `Rp ${promo.discount_value.toLocaleString('id-ID')}`}
                      </span>
                    </div>

                    {promo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {promo.description}
                      </p>
                    )}

                    <div className="space-y-1 text-sm">
                      {promo.min_order_amount > 0 && (
                        <div>Min order: Rp {promo.min_order_amount.toLocaleString('id-ID')}</div>
                      )}
                      {promo.max_discount_amount && (
                        <div>Max discount: Rp {promo.max_discount_amount.toLocaleString('id-ID')}</div>
                      )}
                      {promo.usage_limit && (
                        <div>Usage: {promo.used_count}/{promo.usage_limit}</div>
                      )}
                      {promo.valid_until && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Until: {new Date(promo.valid_until).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(promo)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant={promo.is_active ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePromoStatus(promo)}
                        className="flex-1"
                      >
                        {promo.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PromoManagement;