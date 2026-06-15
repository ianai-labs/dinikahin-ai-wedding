# Negative Scenario Tests — dinikahin.com

## Chat Flow

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 1 | Kirim pesan kosong | Tidak terkirim, input di-reset | ✅ |
| 2 | Kirim pesan saat AI sedang streaming | Diabaikan (isStreaming guard) | ✅ |
| 3 | Kirim pesan sangat panjang (>10KB) | Terkirim normal, AI proses | ⚠️ No limit |
| 4 | Kirim karakter spesial / emoji | Diterima normal | ✅ |
| 5 | Kirim script tags `<script>alert(1)</script>` | Tidak dieksekusi (React escaping) | ✅ |
| 6 | DeepSeek API timeout | Fallback ke simulasi | ✅ |
| 7 | DeepSeek API return error 500 | Fallback ke simulasi | ✅ |
| 8 | DeepSeek API return malformed JSON | Catch error, fallback | ✅ |
| 9 | SSE stream terputus di tengah | Partial message + fallback | ✅ |
| 10 | Koneksi internet putus saat chat | Error catch → simulasi | ✅ |
| 11 | Kirim 100 pesan berturut-turut | Rate limiting middleware (30/min) | ✅ |
| 12 | Spam klik send button | isStreaming guard | ✅ |

## Rekomendasi

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 13 | venues-enriched.json tidak ada | Fallback scoring fails silently, recs empty | ⚠️ |
| 14 | Semua venue isActive = false | Rekomendasi kosong | ✅ |
| 15 | Budget 0 / negative | Scoring engine handles gracefully | ✅ |
| 16 | Lokasi tidak dikenal | Location score = 0 (out of area) | ✅ |
| 17 | Guest count 0 / negative | Neutral score 50 | ✅ |
| 18 | Tidak ada gambar di folder venue | onError handler → placeholders | ✅ |

## Lead Form

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 19 | Submit form kosong | Validasi gagal, error messages | ✅ |
| 20 | Nama 1 karakter | Error "minimal 3 karakter" | ✅ |
| 21 | Nomor HP format salah | Error "nomor valid" | ✅ |
| 22 | Email invalid | Error "format email tidak valid" | ✅ |
| 23 | API /leads gagal | Toast error, form tetap | ✅ |
| 24 | XSS di input nama `<script>` | Tidak dieksekusi | ✅ |
| 25 | WhatsApp number kosong | Fallback ke default | ✅ |

## Navigation & State

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 26 | Buka /compare tanpa rekomendasi | Empty state + CTA ke /chat | ✅ |
| 27 | Buka /lead tanpa rekomendasi | Empty state + CTA ke /chat | ✅ |
| 28 | Refresh browser di /compare | State hilang (localStorage persist) → empty | ⚠️ |
| 29 | Browser back/forward | Next.js routing normal | ✅ |
| 30 | Buka di mobile (320px) | Responsive, sidebar hidden | ✅ |
| 31 | Buka di tablet (768px) | Sidebar toggle | ✅ |
| 32 | Klik nav cepat bolak-balik | Routing normal | ✅ |
| 33 | Halaman 404 random | Not-found page tampil | ✅ |

## Security

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 34 | DeepSeek API key di .env.local | Tidak exposed ke client | ✅ |
| 35 | Firebase config di env vars | Fallback graceful | ✅ |
| 36 | Rate limit /api/chat >30/min | 429 error | ✅ |
| 37 | Script injection di chat message | React escaping | ✅ |
| 38 | Path traversal di venue slug | Next.js routing handle | ✅ |
