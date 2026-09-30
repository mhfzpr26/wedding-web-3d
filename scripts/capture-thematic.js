import { chromium } from 'playwright'

async function capture() {
  console.log('Launching browser via Playwright...')
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })

  // 1. Mobile viewport capture (iPhone 14: 390x844)
  console.log('Capturing mobile thematic layers...')
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto('http://localhost:3000/invitation/budi-ani?to=Budi+Hartono', {
    waitUntil: 'networkidle',
  })

  // Wait for 3D envelope and click to unbox
  await mobilePage.waitForTimeout(3000)
  await mobilePage.click('button:has-text("Ketuk segel")')
  await mobilePage.waitForTimeout(2200)

  // Capture Act 01: Sacral Arch Decree Tablet
  await mobilePage.screenshot({ path: 'scripts/thematic-act01-mobile.png' })
  console.log('Saved scripts/thematic-act01-mobile.png')

  // Scroll to Act 02: Cameo Portrait Medallions
  await mobilePage.mouse.wheel(0, 300)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'scripts/thematic-act02-mobile.png' })
  console.log('Saved scripts/thematic-act02-mobile.png')

  // Scroll to Act 03: VIP Royal Event Pass
  await mobilePage.mouse.wheel(0, 300)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'scripts/thematic-act03-mobile.png' })
  console.log('Saved scripts/thematic-act03-mobile.png')

  // Scroll to Act 04: Gift Pouch
  await mobilePage.mouse.wheel(0, 300)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'scripts/thematic-act04-mobile.png' })
  console.log('Saved scripts/thematic-act04-mobile.png')

  // Scroll to Act 05: RSVP Postcard
  await mobilePage.mouse.wheel(0, 300)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'scripts/thematic-act05-mobile.png' })
  console.log('Saved scripts/thematic-act05-mobile.png')

  // Scroll to Act 06: Guestbook Wax Seal
  await mobilePage.mouse.wheel(0, 300)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'scripts/thematic-act06-mobile.png' })
  console.log('Saved scripts/thematic-act06-mobile.png')

  // 2. Desktop viewport capture (1280x800)
  console.log('Capturing desktop responsive view...')
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5,
  })
  const desktopPage = await desktopContext.newPage()
  await desktopPage.goto('http://localhost:3000/invitation/budi-ani?to=Budi+Hartono', {
    waitUntil: 'networkidle',
  })
  await desktopPage.waitForTimeout(3000)
  await desktopPage.click('button:has-text("Ketuk segel")')
  await desktopPage.waitForTimeout(2200)

  // Capture Act 01 Desktop
  await desktopPage.screenshot({ path: 'scripts/thematic-act01-desktop.png' })
  console.log('Saved scripts/thematic-act01-desktop.png')

  // Scroll to Act 03 Desktop
  await desktopPage.mouse.wheel(0, 300)
  await desktopPage.waitForTimeout(800)
  await desktopPage.mouse.wheel(0, 300)
  await desktopPage.waitForTimeout(1000)
  await desktopPage.screenshot({ path: 'scripts/thematic-act03-desktop.png' })
  console.log('Saved scripts/thematic-act03-desktop.png')

  await browser.close()
  console.log('All thematic screenshots captured successfully!')
}

capture().catch((err) => {
  console.error('Capture error:', err)
  process.exit(1)
})
