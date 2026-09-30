## 1. Project Overview & Core Philosophy
A modern, mobile-first digital wedding invitation web app built on a single fullstack Next.js ecosystem. 
- **Editorial Storytelling:** Photos are integrated naturally into the narrative flow (Cover, Couple Profile, Closing) with intentional visual pacing—avoiding cluttered standalone photo galleries.
- **Photoless & Videoless Mode:** Fully supports privacy-first or minimalist aesthetic where missing photos/videos gracefully fallback to elegant serif typography, vector arch lines, and 3D monogram initials.
- **Unified Data Contract:** All 3 templates share the exact same content schema. An admin fills one single form, and the invitation can switch between templates instantly without data loss.

---

## 2. Tech Stack & Dependencies

- **Framework:** Next.js (App Router, Server Actions)
- **Language:** TypeScript (Strict mode)
- **Styling & UI:** Tailwind CSS, Framer Motion, Lucide React, Sonner (Toast notifications)
- **3D Graphics:** React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js
- **Animation Strategy:** Framer Motion for 2D UI; R3F native `useFrame` + `MathUtils.damp` for 3D interactions. **No GSAP** to keep bundle size minimal.
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Media Storage:** Supabase Storage (for optional photos, audio .mp3, and 3D .glb assets)

---

## 3. Folder & Architecture Structure

```text
├── SPEC.md
├── prisma/
│   └── schema.prisma
├── public/
│   ├── models/                  # Compressed 3D models (< 1.5 MB .glb)
│   ├── audio/                   # Default background audio (.mp3)
│   └── images/                  # Fallback vector ornaments & static assets
├── src/
│   ├── app/
│   │   ├── (public)/            # Public guest view (Mobile-first, isolated bundle)
│   │   │   └── invitation/
│   │   │       └── [slug]/
│   │   │           ├── page.tsx # Server Component: fetch couple & guest data
│   │   │           └── loading.tsx
│   │   ├── (admin)/             # Protected admin dashboard
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx     # Dashboard summary (RSVP stats, guest counts)
│   │   │       ├── guests/      # Guest list CRUD & WhatsApp link generator
│   │   │       ├── content/     # Single form editor (profile, events, media URLs)
│   │   │       └── login/       # Admin authentication
│   │   ├── layout.tsx           # Root layout (Fonts, Toaster provider)
│   │   └── globals.css          # Tailwind base styling
│   │
│   ├── actions/                 # Server Actions (Mutations & Business Logic)
│   │   ├── rsvp.ts              # Submit RSVP (verifies locked guest identity)
│   │   ├── wishes.ts            # Post wish/greeting
│   │   └── admin.ts             # Admin mutations (content, guests, template toggle)
│   │
│   ├── components/
│   │   ├── three/               # WebGL / 3D Components (Client Components only)
│   │   │   ├── CanvasWrapper.tsx# Dynamic import wrapper (ssr: false)
│   │   │   ├── Envelope3D.tsx   # Template A: Wax seal / envelope open
│   │   │   ├── CardTilt3D.tsx   # Template B: Interactive card tilt / rings
│   │   │   └── BookFold3D.tsx   # Template C: Folding card transition
│   │   │
│   │   ├── templates/           # 3 Visual Skins (Same props, different layouts)
│   │   │   ├── TemplateA/       # Soft Arch & Botanical
│   │   │   ├── TemplateB/       # Contemporary Editorial Minimalist
│   │   │   └── TemplateC/       # Frosted Glass & Muted Tone
│   │   │
│   │   ├── shared/              # Reusable logic across all templates
│   │   │   ├── AudioPlayer.tsx  # Floating audio button with play/pause
│   │   │   ├── Countdown.tsx    # Live countdown timer
│   │   │   ├── VideoPlayer.tsx  # Responsive YouTube/Vimeo/Cloud embed
│   │   │   ├── RsvpForm.tsx     # Locked guest identity RSVP form
│   │   │   ├── WishesFeed.tsx   # Live list of wishes and prayers
│   │   │   └── GiftCard.tsx     # Bank details, 1-click copy toast, QRIS modal
│   │   │
│   │   └── ui/                  # Atomic UI primitives (Button, Input, Modal)
│   │
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── supabase.ts          # Supabase client SDK
│   │   └── utils.ts             # Date formatting & class merger (clsx/tailwind-merge)
│   │
│   └── types/
│       └── index.ts             # Unified props interface & Prisma types re-export

```

