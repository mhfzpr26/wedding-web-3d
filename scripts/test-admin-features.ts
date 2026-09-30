import { login } from '../src/actions/auth'
import { createGuest, deleteGuest, getGuests } from '../src/actions/guests'
import { updateCoupleSettings } from '../src/actions/admin'
import { prisma } from '../src/lib/prisma'

async function testAdminFeatures() {
  console.log('--- TESTING ADMIN PANEL FEATURES ---')

  // 1. Test Login
  console.log('\n[1] Testing Auth Login Action...')
  const formData = new FormData()
  formData.append('email', 'admin@wedding.com')
  formData.append('password', 'adminpassword123')

  const loginRes = await login(formData)
  console.log('Login Response:', loginRes)
  if (!loginRes.success) {
    throw new Error('Login failed with valid credentials!')
  }

  // 2. Test Guest Creation
  console.log('\n[2] Testing Guest CRUD Actions...')
  const couple = await prisma.couple.findFirst()
  if (!couple) throw new Error('Couple not found')

  const createRes = await createGuest({
    coupleId: couple.id,
    name: 'Tamu Eksklusif VIP',
    phoneNumber: '081299998888',
  })
  console.log('Create Guest Response:', createRes)
  if (!createRes.success || !createRes.data) {
    throw new Error('Create guest failed')
  }

  // Verify guest in DB
  const guestsList = await getGuests(couple.id)
  console.log(`Total guests in DB: ${guestsList.data.length}`)

  // 3. Test Settings Update
  console.log('\n[3] Testing updateCoupleSettings...')
  const updateRes = await updateCoupleSettings({
    coupleId: couple.id,
    selectedTemplate: 'TEMPLATE_A',
    groomName: couple.groomName,
    brideName: couple.brideName,
    groomParents: couple.groomParents,
    brideParents: couple.brideParents,
    isPhotolessMode: false,
    coverPhotoUrl: couple.coverPhotoUrl,
    videoUrl: couple.videoUrl,
  })
  console.log('Update Settings Response:', updateRes)
  if (!updateRes.success) {
    throw new Error('Update settings failed')
  }

  // 4. Test Clean Up Created Test Guest
  console.log('\n[4] Cleaning up test guest...')
  const deleteRes = await deleteGuest(createRes.data.id)
  console.log('Delete Guest Response:', deleteRes)

  console.log('\n🎉 ALL ADMIN FEATURES TESTED AND PASSED SUCCESSFULLY!')
}

testAdminFeatures()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
