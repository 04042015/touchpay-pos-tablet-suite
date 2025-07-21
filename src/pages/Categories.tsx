import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Package
} from 'lucide-react';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Categories() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      const updatedCategory: Category = {
        ...editingCategory,
        ...formData,
      };
      
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      
      toast({
        title: 'Kategori Diperbarui',
        description: `${formData.name} berhasil diperbarui`
      });
    } else {
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        ...formData,
        createdAt: new Date()
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      
      toast({
        title: 'Kategori Ditambahkan',
        description: `${formData.name} berhasil ditambahkan`
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    const category = state.categories.find(c => c.id === categoryId);
    const productsInCategory = state.products.filter(p => p.categoryId === categoryId);
    
    if (productsInCategory.length > 0) {
      toast({
        title: 'Tidak Dapat Dihapus',
        description: `Kategori ${category?.name} masih memiliki ${productsInCategory.length} produk`,
        variant: 'destructive'
      });
      return;
    }
    
    if (category) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
      
      toast({
        title: 'Kategori Dihapus',
        description: `${category.name} berhasil dihapus`
      });
    }
  };

  const getProductCount = (categoryId: string) => {
    return state.products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <Layout title="Manajemen Kategori">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manajemen Kategori</h1>
            <p className="text-muted-foreground">
              Kelola kategori produk untuk mengorganisir menu restoran
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Makanan Utama"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi kategori (opsional)"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Kategori aktif</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Perbarui' : 'Tambah'} Kategori
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

        {/* Categories List */}
        {state.categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Belum Ada Kategori</h3>
              <p className="text-muted-foreground text-center mt-2">
                Tambahkan kategori pertama untuk mengorganisir menu restoran Anda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 tablet:grid-cols-2 tablet-lg:grid-cols-3 gap-4">
            {state.categories.map((category) => {
              const productCount = getProductCount(category.id);
              
              return (
                <Card key={category.id} className={`hover:shadow-md transition-shadow ${!category.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {productCount} produk
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {productCount} produk terdaftar
                          </span>
                        </div>
                        
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Dibuat: {new Date(category.createdAt).toLocaleDateString('id-ID')}
                      </div>
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
}