---

## 4. Unified Data Schema (Prisma Models Preview)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TemplateType {
  TEMPLATE_A // Soft Arch & Botanical
  TEMPLATE_B // Contemporary Editorial
  TEMPLATE_C // Frosted Glass & Muted Tone
}

enum RsvpStatus {
  PENDING
  ATTENDING
  DECLINED
}

model AdminUser {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("admin_users")
}

model Couple {
  id                 String       @id @default(uuid())
  slug               String       @unique // e.g. "budi-ani"
  brideName          String       @map("bride_name")
  groomName          String       @map("groom_name")
  brideParents       String?      @map("bride_parents")
  groomParents       String?      @map("groom_parents")
  brideInstagram     String?      @map("bride_instagram")
  groomInstagram     String?      @map("groom_instagram")

  // Narrative Quotes
  openingQuoteTitle  String?      @map("opening_quote_title")
  openingQuoteText   String?      @db.Text @map("opening_quote_text")
  closingMessage     String?      @db.Text @map("closing_message")

  // Optional Media (Nullable for Photoless/Videoless mode)
  coverPhotoUrl      String?      @map("cover_photo_url")
  groomPhotoUrl      String?      @map("groom_photo_url")
  bridePhotoUrl      String?      @map("bride_photo_url")
  closingPhotoUrl    String?      @map("closing_photo_url")
  videoUrl           String?      @map("video_url") // YouTube embed or direct MP4
  backgroundMusicUrl String?      @map("background_music_url")

  // Styling & Theme Selection
  dressCodeDesc      String?      @map("dress_code_desc")
  dressCodeColors    String[]     @default([]) @map("dress_code_colors") // ["#1B2A4A", "#F4F1EA"]
  selectedTemplate   TemplateType @default(TEMPLATE_A) @map("selected_template")

  events             Event[]
  bankAccounts       BankAccount[]
  guests             Guest[]
  wishes             Wish[]

  createdAt          DateTime     @default(now()) @map("created_at")
  updatedAt          DateTime     @updatedAt @map("updated_at")

  @@map("couples")
}

