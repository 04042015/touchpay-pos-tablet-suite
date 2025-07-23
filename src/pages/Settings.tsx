import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { Settings as SettingsIcon, Store, Receipt, Bell, Shield, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'TouchPay Restaurant',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '021-12345678',
    email: 'info@touchpay.com',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    printCustomerCopy: true,
    printKitchenCopy: true,
    includeQR: false,
    footerText: 'Terima kasih atas kunjungan Anda',
  });

  const [taxSettings, setTaxSettings] = useState({
    enableTax: true,
    taxRate: 10,
    taxLabel: 'PPN',
    enableServiceCharge: true,
    serviceChargeRate: 5,
    serviceChargeLabel: 'Service Charge',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableOrderNotifications: true,
    enablePaymentNotifications: true,
    enableLowStockNotifications: true,
    soundEnabled: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    requirePasswordForVoid: true,
    sessionTimeout: 30,
    enableActivityLog: true,
    maxLoginAttempts: 3,
  });

  const handleSaveRestaurant = () => {
    // Save restaurant settings
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { restaurant: restaurantSettings }
    });
    toast({
      title: "Berhasil",
      description: "Pengaturan restoran berhasil disimpan",
    });
  };

  const handleSaveReceipt = () => {
    // Save receipt settings
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { receipt: receiptSettings }
    });
    toast({
      title: "Berhasil",
      description: "Pengaturan struk berhasil disimpan",
    });
  };

  const handleSaveTax = () => {
    // Save tax settings
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { tax: taxSettings }
    });
    toast({
      title: "Berhasil",
      description: "Pengaturan pajak berhasil disimpan",
    });
  };

  const handleBackupData = () => {
    // Create backup
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        products: state.products,
        categories: state.categories,
        tables: state.tables,
        orders: state.orders,
        transactions: state.transactions,
      }
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `touchpay-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Berhasil",
      description: "Backup data berhasil dibuat",
    });
  };

  return (
    <Layout title="Pengaturan">
      <div className="space-y-6">
        <Tabs defaultValue="restaurant" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="restaurant" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Restoran
            </TabsTrigger>
            <TabsTrigger value="receipt" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Struk
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Pajak
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Restoran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nama Restoran</label>
                    <Input
                      value={restaurantSettings.name}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nomor Telepon</label>
                    <Input
                      value={restaurantSettings.phone}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Alamat</label>
                    <Input
                      value={restaurantSettings.address}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={restaurantSettings.email}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Zona Waktu</label>
                    <select
                      value={restaurantSettings.timezone}
                      onChange={(e) => setRestaurantSettings({...restaurantSettings, timezone: e.target.value})}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                      <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                      <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleSaveRestaurant}>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Struk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tampilkan Logo di Struk</label>
                    <Switch
                      checked={receiptSettings.showLogo}
                      onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, showLogo: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Cetak Salinan untuk Pelanggan</label>
                    <Switch
                      checked={receiptSettings.printCustomerCopy}
                      onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, printCustomerCopy: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Cetak Salinan untuk Dapur</label>
                    <Switch
                      checked={receiptSettings.printKitchenCopy}
                      onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, printKitchenCopy: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sertakan QR Code</label>
                    <Switch
                      checked={receiptSettings.includeQR}
                      onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, includeQR: checked})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Teks Footer</label>
                    <Input
                      value={receiptSettings.footerText}
                      onChange={(e) => setReceiptSettings({...receiptSettings, footerText: e.target.value})}
                      placeholder="Terima kasih atas kunjungan Anda"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveReceipt}>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Pajak & Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Aktifkan Pajak</label>
                    <Switch
                      checked={taxSettings.enableTax}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableTax: checked})}
                    />
                  </div>
                  {taxSettings.enableTax && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Label Pajak</label>
                        <Input
                          value={taxSettings.taxLabel}
                          onChange={(e) => setTaxSettings({...taxSettings, taxLabel: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tarif Pajak (%)</label>
                        <Input
                          type="number"
                          value={taxSettings.taxRate}
                          onChange={(e) => setTaxSettings({...taxSettings, taxRate: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Aktifkan Service Charge</label>
                    <Switch
                      checked={taxSettings.enableServiceCharge}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableServiceCharge: checked})}
                    />
                  </div>
                  {taxSettings.enableServiceCharge && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Label Service Charge</label>
                        <Input
                          value={taxSettings.serviceChargeLabel}
                          onChange={(e) => setTaxSettings({...taxSettings, serviceChargeLabel: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tarif Service Charge (%)</label>
                        <Input
                          type="number"
                          value={taxSettings.serviceChargeRate}
                          onChange={(e) => setTaxSettings({...taxSettings, serviceChargeRate: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={handleSaveTax}>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Notifikasi Pesanan Baru</label>
                    <Switch
                      checked={notificationSettings.enableOrderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableOrderNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Notifikasi Pembayaran</label>
                    <Switch
                      checked={notificationSettings.enablePaymentNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enablePaymentNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Notifikasi Stok Menipis</label>
                    <Switch
                      checked={notificationSettings.enableLowStockNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableLowStockNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Suara Notifikasi</label>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, soundEnabled: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Keamanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Require Password untuk Void</label>
                    <Switch
                      checked={securitySettings.requirePasswordForVoid}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requirePasswordForVoid: checked})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session Timeout (menit)</label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Aktifkan Activity Log</label>
                    <Switch
                      checked={securitySettings.enableActivityLog}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableActivityLog: checked})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maksimal Percobaan Login</label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Backup Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Buat backup semua data aplikasi (produk, kategori, meja, pesanan, transaksi)
                    </p>
                    <Button onClick={handleBackupData}>
                      <Database className="h-4 w-4 mr-2" />
                      Buat Backup
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Statistik Database</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Produk</p>
                        <p className="font-bold">{state.products.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kategori</p>
                        <p className="font-bold">{state.categories.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meja</p>
                        <p className="font-bold">{state.tables.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transaksi</p>
                        <p className="font-bold">{state.transactions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}