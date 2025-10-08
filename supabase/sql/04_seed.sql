-- Seed default extensions
insert into public.extensions (key, name, description) values
  ('whatsapp', 'WhatsApp Button', 'زر تواصل واتساب على المتجر'),
  ('google_analytics', 'Google Analytics', 'تتبع زيارات المتجر'),
  ('telegram_bot', 'Telegram Bot', 'بوت تيليجرام لإشعارات الطلبات'),
  ('disable_right_click', 'Disable Right Click', 'تعطيل النقر باليمين لحماية المحتوى'),
  ('google_sheets_orders', 'Google Sheets (Orders)', 'إرسال الطلبات إلى Google Sheets')
on conflict (key) do nothing;
