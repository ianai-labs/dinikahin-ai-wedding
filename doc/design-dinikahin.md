# Dinikahin.com — Design Documentation

> **AI Wedding Consultant** — Platform konsultasi venue pernikahan berbasis AI untuk calon pengantin Indonesia.

**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Tech Stack:** Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI + Firebase + Zustand + Gemini 2.5 Flash

---

## Brand Identity

| Element | Value |
|---------|-------|
| **Brand Name** | dinikahin.com |
| **Tagline** | "Temukan venue impianmu dengan bantuan AI" |
| **AI Character** | "Kana" — asisten ramah, hangat, Bahasa Indonesia semi-formal |
| **Personality** | Profesional namun bersahabat, seperti teman yang paham pernikahan |

---

## Color Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Primary Gold** | `#C9A84C` | `42 58% 54%` | CTAs, badges, brand accents |
| **Primary Dark** | `#A8892F` | `39 48% 42%` | Hover states, active elements |
| **Primary Light** | `#E8D5B7` | `40 40% 81%` | Subtle backgrounds, highlights |
| **Secondary Rose** | `#D43F6F` | `340 75% 47%` | Highlights, romantic accents |
| **Accent Navy** | `#0A1E3D` | `221 89% 20%` | Trust elements, footer, dark sections |
| **Background** | `#FFFCF5` | `42 100% 98%` | Page background (warm cream) |
| **Foreground** | `#1C1917` | `24 10% 10%` | Primary text (warm dark) |
| **Muted** | `#78716C` | `24 5% 45%` | Secondary text, captions |
| **Border** | `#E7E5E4` | `24 6% 90%` | Dividers, card borders |

### Score Colors
| Range | Hex | Meaning |
|-------|-----|---------|
| **80–100%** | `#16A34A` | Sangat cocok |
| **50–79%** | `#E68A2E` | Cukup cocok |
| **<50%** | `#DC2626` | Kurang cocok |

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Hero Heading** | Playfair Display | Bold (700) | 3.5rem / 56px |
| **Section Heading** | Playfair Display | SemiBold (600) | 2.25rem / 36px |
| **Card Heading** | Inter | SemiBold (600) | 1.5rem / 24px |
| **Sub-section** | Inter | Medium (500) | 1.25rem / 20px |
| **Body** | Inter | Regular (400) | 1rem / 16px |
| **Body Small** | Inter | Regular (400) | 0.875rem / 14px |
| **Caption** | Inter | Regular (400) | 0.75rem / 12px |
| **Button** | Inter | Medium (500) | 0.875rem / 14px |

---

## Routes

| Route | Page | Layout | Auth Required |
|-------|------|--------|---------------|
| `/` | Landing Page | MarketingLayout | No |
| `/chat` | AI Consultation Chat | ChatLayout | Guest OK |
| `/venues/[slug]` | Venue Detail | ChatLayout | Guest OK |
| `/compare?ids=...` | Venue Comparison | ChatLayout | Guest OK |
| `/summary` | Consultation Summary | ChatLayout | Guest OK |
| `/lead` | Lead Submission Form | ChatLayout | Guest OK |
| `/auth/login` | Login / Register | AuthLayout | Redirect if logged in |
| `/admin` | Admin Dashboard | AdminLayout | Partner only |
| `/admin/leads` | Lead Management | AdminLayout | Partner only |

---

## Responsive Layout Strategy

```
Mobile (<640px)          Tablet (640-1024px)         Desktop (>1024px)
┌──────────────┐         ┌──────┬─────────┐         ┌──────┬──────────────┐
│              │         │      │         │         │      │              │
│  Chat Full   │         │ Chat │ Sidebar │         │ Chat │   Sidebar    │
│   Screen     │         │ 60%  │   40%   │         │ 50%  │     50%      │
│              │         │      │         │         │      │              │
│  [Sheet ↩]   │         │      │         │         │      │              │
└──────────────┘         └──────┴─────────┘         └──────┴──────────────┘
```

---

## Component Architecture

```
<RootLayout>
  <Providers>                              // Auth + Theme + Toast
  │
  ├── <MarketingLayout>                    // Route group: (marketing)
  │   ├── <Header />                       // Logo, nav, "Masuk" button
  │   ├── <HeroSection />                  // Headline + CTA "Mulai Konsultasi"
  │   ├── <FeatureCards />                 // 3 kartu fitur unggulan
  │   ├── <HowItWorks />                   // 4 langkah proses
  │   ├── <TestimonialCarousel />          // Testimoni pengguna
  │   ├── <CTASection />                   // Final CTA band
  │   └── <Footer />                       // Link, sosial media, copyright
  │
  ├── <ChatLayout>                         // Route group: (chat)
  │   ├── <ChatWindow>
  │   │   ├── <ChatWelcomeScreen />        // "Halo! Saya Kana..."
  │   │   ├── <MessageList>
  │   │   │   ├── <MessageBubble />        // user | ai variant
  │   │   │   │   └── <VenueCardMini />    // inside AI bubble
  │   │   │   └── <TypingIndicator />      // "Kana sedang mengetik..."
  │   │   ├── <RequirementProgressBar />   // 0-100% completeness
  │   │   ├── <FeedbackButtons />          // After recommendations
  │   │   └── <ChatInput />                // Text input + send
  │   └── <ChatSidebar />                  // Desktop panel | Mobile Sheet
  │
  └── <AdminLayout>                        // Route group: admin
      ├── <AdminSidebar />                 // Nav links
      ├── <AdminHeader />                  // User info + logout
      ├── <StatsOverview />                // Metric cards
      ├── <FilterBar />                    // Status filter
      ├── <LeadsTable />                   // Lead data
      │   └── <LeadDetailModal />          // Full lead detail
      └── <StatusBadge />                  // pending|contacted|converted|lost
</Providers>
```

