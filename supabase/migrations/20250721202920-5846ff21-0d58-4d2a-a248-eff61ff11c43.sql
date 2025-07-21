-- Create comprehensive database schema for TouchPay POS

-- Customer profiles table
CREATE TABLE public.customer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order notes table
CREATE TABLE public.order_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  image_name TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Promo codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily checklist tasks
CREATE TABLE public.checklist_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  role TEXT NOT NULL CHECK (role IN ('admin', 'kasir', 'waiter', 'all')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily checklist completions
CREATE TABLE public.checklist_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.checklist_tasks(id) ON DELETE CASCADE,
  completed_by UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  UNIQUE(task_id, date, completed_by)
);

-- Activity logs
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kitchen orders for kitchen display
CREATE TABLE public.kitchen_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  table_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  estimated_time INTEGER DEFAULT 15,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Installments for payment plans
CREATE TABLE public.installments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  customer_id UUID REFERENCES public.customer_profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  remaining_amount DECIMAL(10,2) NOT NULL,
  installment_count INTEGER NOT NULL,
  payment_schedule JSONB,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Installment payments
CREATE TABLE public.installment_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  installment_id UUID NOT NULL REFERENCES public.installments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  paid_by UUID NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Cash ledger for cash in/out tracking
CREATE TABLE public.cash_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  reference_id UUID,
  handled_by UUID NOT NULL,
  shift_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment methods management
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'manual' CHECK (type IN ('manual', 'qris', 'bank_transfer', 'ewallet')),
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment references for tracking external payments
CREATE TABLE public.payment_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  payment_method_id UUID NOT NULL REFERENCES public.payment_methods(id),
  reference_code TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shifts management
CREATE TABLE public.shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_name TEXT NOT NULL,
  opened_by UUID NOT NULL,
  closed_by UUID,
  opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_balance DECIMAL(10,2),
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_cash_in DECIMAL(10,2) DEFAULT 0,
  total_cash_out DECIMAL(10,2) DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  notes TEXT
);

-- Restaurant settings
CREATE TABLE public.restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  data_type TEXT NOT NULL DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_by UUID NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (permissive for demo purposes, can be tightened later)
CREATE POLICY "Enable read access for all users" ON public.customer_profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.customer_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.customer_profiles FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.order_notes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.order_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.order_notes FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.product_images FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.promo_codes FOR UPDATE USING (true);

CREATE POLICY "Enable all access for all users" ON public.checklist_tasks FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.checklist_completions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.activity_logs FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.kitchen_orders FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.installments FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.installment_payments FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.cash_ledger FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.payment_methods FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.payment_references FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.shifts FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.restaurant_settings FOR ALL USING (true);

-- Insert default payment methods
INSERT INTO public.payment_methods (name, display_name, icon, type, sort_order) VALUES
('tunai', 'Tunai', 'coins', 'manual', 1),
('transfer', 'Transfer Bank', 'credit-card', 'bank_transfer', 2),
('qris', 'QRIS', 'qr-code', 'qris', 3),
('gopay', 'GoPay', 'smartphone', 'ewallet', 4),
('ovo', 'OVO', 'smartphone', 'ewallet', 5),
('dana', 'DANA', 'smartphone', 'ewallet', 6),
('shopeepay', 'ShopeePay', 'smartphone', 'ewallet', 7);

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (setting_key, setting_value, data_type, description, updated_by) VALUES
('tax_rate', '11', 'number', 'Tax rate percentage (PPN)', 'system'),
('service_charge_rate', '5', 'number', 'Service charge percentage', 'system'),
('tax_enabled', 'true', 'boolean', 'Enable tax calculation', 'system'),
('service_charge_enabled', 'false', 'boolean', 'Enable service charge', 'system'),
('auto_print_receipt', 'true', 'boolean', 'Automatically print receipts', 'system'),
('receipt_logo_url', '', 'string', 'URL for receipt logo', 'system');

-- Insert default checklist tasks
INSERT INTO public.checklist_tasks (title, description, role, priority) VALUES
('Buka Kasir', 'Nyalakan sistem kasir dan cek koneksi', 'kasir', 'high'),
('Cek Stok Bahan', 'Periksa ketersediaan bahan baku utama', 'admin', 'high'),
('Bersihkan Area Meja', 'Pastikan semua meja bersih dan siap pakai', 'waiter', 'medium'),
('Test Printer', 'Pastikan printer receipt berfungsi normal', 'kasir', 'medium'),
('Cek Kebersihan Dapur', 'Pastikan area dapur bersih dan higienis', 'all', 'high'),
('Update Menu Harian', 'Perbarui menu atau item yang tidak tersedia', 'admin', 'medium');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('menu-images', 'menu-images', true),
('receipt-pdfs', 'receipt-pdfs', false);

-- Create storage policies
CREATE POLICY "Public menu images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their receipt PDFs" ON storage.objects FOR SELECT USING (bucket_id = 'receipt-pdfs' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload receipt PDFs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipt-pdfs' AND auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON public.promo_codes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_checklist_tasks_updated_at BEFORE UPDATE ON public.checklist_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kitchen_orders_updated_at BEFORE UPDATE ON public.kitchen_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON public.installments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_references_updated_at BEFORE UPDATE ON public.payment_references FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();