model Event {
  id           String   @id @default(uuid())
  coupleId     String   @map("couple_id")
  title        String   // "Akad Nikah", "Resepsi"
  startTime    DateTime @map("start_time")
  endTime      DateTime? @map("end_time")
  locationName String   @map("location_name")
  address      String   @db.Text
  mapsUrl      String?  @map("maps_url")
  sortOrder    Int      @default(0) @map("sort_order")

  couple       Couple   @relation(fields: [coupleId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@index([coupleId])
  @@map("events")
}

model BankAccount {
  id            String   @id @default(uuid())
  coupleId      String   @map("couple_id")
  bankName      String   @map("bank_name") // "BCA", "Mandiri", "BRI"
  accountNumber String   @map("account_number")
  accountHolder String   @map("account_holder")
  qrisImageUrl  String?  @map("qris_image_url")
  sortOrder     Int      @default(0) @map("sort_order")

  couple        Couple   @relation(fields: [coupleId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@index([coupleId])
  @@map("bank_accounts")
}

model Guest {
  id             String     @id @default(uuid())
  coupleId       String     @map("couple_id")
  name           String     // Recipient name
  slug           String     // URL slug: "budi-hartono"
  phoneNumber    String?    @map("phone_number")
  isOpened       Boolean    @default(false) @map("is_opened")
  statusRsvp     RsvpStatus @default(PENDING) @map("status_rsvp")
  attendeesCount Int        @default(1) @map("attendees_count")

  couple         Couple     @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  wishes         Wish[]

  createdAt      DateTime   @default(now()) @map("created_at")
  updatedAt      DateTime   @updatedAt @map("updated_at")

  @@unique([coupleId, slug])
  @@index([coupleId])
  @@map("guests")
}

model Wish {
  id         String   @id @default(uuid())
  coupleId   String   @map("couple_id")
  guestId    String?  @map("guest_id") // Nullable if posted from generic public link
  senderName String   @map("sender_name")
  message    String   @db.Text

  couple     Couple   @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  guest      Guest?   @relation(fields: [guestId], references: [id], onDelete: SetNull)

  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@index([coupleId])
  @@index([guestId])
  @@map("wishes")
}

```

---

## 5. The 8 Sequential Content Sections & Visual Pacing

All 3 templates render these exact 8 sections in strict alternating visual rhythm:

1. **Section 1 - Cover / Hero (Visual Anchor):**
* Recipient personalization (`?to=Nama+Tamu`).
* "Buka Undangan" trigger button.
* *Fallback:* Shows `coverPhotoUrl` if present; otherwise renders an elegant 3D monogram initial or serif typography lockup.


2. **Section 2 - Opening Quote & Salam (Clean / Quiet):**
* Spiritual quote / romantic verse.
* Strictly pure typography and clean whitespace (never covered with background photos).


3. **Section 3 - Couple Profile (Visual Anchor):**
* Groom & Bride bio, parents' names, Instagram links.
* *Fallback:* Shows `groomPhotoUrl` & `bridePhotoUrl` if present; otherwise displays framed monogram initial badges.


4. **Section 4 - Event Details & Countdown (Clean / Informational):**
* Real-time countdown timer to the main event date.
* Akad & Resepsi cards, time, address, "Google Maps" & "Google Calendar" buttons.
* Clean card styling to maximize readability.


5. **Section 5 - Prewedding Video (Media Centerpiece - Optional):**
* Embedded responsive video player (YouTube/Vimeo/direct MP4).
* *Behavior:* If `couple.videoUrl` is null/empty, this section is completely unmounted with zero layout gap.


6. **Section 6 - Digital Gift / Amplop Digital (Clean / Functional):**
* Bank accounts with 1-click copy + toast feedback notification.
* QRIS modal viewer.


7. **Section 7 - RSVP & Wishes Feed (Clean / Functional):**
* Locked identity RSVP form.
* Real-time guest messages and wishes stream.


8. **Section 8 - Closing & Gratitude (Visual Anchor):**
* Warm closing statement from both families.
* *Fallback:* Warm candid photo (`closingPhotoUrl`) if present; otherwise an ornamental vector divider.



---

## 6. The 3 Visual Template Specifications

* **Template A (Soft Arch & Botanical):**
* Card shape: Domed arch cards (`rounded-t-full` / arch SVG masking).
* Palette: Soft ivory, warm beige, deep navy, champagne gold accents.
* 3D Element: 3D wax seal unsealing on open, subtle floating leaf/petal particles.


* **Template B (Contemporary Editorial):**
* Card shape: Sharp, clean rectangular borders, expansive whitespace, high contrast.
* Palette: Warm monochrome, charcoal, warm stone, and stark black.
* 3D Element: Interactive 3D card tilt based on mouse/mobile gyroscope or 3D wedding rings.


* **Template C (Frosted Glass & Muted Tone):**
* Card shape: Soft rounded cards with `backdrop-blur-md` and frosted border lines.
* Palette: Muted slate blue, sage green, and warm sand.
* 3D Element: 3D folding card flip transition on initial unlock.



---

## 7. Business Logic & Security Rules

1. **Locked Guest Identity (RSVP & Wishes):**
* When accessed via personalized link (`/invitation/[slug]?to=Budi+Hartono`):
* Guest name is automatically populated and set to `readOnly` in both RSVP and Wishes forms.
* The Next.js Server Action verifies `guest_id` directly against the database `Guest` record, ignoring client-side name tampering.


* When accessed via generic link (without `to` param):
* Name field remains editable; `guestId` defaults to `null`.




2. **Audio Autoplay Compliance:**
* Audio is strictly initialized inside the click event handler of the "Buka Undangan" button to guarantee autoplay permission across mobile Safari and Chrome.


3. **WebGL Lifecycle & Performance:**
* 3D Canvas components must be loaded via `next/dynamic` with `{ ssr: false }`.
* Once the opening sequence finishes and the user scrolls into the narrative sections, the 3D Canvas should be paused or unmounted to release mobile GPU/RAM.



---

## 8. Development Instructions for AI Agent

1. **Mobile Viewport Priority:** Always build and test Tailwind classes against `360px - 430px` screen widths before desktop adjustments.
2. **Decoupled Architecture:** Do not hardcode form logic inside template folders. All RSVP, audio, and gift logic must live inside `src/components/shared/` and be imported into templates.
3. **Strict Type Safety:** Use types directly from `@prisma/client` (`Couple`, `Guest`, `Event`, `Wish`).
4. **Step-by-step Execution:** Never execute the whole project in one prompt. Build incrementally: (1) Prisma & DB, (2) Shared components & mock data, (3) Template A layout, (4) 3D opening interaction, (5) Server Actions & Admin panel.
