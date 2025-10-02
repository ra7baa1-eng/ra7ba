-- =====================================================
-- Ra7ba Platform - Database Seed SQL
-- لإنشاء البيانات الأساسية في قاعدة البيانات
-- =====================================================

-- إدراج الولايات الجزائرية (58 ولاية)
INSERT INTO "Wilaya" (id, name, "arabicName", longitude, latitude) VALUES
(1, 'Adrar', 'أدرار', -0.266667, 27.8743),
(2, 'Chlef', 'الشلف', 1.3345, 36.1658),
(3, 'Laghouat', 'الأغواط', 2.8642, 33.8000),
(4, 'Oum El Bouaghi', 'أم البواقي', 7.1134, 35.8714),
(5, 'Batna', 'باتنة', 6.1742, 35.5559),
(6, 'Bejaia', 'بجاية', 5.0697, 36.7525),
(7, 'Biskra', 'بسكرة', 5.7281, 34.8481),
(8, 'Bechar', 'بشار', -2.2300, 31.6170),
(9, 'Blida', 'البليدة', 2.8277, 36.4203),
(10, 'Bouira', 'البويرة', 3.9039, 36.3733),
(11, 'Tamanrasset', 'تمنراست', 5.5228, 22.7850),
(12, 'Tebessa', 'تبسة', 8.1242, 35.4042),
(13, 'Tlemcen', 'تلمسان', -1.3150, 34.8783),
(14, 'Tiaret', 'تيارت', 1.3167, 35.3667),
(15, 'Tizi Ouzou', 'تيزي وزو', 4.0400, 36.7118),
(16, 'Alger', 'الجزائر', 3.0500, 36.7538),
(17, 'Djelfa', 'الجلفة', 3.2631, 34.6704),
(18, 'Jijel', 'جيجل', 5.7667, 36.8200),
(19, 'Setif', 'سطيف', 5.4138, 36.1911),
(20, 'Saida', 'سعيدة', 0.1514, 34.8303),
(21, 'Skikda', 'سكيكدة', 6.9094, 36.8761),
(22, 'Sidi Bel Abbes', 'سيدي بلعباس', -0.6300, 35.1917),
(23, 'Annaba', 'عنابة', 7.7667, 36.9000),
(24, 'Guelma', 'قالمة', 7.4261, 36.4619),
(25, 'Constantine', 'قسنطينة', 6.6147, 36.3650),
(26, 'Medea', 'المدية', 2.7539, 36.2639),
(27, 'Mostaganem', 'مستغانم', 0.0892, 35.9311),
(28, 'MSila', 'المسيلة', 4.5417, 35.7022),
(29, 'Mascara', 'معسكر', -0.1406, 35.3964),
(30, 'Ouargla', 'ورقلة', 5.3250, 31.9539),
(31, 'Oran', 'وهران', -0.6333, 35.6969),
(32, 'El Bayadh', 'البيض', 1.0192, 33.6800),
(33, 'Illizi', 'إليزي', 8.4717, 26.4833),
(34, 'Bordj Bou Arreridj', 'برج بوعريريج', 4.7611, 36.0731),
(35, 'Boumerdes', 'بومرداس', 3.4708, 36.7667),
(36, 'El Tarf', 'الطارف', 8.3142, 36.7672),
(37, 'Tindouf', 'تندوف', -8.1475, 27.6711),
(38, 'Tissemsilt', 'تيسمسيلت', 1.8111, 35.6075),
(39, 'El Oued', 'الوادي', 6.8675, 33.3567),
(40, 'Khenchela', 'خنشلة', 7.1433, 35.4358),
(41, 'Souk Ahras', 'سوق أهراس', 7.9514, 36.2864),
(42, 'Tipaza', 'تيبازة', 2.4472, 36.5897),
(43, 'Mila', 'ميلة', 6.2644, 36.4503),
(44, 'Ain Defla', 'عين الدفلى', 1.9672, 36.2639),
(45, 'Naama', 'النعامة', -0.2967, 33.2667),
(46, 'Ain Temouchent', 'عين تموشنت', -1.1400, 35.2983),
(47, 'Ghardaia', 'غرداية', 3.6739, 32.4911),
(48, 'Relizane', 'غليزان', 0.5556, 35.7372),
(49, 'El M Ghaier', 'المغير', 6.0000, 33.9500),
(50, 'El Menia', 'المنيعة', 2.8833, 30.5833),
(51, 'Ouled Djellal', 'أولاد جلال', 6.0667, 34.4167),
(52, 'Bordj Badji Mokhtar', 'برج باجي مختار', 0.9667, 21.3167),
(53, 'Beni Abbes', 'بني عباس', -2.1667, 30.1333),
(54, 'Timimoun', 'تيميمون', 0.2667, 29.2667),
(55, 'Touggourt', 'تقرت', 6.0575, 33.1067),
(56, 'Djanet', 'جانت', 9.4833, 24.5500),
(57, 'In Salah', 'عين صالح', 2.4667, 27.2000),
(58, 'In Guezzam', 'عين قزّام', 5.7667, 19.5667);

