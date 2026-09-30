import { chromium } from 'playwright'

async function capture() {
  console.log('Launching browser via Playwright...')
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })

  // 1. Mobile viewport capture (iPhone 14 / modern smartphone)
  console.log('Capturing mobile view (390x844)...')
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto('http://localhost:3000/invitation/budi-ani?to=Budi+Hartono', {
    waitUntil: 'networkidle',
  })

  // Wait 3.5s for WebGL 3D envelope to compile shaders and render
  await mobilePage.waitForTimeout(3500)
  await mobilePage.screenshot({ path: 'scripts/envelope-mobile.png' })
  console.log('Saved scripts/envelope-mobile.png (Midnight Navy)')

  // 2. Click Burgundy color dot to capture Burgundy theme
  console.log('Switching to Burgundy theme...')
  const burgundyBtn = await mobilePage.$('button[aria-label="Royal Burgundy"]')
  if (burgundyBtn) {
    await burgundyBtn.click()
    await mobilePage.waitForTimeout(800)
    await mobilePage.screenshot({ path: 'scripts/envelope-burgundy.png' })
    console.log('Saved scripts/envelope-burgundy.png')
  }

  // 3. Desktop viewport capture (1280x800)
  console.log('Capturing desktop view (1280x800)...')
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5,
  })
  const desktopPage = await desktopContext.newPage()
  await desktopPage.goto('http://localhost:3000/invitation/budi-ani?to=Budi+Hartono', {
    waitUntil: 'networkidle',
  })
  await desktopPage.waitForTimeout(3500)
  await desktopPage.screenshot({ path: 'scripts/envelope-desktop.png' })
  console.log('Saved scripts/envelope-desktop.png')

  // 4. Click wax seal to test unboxing
  console.log('Clicking wax seal to trigger unboxing...')
  await desktopPage.click('button:has-text("Ketuk segel")')
  await desktopPage.waitForTimeout(2200)
  await desktopPage.screenshot({ path: 'scripts/envelope-unboxed.png' })
  console.log('Saved scripts/envelope-unboxed.png')

  await browser.close()
  console.log('All screenshots captured successfully!')
}

capture().catch((err) => {
  console.error('Capture error:', err)
  process.exit(1)
})