---

## State Management

| Concern | Solution | Reason |
|---------|----------|--------|
| **Auth** | React Context (`AuthProvider`) | Firebase `onAuthStateChanged` observer, needed globally |
| **Chat** | Zustand (`chatStore`) | High-frequency streaming, selector-based subscriptions |
| **Recommendations** | Zustand (`recommendationStore`) | Complex scoring state, decoupled from chat |
| **UI** | Zustand (`uiStore`) | Sidebar, modals, mobile state — lightweight |

---

## Data Flow

```
User Message → chatStore.sendMessage()
  → Optimistic UI update
  → POST /api/chat (Gemini SSE streaming)
  → Progressive chunk rendering
  → On complete: extract requirements, update completeness score
  → Sync to Firestore (conversations doc)

3 Mandatory Fields Complete (budget, location, guest_count)
  → "Lihat Rekomendasi" trigger button
  → POST /api/recommendations
  → Scoring Engine (budget 35% + capacity 30% + location 20% + style 10% + special 5%)
  → Ranked venues + vendor recommendations
  → Render VenueCardMini in chat

User Feedback → POST /api/recommendations/[id]/feedback
  → Adjust parameters → Re-score → Update UI (max 3 iterations)

Final → Summary → Lead Form → WhatsApp CTA
```

---

## Auth Flow: Guest-First

```
Landing Page
  └→ Click "Mulai Konsultasi"
      └→ signInAnonymously() — guest user
          └→ Chat freely, all data saved to Firestore
              └→ Lead submission step
                  └→ Prompt: "Login untuk simpan dan hubungi partner"
                      ├→ Login (Google/Email)
                      │   └→ POST /api/auth/migrate
                      │       └→ Batch update Firestore: guest_uid → auth_uid
                      └→ Continue as guest
                          └→ Data stays with anonymous ID
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Gemini streaming chat via SSE |
| `/api/conversations/[id]` | GET | Conversation history |
| `/api/conversations/[id]/requirements` | GET | Extracted requirements JSON |
| `/api/recommendations` | POST | Generate venue recommendations |
| `/api/recommendations/[id]` | GET | Fetch recommendation result |
| `/api/recommendations/[id]/feedback` | POST | Submit user feedback → re-score |
| `/api/venues` | GET | List venues (with filters) |
| `/api/venues/[slug]` | GET | Venue detail + supporting vendors |
| `/api/summary/generate` | POST | Generate AI professional summary |
| `/api/leads` | POST | Submit lead (name, phone, email) |
| `/api/leads?partner_id=` | GET | Partner lead list (authenticated) |
| `/api/auth/migrate` | POST | Migrate guest data on login |

---

## Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "tailwindcss": "^4.0.0",
  "@shadcn/ui": "latest",
  "firebase": "^11.0.0",
  "firebase-admin": "^13.0.0",
  "@google/generative-ai": "^0.24.0",
  "zustand": "^5.0.0",
  "next-themes": "^0.4.0",
  "sonner": "^2.0.0",
  "lucide-react": "latest",
  "clsx": "^2.1.0",
  "tailwind-merge": "^3.0.0"
}
```

---

## Implementation Phases

| Phase | Scope | Estimated Files |
|-------|-------|-----------------|
| **1. Foundation** | Next.js init, Tailwind, Shadcn UI, design tokens, utils, Firebase config, types, providers | ~20 files |
| **2. Landing** | MarketingLayout, Header, Footer, Hero, Features, HowItWorks, Testimonials, CTA | ~12 files |
| **3. Chat Core** | ChatLayout, Zustand stores, ChatWindow, MessageBubble, ChatInput, ProgressBar, Sidebar | ~14 files |
| **4. Gemini API** | Gemini client, prompts, parser, SSE streaming, conversation persistence | ~8 files |
| **5. Scoring** | Scoring engine (5 calculators), recommendation API, VenueCardMini, feedback loop | ~10 files |
| **6. Venue Pages** | Venue detail, ImageCarousel, comparison table, ScoreBar, vendor cards | ~12 files |
| **7. Summary/Lead** | Summary generation, SummaryCard, PDF, LeadForm, SuccessScreen, WhatsApp CTA | ~12 files |
| **8. Admin** | AdminLayout, LeadsTable, FilterBar, StatusBadge, StatsOverview, LeadDetailModal | ~10 files |
| **9. Polish** | PWA, mobile pass, accessibility, skeletons, error states, rate limiting, SEO | ~8 files |

---

*Dokumen ini adalah referensi desain untuk implementasi frontend dinikahin.com. Berdasarkan PRD AI Wedding Consultant v1.0.*
