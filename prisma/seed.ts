import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding wedding database...')

  // 0. Create or update default AdminUser
  const passwordHash = await bcrypt.hash('adminpassword123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@wedding.com' },
    update: { passwordHash },
    create: {
      email: 'admin@wedding.com',
      passwordHash,
    },
  })
  console.log('Admin user ready: admin@wedding.com / adminpassword123')

  // 1. Create or update couple
  const couple = await prisma.couple.upsert({
    where: { slug: 'budi-ani' },
    update: {},
    create: {
      slug: 'budi-ani',
      brideName: 'dr. Anindya Putri Rahayu',
      groomName: 'Budi Santoso, S.T.',
      brideParents: 'Putri pertama dari Bpk. Ir. Hendro Prabowo & Ibu Sri Wahyuni',
      groomParents: 'Putra kedua dari Bpk. Drs. Agus Susanto & Ibu Hj. Siti Fatimah',
      brideInstagram: 'anindyaputri',
      groomInstagram: 'budisantoso',
      openingQuoteTitle: 'Ar-Rum: 21',
      openingQuoteText:
        'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      closingMessage:
        'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai. Atas kehadiran dan doa restunya kami ucapkan terima kasih.',
      coverPhotoUrl:
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      groomPhotoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      bridePhotoUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      closingPhotoUrl:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      backgroundMusicUrl: '/audio/romantic-wedding.mp3',
      dressCodeDesc: 'Formal & Batik Modern (Earth Tone / Champagne Gold)',
      dressCodeColors: ['#1B2A4A', '#8C7851', '#D4AF37', '#F4F1EA'],
      selectedTemplate: 'TEMPLATE_A',
    },
  })

  // 2. Events
  await prisma.event.deleteMany({ where: { coupleId: couple.id } })
  await prisma.event.createMany({
    data: [
      {
        coupleId: couple.id,
        title: 'Akad Nikah',
        startTime: new Date('2026-10-24T08:00:00+07:00'),
        endTime: new Date('2026-10-24T10:00:00+07:00'),
        locationName: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru, Jakarta Selatan',
        mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar',
        sortOrder: 1,
      },
      {
        coupleId: couple.id,
        title: 'Resepsi Pernikahan',
        startTime: new Date('2026-10-24T11:00:00+07:00'),
        endTime: new Date('2026-10-24T14:00:00+07:00'),
        locationName: 'Grand Ballroom Hotel Mulia Senayan',
        address: 'Jl. Asia Afrika, Gelora, Tanah Abang, Jakarta Pusat',
        mapsUrl: 'https://maps.google.com/?q=Hotel+Mulia+Senayan',
        sortOrder: 2,
      },
    ],
  })

  // 3. Bank Accounts
  await prisma.bankAccount.deleteMany({ where: { coupleId: couple.id } })
  await prisma.bankAccount.createMany({
    data: [
      {
        coupleId: couple.id,
        bankName: 'BCA',
        accountNumber: '8820192831',
        accountHolder: 'Budi Santoso',
        qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Budi-Santoso-Wedding-Gift',
        sortOrder: 1,
      },
      {
        coupleId: couple.id,
        bankName: 'Bank Mandiri',
        accountNumber: '1370019283741',
        accountHolder: 'Anindya Putri Rahayu',
        qrisImageUrl: null,
        sortOrder: 2,
      },
    ],
  })

  // 4. Guests
  const guest1 = await prisma.guest.upsert({
    where: {
      coupleId_slug: {
        coupleId: couple.id,
        slug: 'budi-hartono',
      },
    },
    update: {},
    create: {
      coupleId: couple.id,
      name: 'Budi Hartono',
      slug: 'budi-hartono',
      phoneNumber: '08123456789',
      isOpened: false,
      statusRsvp: 'PENDING',
      attendeesCount: 1,
    },
  })

  const guest2 = await prisma.guest.upsert({
    where: {
      coupleId_slug: {
        coupleId: couple.id,
        slug: 'nama-tamu',
      },
    },
    update: {},
    create: {
      coupleId: couple.id,
      name: 'Nama Tamu',
      slug: 'nama-tamu',
      phoneNumber: '08987654321',
      isOpened: false,
      statusRsvp: 'PENDING',
      attendeesCount: 1,
    },
  })

  // 5. Wishes
  await prisma.wish.deleteMany({ where: { coupleId: couple.id } })
  await prisma.wish.createMany({
    data: [
      {
        coupleId: couple.id,
        guestId: guest1.id,
        senderName: 'Budi Hartono & Keluarga',
        message: 'Selamat menempuh hidup baru Budi dan Anin! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      },
      {
        coupleId: couple.id,
        guestId: null,
        senderName: 'Nadia Salsabila',
        message: 'Happy wedding dear Anindya! Semoga bahagia selalu bersama suami sampai kakek nenek, aamiin ya rabbal alamin.',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
