import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ---------- Create admin user ----------
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' }, // ✅ username is unique
    update: {},
    create: { username: 'admin', passwordHash: adminPasswordHash, role: 'ADMIN' },
  });

  // ---------- Create staff user ----------
  const staffPasswordHash = await bcrypt.hash('staff123', 12);
  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: { username: 'staff', passwordHash: staffPasswordHash, role: 'STAFF' },
  });

  console.log('✅ Users created:', { admin: admin.username, staff: staff.username });

  // ---------- Create sample sweets ----------
  const sweets = [
    { name: 'Gulab Jamun', price: 25, stock: 100, description: 'Traditional milk solid dumplings soaked in sugar syrup' },
    { name: 'Rasgulla', price: 20, stock: 80, description: 'Soft spongy cottage cheese balls in light sugar syrup' },
    { name: 'Kaju Katli', price: 50, stock: 50, description: 'Diamond-shaped cashew fudge with silver foil' },
    { name: 'Jalebi', price: 30, stock: 75, description: 'Crispy orange spirals soaked in sugar syrup' },
    { name: 'Laddu', price: 15, stock: 120, description: 'Traditional round sweet made from gram flour' },
    { name: 'Barfi', price: 35, stock: 60, description: 'Dense milk-based confection in various flavors' },
    { name: 'Mysore Pak', price: 40, stock: 45, description: 'Rich ghee-based sweet from Karnataka' },
    { name: 'Sandesh', price: 25, stock: 70, description: 'Bengali cottage cheese sweet delicacy' },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name }, // ✅ name is unique
      update: { price: sweet.price, stock: sweet.stock, description: sweet.description },
      create: sweet,
    });
  }

  console.log('✅ Sample sweets created');

  // ---------- Create a sample order ----------
  const gulabJamun = await prisma.sweet.findFirst({ where: { name: 'Gulab Jamun' } });
  const kajuKatli = await prisma.sweet.findFirst({ where: { name: 'Kaju Katli' } });

  if (!gulabJamun || !kajuKatli) throw new Error('Required sweets not found');

  const sampleOrder = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      totalPrice: gulabJamun.price * 2 + kajuKatli.price,
      items: {
        create: [
          { sweetId: gulabJamun.id, quantity: 2, price: gulabJamun.price * 2 },
          { sweetId: kajuKatli.id, quantity: 1, price: kajuKatli.price },
        ],
      },
    },
    include: { items: { include: { sweet: true } } },
  });

  console.log('✅ Sample order created:', sampleOrder.id);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    //process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
