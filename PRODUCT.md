# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router (100% Client-Side SPA)

## Users
Anak muda dan generasi muda (khususnya Gen Z) yang terpapar tren BookTok dan Bookstagram, pembaca yang ingin membuktikan kedisiplinan membaca nyata (bukan sekadar penimbun buku FOMO), serta individu dengan aphantasia yang membutuhkan bantuan visualisasi sinematik untuk memahami narasi sastra.

## Product Purpose
Genmoire hadir untuk merevolusi pengalaman membaca novel konvensional menjadi media kinetik berformat Visual Novel yang imersif, kaya ilustrasi CG dan musik latar adaptif, sekaligus memangkas beban kognitif membaca (*cognitive overload*) melalui penampilan teks bertahap per paragraf, dilengkapi gamifikasi pembuktian membaca dan forum diskusi literatur lintas batas.

## Positioning
Mengubah naskah buku cetak/digital resmi menjadi Visual Novel kinetik interaktif berbasis peramban (100% Client-Side SPA) melalui verifikasi kepemilikan lokal Zero-Upload (BYOB hash), simulasi RAG AI Explain kontekstual in-situ, dan sistem reputasi pembaca berbasis bukti perilaku membaca nyata (*Proof of Reading*).

## Operating Context
- Membaca novel dan karya sastra dalam sesi terfokus dan santai di desktop maupun perangkat bergerak.
- Mengunggah file lokal (.epub) atau memindai ISBN resmi tanpa mengunggah data buku ke peladen.
- Mengeksplorasi istilah sastra, idiom kuno, dan catatan pengarang via drawer AI Explain.
- Berinteraksi di forum komunitas cendekiawan untuk mengulas buku dan karya sastra.
- Memantau konsistensi membaca harian pada Activity Heatmap dan membuka Hidden Traits perilaku.

## Capabilities and Constraints
- **Kinetic Reading Engine:** Teks Full-Screen NVL dengan typewriter effect progresif di atas artwork CG 45% dark overlay dan audio ambient latar.
- **Context-Aware AI Explain (RAG Simulation):** Penjelasan in-situ tanpa merusak alur naskah asli.
- **Zero-Upload BYOB:** Komputasi MD5 hash lokal menggunakan FileReader tanpa transmisi naskah ke server pihak ketiga (privasi 100%).
- **Gamifikasi Pembaca Sejati:** Pangkat cendekiawan (*Arcanum Tier*), emblem koleksi, *Activity Heatmap* (waktu baca nyata), dan *Hidden Traits* yang terkunci secara misterius.
- **Forum Komunitas Sastra:** Diskusi dan simulasi posting seputar literatur nasional dan internasional.
- **Pure Kinetic Mode:** Opsi membaca naskah murni tanpa visual atau audio generatif AI.
- **Batasan Teknis:** 100% Client-Side SPA (Vue 3 + TypeScript + Tailwind CSS + Pinia), tanpa ketergantungan server backend.

## Brand Commitments
- **Nama:** Genmoire (Grimoire Generatif Sastra).
- **Estetika:** *Warm Material Narrative* (Akademis-Sinematik, Warm Sepia di mode terang, Warm Obsidian bernuansa cokelat kulit/perkamen di mode gelap).
- **Tipografi:** Triple-stack font (Plus Jakarta Sans untuk UI, Merriweather untuk narasi sastra, JetBrains Mono untuk terminal/sistem).
- **Tone & Voice:** Berwibawa, ilmiah, sastrawi, hangat, dan menghormati hak cipta serta orisinalitas kata-kata pengarang.

## Evidence on Hand
- Repositori aktif dengan implementasi lengkap di `src/views/`, `src/stores/`, `src/components/`.
- Naskah simulasi lengkap di `src/data/mockBooks.json` dan `src/data/forumPosts.json`.
- Dokumen desain resmi di `DESIGN.md` dan `.agents/skills/warm-material-narrative/`.
- Prinsip anti-AI tropes di `.agents/skills/human-craft-ui/`.

## Product Principles
1. **Purity of the Author's Voice:** Memberikan pengalaman visual/audio tambahan tanpa pernah mengubah esensi atau mengaburkan teks asli karya sastra.
2. **True Reading Over FOMO:** Menghargai menit-menit membaca nyata dan kedisiplinan intelektual di atas sekadar jumlah koleksi buku fisik.
3. **Cognitive Ease & Inclusivity:** Menghilangkan kejenuhan *wall of text* dan membantu pembaca aphantasia memvisualisasikan dunia sastra secara elegan.
4. **Absolute Client-Side Privacy:** Menjamin hak cipta dan privasi pengguna dengan pemrosesan lokal 100% tanpa upload ke cloud.
5. **Warm Academic Craft:** Menolak antarmuka AI generik yang dingin demi estetika humanis, hangat, dan bernuansa perpustakaan klasik.

## Accessibility & Inclusion
- Pilihan ukuran tipografi narasi (Kecil, Standar, Besar) dan pengaturan kecepatan typewriter.
- Rasio kontras tinggi dengan warna perkamen lembut (*Warm Parchment*) di atas latar obsidian gelap tanpa silau.
- Dukungan visualisasi untuk pembaca dengan aphantasia dan mode fokus tanpa distraksi.
