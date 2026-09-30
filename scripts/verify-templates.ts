import { prisma } from '../src/lib/prisma'

async function verify() {
  console.log('--- STARTING AUTOMATED TEMPLATE SWITCHING VERIFICATION ---')

  const slug = 'budi-ani'
  const url = `http://localhost:3000/invitation/${slug}?to=Budi+Hartono`

  // 1. Test TEMPLATE_B
  console.log('\n[1/3] Setting couple selectedTemplate -> TEMPLATE_B in PostgreSQL...')
  await prisma.couple.update({
    where: { slug },
    data: { selectedTemplate: 'TEMPLATE_B' },
  })

  console.log(`Fetching ${url} ...`)
  const resB = await fetch(url, { cache: 'no-store' })
  if (!resB.ok) {
    throw new Error(`Failed to fetch HTTP ${resB.status}: ${resB.statusText}`)
  }
  const htmlB = await resB.text()

  const hasTemplateB = htmlB.includes('data-template="TEMPLATE_B"')
  console.log(`Checking data-template="TEMPLATE_B": ${hasTemplateB ? '✅ FOUND' : '❌ NOT FOUND'}`)
  if (!hasTemplateB) {
    throw new Error('Verification failed: data-template="TEMPLATE_B" was not rendered in HTML response!')
  }

  // 2. Test TEMPLATE_C
  console.log('\n[2/3] Setting couple selectedTemplate -> TEMPLATE_C in PostgreSQL...')
  await prisma.couple.update({
    where: { slug },
    data: { selectedTemplate: 'TEMPLATE_C' },
  })

  console.log(`Fetching ${url} ...`)
  const resC = await fetch(url, { cache: 'no-store' })
  if (!resC.ok) {
    throw new Error(`Failed to fetch HTTP ${resC.status}: ${resC.statusText}`)
  }
  const htmlC = await resC.text()

  const hasTemplateC = htmlC.includes('data-template="TEMPLATE_C"')
  console.log(`Checking data-template="TEMPLATE_C": ${hasTemplateC ? '✅ FOUND' : '❌ NOT FOUND'}`)
  if (!hasTemplateC) {
    throw new Error('Verification failed: data-template="TEMPLATE_C" was not rendered in HTML response!')
  }

  // 3. Restore to TEMPLATE_A
  console.log('\n[3/3] Restoring couple selectedTemplate -> TEMPLATE_A in PostgreSQL...')
  await prisma.couple.update({
    where: { slug },
    data: { selectedTemplate: 'TEMPLATE_A' },
  })

  console.log(`Fetching ${url} ...`)
  const resA = await fetch(url, { cache: 'no-store' })
  const htmlA = await resA.text()
  const hasTemplateA = htmlA.includes('data-template="TEMPLATE_A"')
  console.log(`Checking data-template="TEMPLATE_A": ${hasTemplateA ? '✅ FOUND' : '❌ NOT FOUND'}`)
  if (!hasTemplateA) {
    throw new Error('Verification failed: data-template="TEMPLATE_A" was not rendered in HTML response!')
  }

  console.log('\n🎉 ALL TEMPLATE SWITCHING VERIFICATIONS PASSED SUCCESSFULLY!')
}

verify()
  .catch((err) => {
    console.error('❌ Verification Error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
