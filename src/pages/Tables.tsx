import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Table } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Tables() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<{
    number: string;
    area: string;
    capacity: number;
    status: 'kosong' | 'dipesan' | 'makan' | 'selesai';
  }>({
    number: '',
    area: '',
    capacity: 4,
    status: 'kosong'
  });

  const resetForm = () => {
    setFormData({
      number: '',
      area: '',
      capacity: 4,
      status: 'kosong'
    });
    setEditingTable(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTable) {
      // Update existing table
      const updatedTable: Table = {
        ...editingTable,
        ...formData,
      };
      
      dispatch({ type: 'UPDATE_TABLE', payload: updatedTable });
      
      toast({
        title: 'Meja Diperbarui',
        description: `Meja ${formData.number} berhasil diperbarui`
      });
    } else {
      // Create new table
      const newTable: Table = {
        id: `table-${Date.now()}`,
        ...formData,
        createdAt: new Date()
      };
      
      dispatch({ type: 'ADD_TABLE', payload: newTable });
      
      toast({
        title: 'Meja Ditambahkan',
        description: `Meja ${formData.number} berhasil ditambahkan`
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setFormData({
      number: table.number,
      area: table.area,
      capacity: table.capacity,
      status: table.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (tableId: string) => {
    const table = state.tables.find(t => t.id === tableId);
    if (table) {
      dispatch({ type: 'DELETE_TABLE', payload: tableId });
      
      toast({
        title: 'Meja Dihapus',
        description: `Meja ${table.number} berhasil dihapus`
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'kosong':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'dipesan':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'makan':
        return <Users className="h-4 w-4 text-primary" />;
      case 'selesai':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'kosong':
        return 'bg-success text-success-foreground';
      case 'dipesan':
        return 'bg-warning text-warning-foreground';
      case 'makan':
        return 'bg-primary text-primary-foreground';
      case 'selesai':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTableCardColor = (status: string) => {
    switch (status) {
      case 'kosong':
        return 'border-success bg-success/5';
      case 'dipesan':
        return 'border-warning bg-warning/5';
      case 'makan':
        return 'border-primary bg-primary/5';
      case 'selesai':
        return 'border-muted bg-muted/5';
      default:
        return 'border-border';
    }
  };

  const statusOptions = [
    { value: 'kosong', label: 'Kosong' },
    { value: 'dipesan', label: 'Dipesan' },
    { value: 'makan', label: 'Sedang Makan' },
    { value: 'selesai', label: 'Selesai' }
  ];

  const areas = [...new Set(state.tables.map(t => t.area))].filter(Boolean);

  return (
    <Layout title="Manajemen Meja">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manajemen Meja</h1>
            <p className="text-muted-foreground">
              Kelola meja restoran dan status ketersediaannya
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Meja
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTable ? 'Edit Meja' : 'Tambah Meja Baru'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Nomor Meja</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      placeholder="01"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="VIP, Regular, Outdoor"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'kosong' | 'dipesan' | 'makan' | 'selesai') => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTable ? 'Perbarui' : 'Tambah'} Meja
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          {statusOptions.map((status) => {
            const count = state.tables.filter(t => t.status === status.value).length;
            return (
              <Card key={status.value}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.value)}
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground">{status.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tables Grid */}
        {state.tables.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Belum Ada Meja</h3>
              <p className="text-muted-foreground text-center mt-2">
                Tambahkan meja pertama untuk mulai mengelola restoran Anda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 tablet:grid-cols-3 tablet-lg:grid-cols-4 gap-4">
            {state.tables.map((table) => (
              <Card key={table.id} className={`${getTableCardColor(table.status)} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Meja {table.number}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(table)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(table.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Area:</span>
                      <span className="text-sm font-medium">{table.area}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Kapasitas:</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-sm font-medium">{table.capacity}</span>
                      </div>
                    </div>
                    
                    <Badge className={`w-full justify-center ${getStatusColor(table.status)}`}>
                      {statusOptions.find(s => s.value === table.status)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}