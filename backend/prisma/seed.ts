import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 58 Algerian Wilayas
const wilayas = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار', deliveryFee: 800 },
  { code: '02', name: 'Chlef', nameAr: 'الشلف', deliveryFee: 550 },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط', deliveryFee: 650 },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي', deliveryFee: 600 },
  { code: '05', name: 'Batna', nameAr: 'باتنة', deliveryFee: 600 },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية', deliveryFee: 550 },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة', deliveryFee: 650 },
  { code: '08', name: 'Béchar', nameAr: 'بشار', deliveryFee: 850 },
  { code: '09', name: 'Blida', nameAr: 'البليدة', deliveryFee: 500 },
  { code: '10', name: 'Bouira', nameAr: 'البويرة', deliveryFee: 550 },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست', deliveryFee: 1000 },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة', deliveryFee: 700 },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان', deliveryFee: 600 },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت', deliveryFee: 600 },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو', deliveryFee: 550 },
  { code: '16', name: 'Algiers', nameAr: 'الجزائر', deliveryFee: 400 },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة', deliveryFee: 650 },
  { code: '18', name: 'Jijel', nameAr: 'جيجل', deliveryFee: 600 },
  { code: '19', name: 'Sétif', nameAr: 'سطيف', deliveryFee: 600 },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة', deliveryFee: 650 },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة', deliveryFee: 600 },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', deliveryFee: 600 },
  { code: '23', name: 'Annaba', nameAr: 'عنابة', deliveryFee: 650 },
  { code: '24', name: 'Guelma', nameAr: 'قالمة', deliveryFee: 650 },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة', deliveryFee: 600 },
  { code: '26', name: 'Médéa', nameAr: 'المدية', deliveryFee: 550 },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم', deliveryFee: 600 },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة', deliveryFee: 600 },
  { code: '29', name: 'Mascara', nameAr: 'معسكر', deliveryFee: 600 },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة', deliveryFee: 750 },
  { code: '31', name: 'Oran', nameAr: 'وهران', deliveryFee: 550 },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض', deliveryFee: 700 },
  { code: '33', name: 'Illizi', nameAr: 'إليزي', deliveryFee: 1000 },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', deliveryFee: 600 },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس', deliveryFee: 500 },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف', deliveryFee: 700 },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف', deliveryFee: 1000 },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت', deliveryFee: 600 },
  { code: '39', name: 'El Oued', nameAr: 'الوادي', deliveryFee: 700 },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة', deliveryFee: 650 },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس', deliveryFee: 700 },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة', deliveryFee: 500 },
  { code: '43', name: 'Mila', nameAr: 'ميلة', deliveryFee: 650 },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى', deliveryFee: 550 },
  { code: '45', name: 'Naâma', nameAr: 'النعامة', deliveryFee: 750 },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت', deliveryFee: 600 },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية', deliveryFee: 750 },
  { code: '48', name: 'Relizane', nameAr: 'غليزان', deliveryFee: 600 },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون', deliveryFee: 850 },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', deliveryFee: 1000 },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال', deliveryFee: 700 },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس', deliveryFee: 900 },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح', deliveryFee: 950 },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام', deliveryFee: 1000 },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت', deliveryFee: 750 },
  { code: '56', name: 'Djanet', nameAr: 'جانت', deliveryFee: 1000 },
  { code: '57', name: 'El M\'Ghair', nameAr: 'المغير', deliveryFee: 750 },
  { code: '58', name: 'El Menia', nameAr: 'المنيعة', deliveryFee: 800 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create wilayas
  console.log('📍 Creating wilayas...');
  for (const wilaya of wilayas) {
    await prisma.wilaya.upsert({
      where: { code: wilaya.code },
      update: wilaya,
      create: wilaya,
    });
  }
  console.log('✅ Created 58 wilayas');

  // Create super admin
  console.log('👤 Creating super admin...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rahba.dz';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!Change';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });
  
  console.log('✅ Created super admin:', adminEmail);
  console.log('🔑 Default password:', adminPassword);
  console.log('⚠️  Please change the password after first login!');

  // Create default settings
  console.log('⚙️  Creating default settings...');
  await prisma.setting.upsert({
    where: { key: 'platform_name' },
    update: {},
    create: {
      key: 'platform_name',
      value: { en: 'Rahba', ar: 'رحبة' },
      description: 'Platform name',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'trial_duration_days' },
    update: {},
    create: {
      key: 'trial_duration_days',
      value: 7,
      description: 'Trial period duration in days',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'trial_limits' },
    update: {},
    create: {
      key: 'trial_limits',
      value: { maxProducts: 10, maxOrders: 20 },
      description: 'Trial account limits',
    },
  });

  console.log('✅ Created default settings');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
