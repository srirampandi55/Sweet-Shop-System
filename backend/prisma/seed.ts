import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // Create staff user
  const staffPasswordHash = await bcrypt.hash('staff123', 12);
  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      passwordHash: staffPasswordHash,
      role: 'STAFF',
    },
  });

  console.log('✅ Users created:', { admin: admin.username, staff: staff.username });

  // Create sample sweets
  const sweets = [
    {
      name: 'Gulab Jamun',
      price: 25.0,
      stock: 100,
      description: 'Traditional milk solid dumplings soaked in sugar syrup',
    },
    {
      name: 'Rasgulla',
      price: 20.0,
      stock: 80,
      description: 'Soft spongy cottage cheese balls in light sugar syrup',
    },
    {
      name: 'Kaju Katli',
      price: 50.0,
      stock: 50,
      description: 'Diamond-shaped cashew fudge with silver foil',
    },
    {
      name: 'Jalebi',
      price: 30.0,
      stock: 75,
      description: 'Crispy orange spirals soaked in sugar syrup',
    },
    {
      name: 'Laddu',
      price: 15.0,
      stock: 120,
      description: 'Traditional round sweet made from gram flour',
    },
    {
      name: 'Barfi',
      price: 35.0,
      stock: 60,
      description: 'Dense milk-based confection in various flavors',
    },
    {
      name: 'Mysore Pak',
      price: 40.0,
      stock: 45,
      description: 'Rich ghee-based sweet from Karnataka',
    },
    {
      name: 'Sandesh',
      price: 25.0,
      stock: 70,
      description: 'Bengali cottage cheese sweet delicacy',
    },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: sweet,
      create: sweet,
    });
  }

  console.log('✅ Sample sweets created');

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      customerName: 'John Doe',
      totalPrice: 95.0,
      items: {
        create: [
          {
            sweetId: (await prisma.sweet.findFirst({ where: { name: 'Gulab Jamun' } }))!.id,
            quantity: 2,
            price: 50.0,
          },
          {
            sweetId: (await prisma.sweet.findFirst({ where: { name: 'Kaju Katli' } }))!.id,
            quantity: 1,
            price: 50.0,
          },
        ],
      },
    },
    include: {
      items: {
        include: {
          sweet: true,
        },
      },
    },
  });

  console.log('✅ Sample order created:', sampleOrder.id);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
