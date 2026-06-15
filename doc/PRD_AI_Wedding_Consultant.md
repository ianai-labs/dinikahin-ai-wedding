# Product Requirements Document
## AI Wedding Consultant

**Versi:** 1.0  
**Status:** Draft untuk Review  
**Tanggal:** Juni 2026  
**Dibuat oleh:** Tim Produk AI Wedding Consultant

---

## Daftar Isi

1. [Product Vision](#1-product-vision)
2. [Mengapa Ini Relevan Sekarang](#2-mengapa-ini-relevan-sekarang)
3. [Business Objective](#3-business-objective)
4. [Target Users](#4-target-users)
5. [Competitive Landscape](#5-competitive-landscape)
6. [MVP Scope](#6-mvp-scope)
7. [User Flow](#7-user-flow)
8. [AI Consultation Flow](#8-ai-consultation-flow)
9. [Requirement Extraction](#9-requirement-extraction)
10. [Recommendation Engine](#10-recommendation-engine)
11. [AI Summary Generation](#11-ai-summary-generation)
12. [Lead Submission & Partner CTA](#12-lead-submission--partner-cta)
13. [Authentication](#13-authentication)
14. [Database Schema](#14-database-schema)
15. [API Design](#15-api-design)
16. [AI Prompt Engineering Strategy](#16-ai-prompt-engineering-strategy)
17. [UI/UX Component Architecture](#17-uiux-component-architecture)
18. [Non-Functional Requirements](#18-non-functional-requirements)
19. [Testing Strategy](#19-testing-strategy)
20. [MVP Launch Plan](#20-mvp-launch-plan)
21. [Risk Mitigation](#21-risk-mitigation)
22. [MVP Success Metrics](#22-mvp-success-metrics)
23. [Future Roadmap](#23-future-roadmap)

---

## 1. Product Vision

**AI Wedding Consultant** adalah platform konsultasi pernikahan berbasis AI yang membantu calon pengantin menemukan venue pernikahan yang sesuai dengan kebutuhan mereka, sebelum terhubung dengan wedding consultant atau partner venue.

Tujuan utama produk adalah **mengurangi siklus konsultasi berulang** yang biasanya dilakukan wedding planner secara manual — dengan mengotomatisasi tahap *discovery*, *requirement gathering*, dan *venue recommendation*. Platform berfungsi sebagai **AI-powered pre-sales consultant** yang mengumpulkan kebutuhan pengantin, lalu menghasilkan ringkasan terstruktur yang siap diteruskan ke partner venue.

---

## 2. Mengapa Ini Relevan Sekarang

| Fakta | Sumber |
|-------|--------|
| 92% calon pengantin adalah Milenial atau Gen Z | Laporan industri 2026 |
| 85–90% merencanakan pernikahan secara digital | Survei perencanaan pernikahan |
| 72% pasangan menggunakan tools digital untuk perencanaan | Data industri terkini |
| Adopsi AI dalam perencanaan pernikahan: 18% (2024) → **36% (2026)** | Tren adopsi AI |
| Informasi venue di Indonesia masih sangat terfragmentasi | Observasi pasar lokal |

> **Celah pasar:** Calon pengantin di Indonesia harus mencari harga, kapasitas, dan paket dari puluhan sumber terpisah. AI Wedding Consultant hadir untuk mengisi gap ini.

---

## 3. Business Objective

### MVP (Current Objective)

Menghasilkan **lead berkualitas tinggi** untuk partner venue, dengan menyaring calon pengantin yang sudah memiliki gambaran jelas tentang budget, lokasi, dan jumlah tamu.

### Future Objective

- Marketplace vendor pernikahan
- DIY Wedding Planner Dashboard
- Wedding Timeline Management
- Vendor Booking Management
- AI Wedding Assistant Personal (chatbot pribadi dari engagement hingga hari-H)

---

## 4. Target Users

### Primary User — Calon Pengantin

| Atribut | Detail |
|---------|--------|
| Usia | 22–40 tahun |
| Status | Sedang merencanakan pernikahan |
| Kendala | Belum paham venue yang cocok; kewalahan mencari informasi dari banyak sumber |
| Budget | Mulai dari ~Rp60 juta (gedung sederhana) hingga >Rp300 juta (ballroom hotel) |
| Kebutuhan | Rekomendasi venue terkurasi, cepat, dan sesuai budget |

**Contoh Persona:**
> *"Kami mau menikah di Jakarta Selatan, sekitar 500 tamu, budget ±300 juta. Bingung mulai dari mana, mau ballroom hotel tapi takut over budget."*

### Secondary User — Wedding Consultant / Partner Venue

| Atribut | Detail |
|---------|--------|
| Pain Point | Terlalu banyak konsultasi awal berulang — pertanyaan yang sama tentang budget, lokasi, tamu |
| Tujuan | Menerima lead yang sudah tervalidasi, lengkap dengan summary kebutuhan |
| Metrik Sukses | Mengurangi waktu konsultasi awal hingga 50%; meningkatkan conversion rate calon pengantin menjadi klien |

---

## 5. Competitive Landscape

| Kompetitor | Model | Kekurangan |
|-----------|-------|------------|
| Bridestory | Marketplace vendor direktori | Tidak ada AI konsultasi; user harus browsing manual |
| The Knot / WeddingWire | Direktori + tools | Fokus pasar US; tidak ada personalisasi AI real-time |
| Venuerific (SG) | Booking venue | Tidak ada AI requirement gathering; fokus booking saja |
| Google / Venue langsung | Cari manual | Informasi terpencar; tidak ada rekomendasi berdasarkan budget vs kapasitas |

**Diferensiasi AI Wedding Consultant:**  
AI melakukan percakapan terstruktur untuk menggali kebutuhan — bukan sekadar *search box*. Output berupa rekomendasi venue yang sudah diskor berdasarkan kecocokan budget, kapasitas, lokasi, dan gaya.

---

## 6. MVP Scope

### Fitur yang Disertakan

| Fitur | Keterangan |
|-------|------------|
| Landing Page | Hero section dengan CTA "Mulai Konsultasi", penjelasan layanan |
| AI Consultation Chat | Chatbot berbasis Gemini 2.5 Flash yang menggali kebutuhan pengantin |
| Requirement Extraction | Mengubah percakapan → structured JSON otomatis |
| Venue Recommendation Engine | Rekomendasi venue diskor berdasarkan budget, kapasitas, lokasi, gaya |
| Venue Comparison | Tabel perbandingan minimal 3 venue |
| Venue Detail Page | Nama, foto, lokasi, kapasitas, harga, skor rekomendasi |
| Supporting Vendor Recommendation | Dekorasi, MUA, Entertainment untuk tiap venue |
| AI Generated Summary | Ringkasan profesional siap kirim ke partner |
| Lead Submission Form | Nama, No HP, Email (opsional) |
| Partner Contact CTA | Tombol WhatsApp Partner / Request Consultation |
| Authentication (Guest mode) | Firebase Auth: Google & Email login; guest mode diperbolehkan |
| Admin Panel (sederhana) | Partner bisa lihat leads yang masuk |

### Fitur yang Dikecualikan dari MVP

- Payment gateway
- Vendor booking / calendar management
- Wedding timeline / checklist builder
- Vendor marketplace multi-vendor
- Multi-agent AI system
- Advanced analytics dashboard

---

## 7. User Flow

```
[Landing Page]
    ↓ Klik "Mulai Konsultasi"
[AI Chat — Onboarding]
    ↓ Sapaan, penjelasan singkat, mulai tanya mandatory fields
[Requirement Gathering Loop]
    ↓ AI bertanya Budget → Location → Guest Count → Optional fields
    ↓ Jika mandatory field kosong → AI follow-up maks 2x
[Requirement Extraction]
    ↓ JSON terstruktur dibuat di belakang layar
[Venue Recommendation]
    ↓ Tampil 3–5 venue teratas dengan skor & alasan
[User Feedback Loop]
    ↓ User bisa kasih feedback: "terlalu mahal" / "cari yang outdoor" / "bukan di area itu"
[Updated Recommendation]
    ↓ AI perbarui rekomendasi berdasarkan feedback
[AI Summary Generation]
    ↓ Ringkasan profesional dibuat
[Lead Submission Form]
    ↓ User isi nama, no HP, email → simpan ke Firestore
[Partner CTA]
    ↓ 3 tombol: WhatsApp Partner | Request Consultation | Contact Wedding Consultant
```

---

## 8. AI Consultation Flow

### Mandatory Fields (Wajib — 3 Pertanyaan Inti)

| Field | Contoh Jawaban | Cara Menggali |
|-------|---------------|---------------|
| Budget | "Rp 300 juta" | "Berapa total budget yang sudah disiapkan? Bisa range-nya saja, misal Rp 200–300 juta." |
| Wedding Area | "Jakarta Selatan" | "Di area kota mana kira-kira pernikahannya?" |
| Guest Count (PAX) | "500 orang" | "Perkiraan jumlah tamu berapa? 300, 500, atau mungkin 1000?" |

### Optional Fields (Non-Wajib — Menggali Lebih Dalam)

| Field | Pilihan / Contoh |
|-------|-----------------|
| Indoor / Outdoor | "Indoor" |
| Hotel Ballroom / Gedung | "Hotel Ballroom" |
| Traditional / Modern | "Modern" |
| Preferred Wedding Style | "Modern Elegant" |
| Preferred Date | "Agustus 2025" |
| Special Requirements | "Parkir luas", "AC", "Musholla", "Disabled access" |

### Follow-up Logic

- Jika mandatory field kosong → AI follow-up **maksimal 2 kali** sebelum melanjutkan.
- Jika user tetap tidak menjawab setelah 2x follow-up → AI berkata: *"Baik, untuk sementara saya rekomendasikan venue berdasarkan asumsi standar. Nanti bisa disesuaikan lagi."*
- Optional fields: AI bertanya sekali saja per field; user bisa skip dengan jawaban "lewat" atau "skip".
- Sistem menghitung **completeness score (0–100%)** dari total 9 field; semakin lengkap, semakin akurat rekomendasi.

---

## 9. Requirement Extraction

### Target JSON Schema

```json
{
  "budget": {
    "min": 250000000,
    "max": 350000000,
    "currency": "IDR"
  },
  "location": {
    "city": "Jakarta",
    "area": "Jakarta Selatan",
    "specific_areas": ["Kuningan", "Senayan", "Pondok Indah"]
  },
  "guest_count": {
    "exact": 500,
    "range_min": 450,
    "range_max": 550
  },
  "venue_type": "Hotel Ballroom",
  "venue_setting": "Indoor",
  "style": "Modern Elegant",
  "cultural_preference": null,
  "preferred_date": {
    "month": 8,
    "year": 2025,
    "flexibility": "±2 bulan"
  },
  "special_requirements": [
    "Parkiran luas (200+ mobil)",
    "AC",
    "Musholla",
    "Akses kursi roda"
  ],
  "completeness_score": 88,
  "missing_fields": ["cultural_preference"]
}
```

### Aturan Ekstraksi Otomatis

| Field | Aturan |
|-------|--------|
| Budget | Deteksi angka + kata "juta" / "jt" / "M"; konversi ke integer IDR; support range ("200–300 juta") |
| Location | Named Entity Recognition untuk nama kota/kecamatan Indonesia |
| Guest Count | Deteksi angka + "orang" / "pax" / "tamu" |
| Venue Type | Klasifikasi dari kata kunci: "ballroom", "hotel", "outdoor", "gedung", "tenda", "taman" |

---

## 10. Recommendation Engine

### Input

- Budget (min & max)
- Location (city, area)
- Guest Count (exact + range)
- Preferences (venue type, setting, style, special requirements)

### Output

Ranked venue list **(3–5 venue)** dengan skor 0–100%.

### Scoring Formula

```
Total Score =
  (Budget Match × 0.35) +
  (Capacity Match × 0.30) +
  (Location Match × 0.20) +
  (Style Match × 0.10) +
  (Special Requirements Match × 0.05)
```

| Kriteria | Bobot | Cara Hitung |
|---------|-------|-------------|
| Budget Match | 35% | 100% jika price venue dalam range budget user; turun 10% per Rp50jt selisih |
| Capacity Match | 30% | 100% jika kapasitas venue ≥ guest count + 10% buffer; turun jika kurang atau terlalu besar (>2x) |
| Location Match | 20% | 100% area sama; 70% masih dalam kota; 30% Jabodetabek; 0% di luar |
| Style Match | 10% | 100% cocok; 50% mirip; 0% berbeda |
| Special Requirements | 5% | 1% per item yang terpenuhi |

### Data Venue MVP (Minimal 20–30 Venue Jakarta)

| Venue | Lokasi | Kapasitas | Harga Paket (500 pax) | Tipe | Style |
|-------|--------|-----------|----------------------|------|-------|
| Palma One Grand Ballroom | Kuningan, Jaksel | 1200 | ~Rp280–350jt | Hotel Ballroom | Modern Classic |
| Semesta Gallery | Jaksel | 500 | ~Rp77jt | Gedung | Modern Minimalist |
| Kinantis House | Jaksel | 500 | ~Rp132jt | Gedung | Modern |
| Graha Samudra BP2TL | Jaksel | 500 | ~Rp74jt | Aula | Standard |
| Balai Sudirman | Jaksel | 1000 | ~Rp200–300jt | Ballroom | Modern |
| Hotel Mulia | Senayan, Jaksel | 1000 | ~Rp400–600jt | Hotel Ballroom | Grand Luxury |
| *(+14 venue lainnya)* | | | | | |

### Supporting Vendor Recommendation

Untuk setiap venue, sistem menampilkan **3 vendor pendukung referensial** (tidak bisa dibooking di MVP):

| Kategori | Field | Contoh |
|---------|-------|--------|
| Decoration | Nama Vendor, Estimasi Harga | "Dekorasi Mewah By Rina", Rp15–25jt |
| Makeup Artist | Nama Vendor, Estimasi Harga | "Rias Pengantin Dinda", Rp8–15jt |
| Entertainment | Nama Vendor, Estimasi Harga | "Akustik Band Jakarta", Rp10–20jt |

**Logika matching vendor:**
- Lokasi vendor match dengan lokasi venue (kota/area yang sama)
- Estimasi harga menyesuaikan budget user (rendah / menengah / tinggi)
- Maksimal 3 vendor per kategori, diurutkan berdasarkan relevansi lokasi

---

## 11. AI Summary Generation

### Template Output Profesional

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
  WEDDING CONSULTATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 PROFILE PENGANTIN
   Nama      : [Nama dari lead form]
   Kontak    : [No HP] | [Email]

📋 KEBUTUHAN PERNIKAHAN
   Budget    : Rp250–350 juta
   Lokasi    : Jakarta Selatan (Kuningan, Senayan)
   Tamu      : 500 orang
   Tipe      : Hotel Ballroom, Indoor
   Gaya      : Modern Elegant
   Kebutuhan : Parkir luas, AC, Musholla

🏆 REKOMENDASI VENUE UTAMA
   ⭐ Palma One Grand Ballroom (92%)
   📍 Kuningan, Jaksel
   💰 Rp280–350jt | 👥 Up to 1200 pax

📌 CATATAN KONSULTAN
   • Venue sedikit di atas budget bawah, tapi sangat cocok dari kapasitas & lokasi
   • Alternatif: Semesta Gallery (Rp77jt, lebih hemat)

   [Ringkasan ini dibuat oleh AI Wedding Consultant]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 12. Lead Submission & Partner CTA

### Lead Form Fields

| Field | Tipe | Wajib? | Validasi |
|-------|------|--------|----------|
| Nama Lengkap | text | ✅ | Min 3 karakter |
| Nomor HP / WA | tel | ✅ | Format Indonesia (08xx / +62), 10–13 digit |
| Email | email | ❌ | Format email valid |

Data dikirim ke Firestore collection `leads` dengan status awal `"pending"`.

### Partner CTA (3 Pilihan)

| Tombol | Aksi | Prioritas MVP |
|--------|------|--------------|
| 💬 Chat WhatsApp Partner | Buka wa.me dengan template pesan berisi summary ringkas | HIGH |
| 📅 Request Consultation | Ajukan jadwal konsultasi via form; data dikirim ke partner | MEDIUM |
| 📞 Contact Wedding Consultant | Tampilkan nomor partner; bisa langsung telpon | LOW |

**Template pesan WhatsApp untuk Partner:**
```
Halo, saya [Nama] dari AI Wedding Consultant. Saya sedang mencari venue untuk 
500 tamu di Jakarta Selatan, budget Rp250–350jt. Saya tertarik dengan [Nama Venue]. 
Bisa dibantu info selengkapnya?
```

---

## 13. Authentication

| Metode | Implementasi |
|--------|-------------|
| Google Login | Firebase Auth — popup sign-in |
| Email Login | Firebase Auth — email + password; email verification tidak wajib untuk MVP |
| Guest Mode | Anonymous sign-in Firebase; user bisa chat tanpa daftar; prompt daftar saat lead submission |

### Guest Mode Flow

1. User masuk landing page → klik "Mulai Konsultasi" → otomatis masuk sebagai guest
2. Chat berjalan normal; data tersimpan di `conversations` dengan `user_id = anonymous_xxx`
3. Saat lead submission → prompt: *"Simpan hasil konsultasi kamu dengan login, supaya partner kami bisa menghubungi kembali."*
4. Jika user login, data conversations dan recommendations di-migrasi ke `user_id` baru

---

## 14. Database Schema

### Firestore Collections

```
users
├── id: string
├── name: string
├── email: string
├── phone: string | null
├── auth_provider: "google" | "email" | "guest"
├── created_at: timestamp
└── updated_at: timestamp

conversations
├── id: string
├── user_id: string
├── messages: array<{ role, content, timestamp }>
├── extracted_requirements: json
├── completeness_score: number (0–100)
├── status: "active" | "completed"
└── timestamps

venues
├── id, venue_name, slug
├── location: { city, area, address, geolocation }
├── capacity: { min, max }
├── price_range: { min, max, currency }
├── venue_type: "Hotel Ballroom" | "Gedung" | "Outdoor" | "Tenda" | "Aula" | "Restaurant"
├── setting: "Indoor" | "Outdoor" | "Semi-Outdoor"
├── style: string[]
├── images: string[]
├── package_info: { description, includes, excludes }
├── pros, cons, special_features: string[]
├── partner_id: string | null
└── is_active: boolean

vendors
├── id, vendor_name
├── category: "Decoration" | "Makeup Artist" | "Entertainment" | "Photography" | "Catering"
├── location: { city, area }
├── price_range: { min, max, currency }
└── is_active: boolean

recommendations
├── id, user_id, conversation_id
├── requirements: json (snapshot)
├── recommended_venues: array<{ venue_id, score, rank, reason }>
├── recommended_vendors: array<{ venue_id, category, vendor_ids }>
├── generated_summary: string
├── user_feedback: string | null
└── iteration: number

leads
├── id, user_id, recommendation_id
├── contact_info: { name, phone, email }
├── summary: string
├── partner_id: string | null
├── status: "pending" | "contacted" | "converted" | "lost"
└── notes: string | null

partners
├── id, partner_name
├── partner_type: "venue" | "wedding_planner" | "vendor"
├── contact_person, phone, email
├── venue_ids: string[] | null
└── is_active: boolean
```

---

## 15. API Design

### Chat API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/chat` | Kirim pesan user, balasan AI, update `extracted_requirements` secara incremental |
| GET | `/api/conversations/[id]` | Ambil history percakapan |
| GET | `/api/conversations/[id]/requirements` | Ambil extracted requirements terbaru |

### Recommendation API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/recommendations` | Generate rekomendasi venue dari extracted requirements |
| POST | `/api/recommendations/[id]/feedback` | Kirim feedback user, generate rekomendasi baru |
| GET | `/api/recommendations/[id]` | Ambil hasil rekomendasi |

### Venue API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/venues?location=&capacity=&budget_min=&budget_max=&type=` | List venue dengan filter |
| GET | `/api/venues/[slug]` | Detail venue + vendor terkait |

### Lead & Summary API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/leads` | Submit lead (nama, kontak, summary) |
| GET | `/api/leads?partner_id=` | Partner lihat leads (dengan auth) |
| POST | `/api/summary/generate` | Generate AI summary dari requirements + rekomendasi |

**Rate Limiting:** Endpoint publik: 20 req/menit per IP. Chat endpoint: 30 req/menit per user.

---

## 16. AI Prompt Engineering Strategy

### System Prompt — Karakter "Kana"

```
Anda adalah AI Wedding Consultant untuk platform AI Wedding Consultant.
Nama Anda: "Kana" — asisten ramah yang membantu calon pengantin menemukan
venue pernikahan.

KEPRIBADIAN:
- Ramah, hangat, seperti teman yang paham pernikahan
- Bahasa Indonesia semi-formal (pakai "Kakak" atau "Kalian")
- Tidak kaku, boleh pakai emoji sesekali (🎉💍)
- Profesional saat memberikan rekomendasi

TUGAS UTAMA:
1. Gali 3 mandatory fields: BUDGET, LOKASI, JUMLAH TAMU
2. Gali 6 optional fields: tipe venue, indoor/outdoor, gaya, tanggal,
   preferensi budaya, kebutuhan khusus
3. Setelah mandatory lengkap → jalankan requirement extraction → JSON
4. Tampilkan rekomendasi venue (berdasarkan scoring engine)
5. Minta feedback user, perbarui rekomendasi jika perlu
6. Generate summary profesional dan arahkan ke lead submission

ATURAN:
- Maksimal 2x follow-up untuk mandatory field yang kosong
- Jangan memberikan rekomendasi sebelum 3 mandatory field terisi
- Selalu jelaskan ALASAN di balik setiap rekomendasi
- Harga venue selalu dalam Rupiah (Rp); gunakan data venue yang tersedia
```

---

## 17. UI/UX Component Architecture

**Tech Stack:** Next.js 15 + Tailwind CSS + Shadcn UI

| Halaman | Komponen Utama |
|---------|----------------|
| Landing Page | HeroSection, FeatureCards, TestimonialCarousel, CTASection, Footer |
| Chat Page | ChatWindow, MessageBubble, TypingIndicator, RequirementProgressBar, VenueCardMini, FeedbackButtons |
| Venue Detail | ImageCarousel, ScoreBadge, DetailGrid, PackageInfo, ProsConsList, VendorCard |
| Comparison | ComparisonTable, VenueRow, ScoreBar |
| Summary Page | SummaryCard, DownloadPDFButton, ShareButton |
| Lead Form | LeadForm, InputField, SubmitButton, LoginPrompt |
| Admin Panel | LeadsTable, StatusBadge, FilterBar, LeadDetailModal |

### Mobile Responsiveness

| Ukuran | Layout |
|--------|--------|
| Mobile (< 640px) | Single column, chat full-screen, venue cards stacked |
| Tablet (640–1024px) | Chat + venue side panel, venue grid 2 kolom |
| Desktop (> 1024px) | Chat + venue side panel + requirement sidebar, venue grid 3 kolom |

---

## 18. Non-Functional Requirements

| Kategori | Requirement | Metrik / Implementasi |
|---------|-------------|----------------------|
| Performance | First Load < 3 detik | Next.js SSG landing page; lazy loading gambar; CDN aset statis |
| Performance | Chat response < 2 detik | Gemini Flash streaming response |
| Mobile | Responsive PWA-ready | Tailwind breakpoints; service worker opsional |
| Security | Environment variables | Semua API key (Gemini, Firebase) di server-side env |
| Security | Firebase Rules | User hanya akses data miliknya; partner hanya baca leads terkait |
| Security | Rate Limiting | Next.js middleware: 20 req/menit/IP; 30 req/menit chat |
| Scalability | Support 10.000+ user | Firebase Firestore auto-scale; Next.js serverless-ready |
| Monitoring | Analytics | Firebase Analytics + Google Analytics: user flow, drop-off rate |
| Accessibility | WCAG 2.1 AA | Warna kontras cukup, alt text gambar, keyboard navigable |

### Error Handling & Edge Cases

| Skenario | Penanganan |
|---------|------------|
| User tidak isi mandatory field setelah 2x follow-up | AI lanjut dengan asumsi default; beri peringatan bahwa rekomendasi kurang akurat |
| Tidak ada venue cocok | AI tawarkan 3 alternatif: naikkan budget, kurangi tamu, atau perluas area |
| Budget terlalu kecil untuk tamu banyak | AI beri edukasi rata-rata biaya per pax di Jakarta |
| User upload foto (tidak didukung MVP) | AI minta user ceritakan gaya yang diinginkan lewat teks |
| Koneksi terputus saat chat | Chat state disimpan di Firestore real-time; lanjut dari pesan terakhir |
| Rate limit tercapai | Toast: "Kamu terlalu cepat 😅 Coba lagi dalam 1 menit, ya." |
| Guest mode — user close browser | Data tetap tersimpan; user bisa lanjut jika pakai device & browser yang sama |

---

## 19. Testing Strategy

| Tipe | Tools | Cakupan |
|------|-------|---------|
| Unit Test | Vitest / Jest | AI prompt parsing, scoring engine, budget parser, location parser |
| Integration Test | Playwright | User flow: chat → rekomendasi → summary → lead submission |
| AI Output Test | Manual + Automated eval set | 50 skenario percakapan; cek JSON extraction dan logika rekomendasi |
| Mobile Test | BrowserStack / real device | Responsivitas iOS Safari, Android Chrome |
| Load Test | k6 / Artillery | Simulasi 100 user concurrent chat; response time < 3 detik |

---

## 20. MVP Launch Plan

### Phase 0 — Data Preparation (Minggu 1–2)
- Kumpulkan data minimal **20 venue Jakarta Selatan** (nama, lokasi, kapasitas, harga, gambar, paket, style)
- Kumpulkan data minimal **15 vendor** (5 dekorasi, 5 MUA, 5 entertainment)
- Masukkan data ke Firestore koleksi `venues` & `vendors`
- Onboard **2–3 partner venue** untuk menerima leads

### Phase 1 — Core Development (Minggu 3–6)
- Setup Next.js 15 project, Tailwind, Shadcn UI
- Implementasi Firebase Auth + Firestore
- Build AI Chat dengan Gemini 2.5 Flash (system prompt + structured output)
- Requirement extraction + scoring engine
- Venue detail page + comparison table

### Phase 2 — Lead & CTA (Minggu 7–8)
- Summary generation
- Lead submission form
- WhatsApp CTA integration
- Admin panel sederhana untuk partner

### Phase 3 — Testing & Polish (Minggu 9–10)
- Integration testing (Playwright)
- AI output quality testing (50 skenario)
- Mobile responsive polish
- Landing page copy finalization
- Firebase Rules & rate limiting

### Phase 4 — Soft Launch (Minggu 11–12)
- Deploy ke VPS (Docker)
- UAT dengan 10 calon pengantin undangan
- Iterasi berdasarkan feedback
- **Target:** 100 user, 20 qualified leads, 10% partner contact conversion

---

## 21. Risk Mitigation

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| AI memberikan rekomendasi tidak akurat | User kecewa, partner dapat lead tidak valid | Dataset venue akurat & terverifikasi; scoring engine berbasis data; human review 20 sampel awal |
| Adopsi rendah | Trafik sepi, tidak ada lead | Landing page SEO; konten Instagram/TikTok "wedding planning tips with AI"; partnership influencer mikro |
| Partner enggan gabung | Monetisasi tertunda | MVP: partner gratis; tunjukkan value dulu (lead qualified); jual dengan data konversi setelah 3 bulan |
| Biaya Gemini API membengkak | Cost tinggi | Gemini Flash dipilih karena murah & cepat; rate limiting ketat |
| Firebase vendor lock-in | Sulit migrasi nanti | Gunakan abstraksi layer (repository pattern); jangan hardcode Firebase SDK di komponen UI |
| Data venue tidak lengkap / outdated | Rekomendasi salah | Admin panel untuk partner update data venue sendiri; scraping + manual update per 3 bulan |

---

## 22. MVP Success Metrics

| KPI | Target MVP | Cara Ukur |
|-----|-----------|-----------|
| Total Users | 100 | Firebase Auth user count |
| Consultation Started | 80% dari visitors | Event: `consultation_start` |
| Consultation Completion Rate | 50% | Event: `consultation_complete` / `consultation_start` |
| Recommendation Click Rate | 60% | Event: `venue_detail_click` |
| Qualified Leads | 20 | Firestore leads count, status `pending` |
| Partner Contact Conversion | 10% (2 dari 20 lead) | Admin panel: status berubah ke `contacted` |

---

## 23. Future Roadmap

| Phase | Fitur |
|-------|-------|
| **Phase 2** | Wedding Dashboard, Vendor Marketplace, Wedding Checklist |
| **Phase 3** | AI Wedding Planner, Vendor Booking System, Meeting Scheduler |
| **Phase 4** | Full Wedding Operating System, B2B Partner Dashboard, AI Wedding Project Manager |

---

*Dokumen ini dibuat untuk keperluan review internal dan presentasi stakeholder. Versi ini mencerminkan scope MVP dan rencana pengembangan produk AI Wedding Consultant.*

*Terakhir diperbarui: Juni 2026*