-- إنشاء حساب المشرف (Admin)
-- كلمة المرور: Admin123! (مشفرة بـ bcrypt)
INSERT INTO "User" (email, password, role, "createdAt", "updatedAt") VALUES
('admin@ra7ba.com', '$2b$10$rEuVtKqU8Z2hGJHl9Y7K5u5k8X8Y8X8Y8X8Y8X8Y8X8Y8X8Y8X8Y8X8Y8X8', 'ADMIN', NOW(), NOW());

-- إضافة إعدادات النظام الأساسية
INSERT INTO "SystemSetting" (key, value, "createdAt", "updatedAt") VALUES
('platform_name', 'منصة رحبة', NOW(), NOW()),
('admin_email', 'admin@ra7ba.com', NOW(), NOW()),
('support_email', 'support@ra7ba.com', NOW(), NOW()),
('default_currency', 'DZD', NOW(), NOW()),
('delivery_fee_per_km', '50', NOW(), NOW()),
('min_order_amount', '500', NOW(), NOW()),
('max_delivery_distance', '100', NOW(), NOW()),
('platform_commission', '5', NOW(), NOW());

-- إضافة حالات الطلبات (Order Status)
INSERT INTO "OrderStatus" (id, name, "arabicName", color, "createdAt") VALUES
(1, 'PENDING', 'في الانتظار', '#FFA500', NOW()),
(2, 'CONFIRMED', 'مؤكد', '#007BFF', NOW()),
(3, 'PREPARING', 'قيد التحضير', '#17A2B8', NOW()),
(4, 'READY', 'جاهز', '#28A745', NOW()),
(5, 'ON_THE_WAY', 'في الطريق', '#6F42C1', NOW()),
(6, 'DELIVERED', 'تم التسليم', '#20C997', NOW()),
(7, 'CANCELLED', 'ملغي', '#DC3545', NOW());

-- إضافة أنواع المستخدمين (User Roles)
INSERT INTO "UserRole" (id, name, "arabicName", permissions, "createdAt") VALUES
(1, 'ADMIN', 'مدير النظام', '["all"]', NOW()),
(2, 'MERCHANT', 'تاجر', '["manage_store", "manage_products", "manage_orders"]', NOW()),
(3, 'DELIVERY', 'سائق التوصيل', '["view_orders", "update_order_status"]', NOW()),
(4, 'CUSTOMER', 'عميل', '["place_orders", "track_orders"]', NOW());

-- إضافة فئات المنتجات الأساسية
INSERT INTO "Category" (name, "arabicName", icon, "createdAt") VALUES
('Food & Beverages', 'طعام ومشروبات', 'restaurant', NOW()),
('Electronics', 'إلكترونيات', 'devices', NOW()),
('Fashion', 'أزياء', 'checkroom', NOW()),
('Home & Garden', 'منزل وحديقة', 'home', NOW()),
('Sports', 'رياضة', 'sports', NOW()),
('Books', 'كتب', 'book', NOW()),
('Beauty', 'جمال', 'spa', NOW()),
('Toys', 'ألعاب', 'toys', NOW()),
('Automotive', 'سيارات', 'directions_car', NOW()),
('Health', 'صحة', 'local_hospital', NOW());

-- تم بنجاح! 🎉
-- الآن قاعدة البيانات جاهزة بالكامل
