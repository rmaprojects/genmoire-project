<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GButton from '@/components/common/GButton.vue';

gsap.registerPlugin(ScrollTrigger);

interface PipelineStep {
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  explanationList: string[];
  visualType: 'input' | 'parsing' | 'visual' | 'audio' | 'kinetic';
}

const pipelineSteps: PipelineStep[] = [
  {
    number: '01',
    badge: 'LANGKAH AWAL',
    title: 'Input Buku Fisik (ISBN) atau File EPUB',
    subtitle: 'Mengenali Buku Anda Tanpa Perlu Mengunggah File ke Server',
    description:
      'Proses dimulai saat Anda memasukkan nomor ISBN dari buku fisik yang ada di rak Anda, atau memilih file EPUB digital dari perangkat Anda. Genmoire membaca informasi buku secara instan langsung di dalam browser Anda.',
    explanationList: [
      'Cukup ketikkan nomor ISBN 13-digit dari sampul belakang buku fisik Anda.',
      'Atau gunakan file EPUB pribadi Anda secara langsung.',
      'Aman & Taat Privasi: 100% diproses di browser Anda sendiri, tidak ada file buku yang diunggah ke internet.',
    ],
    visualType: 'input',
  },
  {
    number: '02',
    badge: 'PENGURAIAN NASKAH',
    title: 'Segmentasi Adegan & Struktur Paragraf',
    subtitle: 'Mengurai Dinding Teks Panjang Menjadi Alur yang Mengalir Ringan',
    description:
      'Buku konvensional biasanya dipenuhi lembaran teks rapat yang membuat mata cepat lelah. Sistem Genmoire secara otomatis membaca struktur bab, dialog tokoh, dan deskripsi suasana, lalu membaginya menjadi potongan-potongan adegan yang nyaman dibaca satu per satu.',
    explanationList: [
      'Memilah babak cerita menjadi unit-unit adegan visual yang berkesinambungan.',
      'Menghilangkan beban kognitif membaca buku tebal dengan menampilkan 1 paragraf bertahap.',
      'Setiap kata naskah asli pengarang dipertahankan 100% utuh tanpa dipotong atau diubah maknanya.',
    ],
    visualType: 'parsing',
  },
  {
    number: '03',
    badge: 'ILUSTRASI LATAR',
    title: 'Penyelarasan Artwork & Lapisan Kontras',
    subtitle: 'Menghadirkan Gambaran Visual Nyata di Setiap Lokasi Cerita',
    description:
      'Setiap babak cerita diselaraskan dengan ilustrasi pemandangan (CG Artwork) beresolusi tinggi yang sesuai dengan lokasi adegan — seperti kastil tua, ruang perpustakaan, atau hutan bersalju. Ditambah lapisan gelap 45% otomatis agar teks tetap tajam dan nyaman dibaca.',
    explanationList: [
      'Membantu pembaca memvisualisasikan latar dunia yang digambarkan oleh penulis.',
      'Lapisan Dark Scrim 45% memastikan huruf selalu memiliki kontras tinggi dan tidak silau di mata.',
      'Mode Pure Kinetic tersedia bagi pembaca yang ingin membaca naskah murni tanpa gambar.',
    ],
    visualType: 'visual',
  },
  {
    number: '04',
    badge: 'TATA SUARA',
    title: 'Sinkronisasi Audio Ambient & Musik Latar',
    subtitle: 'Membangun Suasana Emosional Cerita Melalui Suara',
    description:
      'Untuk menyempurnakan suasana, Genmoire memadukan musik latar instrumental (BGM) dan efek suara lingkungan (seperti desau angin, gemercik hujan, atau derit pintu tua) yang bertransisi secara lembut mengikuti jalannya alur cerita.',
    explanationList: [
      'Musik latar beradaptasi dengan tensi narasi (tenang, misteri, atau klimaks).',
      'Perpindahan nada secara mulus (crossfade) sehingga tidak mengagetkan telinga pembaca.',
      'Volume audio dan efek suara dapat diatur atau dimatikan kapan saja dengan mudah.',
    ],
    visualType: 'audio',
  },
  {
    number: '05',
    badge: 'PENGALAMAN AKHIR',
    title: 'Kanvas Teater Kinetik NVL & Interaktivitas',
    subtitle: 'Membaca Seperti Menikmati Visual Novel yang Hidup',
    description:
      'Teks cerita muncul di layar dengan efek mesin ketik halus (30ms per karakter). Anda cukup mengeklik di mana saja pada layar untuk memunculkan kalimat berikutnya. Jika menemukan kata yang belum dipahami, cukup tandai kata tersebut untuk melihat penjelasan konteks seketika.',
    explanationList: [
      'Format Full-Screen NVL sinematik yang memanjakan mata di layar ponsel maupun komputer.',
      'Cukup klik layar untuk melanjutkan alur cerita sesuai ritme kecepatan baca Anda sendiri.',
      'Fitur AI Explain in-situ siap menerangkan istilah asing dan catatan latar cerita tanpa meninggalkan alur buku.',
    ],
    visualType: 'kinetic',
  },
];

const containerRef = ref<HTMLElement | null>(null);
const heroHeaderRef = ref<HTMLElement | null>(null);
const pipelineSectionRef = ref<HTMLElement | null>(null);
const ctaSectionRef = ref<HTMLElement | null>(null);
const orb1Ref = ref<HTMLElement | null>(null);
const orb2Ref = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      // 1. Ambient orbs
      if (orb1Ref.value) {
        gsap.to(orb1Ref.value, {
          y: 40,
          x: 20,
          scale: 1.1,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (orb2Ref.value) {
        gsap.to(orb2Ref.value, {
          y: -35,
          x: -25,
          scale: 0.92,
          duration: 8.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.8,
        });
      }

      // 2. Header and intro narrative
      if (heroHeaderRef.value) {
        gsap.from(heroHeaderRef.value, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 3. Pipeline Step Cards on Scroll
      if (pipelineSectionRef.value) {
        const stepElements = pipelineSectionRef.value.querySelectorAll('.pipeline-step-item');
        stepElements.forEach((stepEl) => {
          const pin = stepEl.querySelector('.timeline-pin');
          const card = stepEl.querySelector('.step-content-card');

          if (pin) {
            gsap.from(pin, {
              scrollTrigger: {
                trigger: stepEl,
                start: 'top 95%',
                once: true,
              },
              scale: 0,
              rotation: -45,
              duration: 0.5,
              ease: 'back.out(2)',
              clearProps: 'opacity,transform',
            });
          }

          if (card) {
            gsap.from(card, {
              scrollTrigger: {
                trigger: stepEl,
                start: 'top 95%',
                once: true,
              },
              opacity: 0,
              y: 30,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            });
          }
        });
      }

      // 4. CTA Section Entrance
      if (ctaSectionRef.value) {
        gsap.from(ctaSectionRef.value, {
          scrollTrigger: {
            trigger: ctaSectionRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          scale: 0.96,
          y: 25,
          duration: 0.7,
          ease: 'back.out(1.4)',
          clearProps: 'opacity,transform',
        });
      }

      ScrollTrigger.refresh();
    }, containerRef.value || undefined);
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="containerRef" class="relative overflow-hidden min-h-screen">
    <!-- Atmospheric Ambient Glow Blobs -->
    <div ref="orb1Ref" class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
    <div ref="orb2Ref" class="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-60"></div>

    <div class="max-w-container-max mx-auto px-4 sm:px-8 py-16 sm:py-24 relative z-10 space-y-24">
      
      <!-- 1. HERO HEADER (Clean Editorial, Layperson Focus) -->
      <section ref="heroHeaderRef" class="text-center max-w-4xl mx-auto">
        <p class="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
          PROSES TRANSFORMASI BUKU
        </p>
        <h1 class="font-display-lg text-4xl sm:text-6xl md:text-7xl font-extrabold text-on-surface tracking-tight sm:tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] mb-6">
          Bagaimana Genmoire Mengubah Buku Biasa Menjadi <span class="text-primary underline decoration-primary/30 underline-offset-8">Visual Novel</span>?
        </h1>
        <p class="font-ui-body text-base sm:text-xl text-text-secondary leading-relaxed sm:leading-[1.65] max-w-[65ch] mx-auto text-balance">
          Dari novel fisik ber-ISBN atau file EPUB digital, ikuti 5 langkah sederhana bagaimana teknologi Genmoire merangkai teks, ilustrasi latar, dan tata suara menjadi naskah visual interaktif langsung di peramban Anda.
        </p>
      </section>

      <!-- 2. CONTINUOUS VERTICAL PIPELINE (Scrollable Step-by-Step, No Tabs) -->
      <section ref="pipelineSectionRef" class="max-w-4xl mx-auto space-y-16">
        
        <div
          v-for="step in pipelineSteps"
          :key="step.number"
          class="pipeline-step-item relative pl-6 sm:pl-12 border-l-2 border-primary/30 pb-4 last:border-l-0"
        >
          <!-- Step Number Timeline Pin -->
          <div class="timeline-pin absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-primary text-on-primary font-sans font-bold text-xs flex items-center justify-center shadow-warm-md ring-4 ring-surface-primary dark:ring-[#1E1B18]">
            {{ step.number }}
          </div>

          <!-- Step Content Card -->
          <div class="step-content-card bg-surface-secondary border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-warm-xl space-y-8">
            
            <!-- Step Header Meta -->
            <div>
              <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-sans text-xs font-bold uppercase tracking-wider mb-2">
                {{ step.badge }}
              </span>
              <h2 class="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                {{ step.title }}
              </h2>
              <p class="font-ui-body text-sm sm:text-base font-semibold text-primary mb-3">
                {{ step.subtitle }}
              </p>
              <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed">
                {{ step.description }}
              </p>
            </div>

            <!-- Visual Demonstration Component Box -->
            <div class="rounded-2xl bg-[#141210] border border-white/15 text-white p-6 sm:p-8 shadow-inner relative overflow-hidden">
              
              <!-- Visual 1: Input / ISBN Search Simulation -->
              <div v-if="step.visualType === 'input'" class="space-y-4 font-sans text-xs">
                <div class="flex items-center justify-between text-primary-fixed-dim border-b border-white/10 pb-2">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">qr_code_scanner</span>
                    <span>DETEKSI NASKAH LOKAL</span>
                  </span>
                  <span class="text-emerald-400 font-bold">100% IN-BROWSER</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span class="text-zinc-500 text-[11px] block">Opsi 1: Buku Fisik</span>
                    <span class="text-white font-bold text-sm flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary text-base">barcode</span>
                      ISBN: 978-602-03-8591-2
                    </span>
                    <p class="text-[11px] text-zinc-400 font-ui-body">Terverifikasi cocok dengan naskah Chronicles of Aethelgard</p>
                  </div>
                  <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span class="text-zinc-500 text-[11px] block">Opsi 2: File Digital</span>
                    <span class="text-white font-bold text-sm flex items-center gap-2">
                      <span class="material-symbols-outlined text-secondary text-base">file_present</span>
                      novel_aethelgard.epub
                    </span>
                    <p class="text-[11px] text-zinc-400 font-ui-body">Dibaca langsung dari memori lokal perangkat tanpa unggah file</p>
                  </div>
                </div>
              </div>

              <!-- Visual 2: Scene Parsing Simulation -->
              <div v-else-if="step.visualType === 'parsing'" class="space-y-3">
                <div class="flex items-center justify-between text-xs font-sans text-primary-fixed-dim border-b border-white/10 pb-2">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">splitscreen</span>
                    <span>SEGMENTASI TEKS NOVEL</span>
                  </span>
                  <span class="text-zinc-400">Bab 1 • Adegan 1</span>
                </div>
                <div class="space-y-2 font-reading-body text-xs sm:text-sm">
                  <div class="p-3 rounded-xl bg-white/5 border-l-2 border-zinc-600 text-zinc-400 line-through opacity-50">
                    Naskah tebal konvensional yang padat dan membuat mata lelah...
                  </div>
                  <div class="p-4 rounded-xl bg-primary/10 border-l-4 border-primary text-white space-y-1">
                    <span class="text-[10px] font-sans text-primary font-bold uppercase tracking-wider block">Segmen Aktif: Paragraf 1</span>
                    <p class="italic text-zinc-200">
                      “Malam itu, hembusan angin beku menyusup melalui jendela kaca bertatah emas di puncak Obsidian Citadel...”
                    </p>
                  </div>
                </div>
              </div>

              <!-- Visual 3: Visual Artwork & Scrim Simulation -->
              <div v-else-if="step.visualType === 'visual'" class="space-y-4">
                <div class="flex items-center justify-between text-xs font-sans text-primary-fixed-dim border-b border-white/10 pb-2">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">palette</span>
                    <span>ARTWORK CG & DARK SCRIM FILTER</span>
                  </span>
                  <span class="text-amber-300 font-bold">45% DARK SCRIM AKTIF</span>
                </div>
                <div class="relative rounded-xl overflow-hidden aspect-[21/9] flex items-center justify-center p-4 border border-white/15">
                  <div
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80')"
                  >
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"></div>
                  </div>
                  <div class="relative z-10 text-center space-y-1">
                    <span class="px-3 py-1 rounded-full bg-primary/80 text-white font-sans text-[11px] font-bold uppercase">
                      Latar: Obsidian Citadel (Malam Bersalju)
                    </span>
                    <p class="font-reading-body text-white text-xs sm:text-sm drop-shadow-md">
                      Ilustrasi otomatis selaras dengan latar cerita babak
                    </p>
                  </div>
                </div>
              </div>

              <!-- Visual 4: Audio Soundscape Simulation -->
              <div v-else-if="step.visualType === 'audio'" class="space-y-4 font-sans text-xs">
                <div class="flex items-center justify-between text-primary-fixed-dim border-b border-white/10 pb-2">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">graphic_eq</span>
                    <span>ORKESTRASI AUDIO DINAMIS</span>
                  </span>
                  <span class="text-emerald-400 animate-pulse flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span> SEDANG BERPUTAR
                  </span>
                </div>
                <div class="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                      <span class="material-symbols-outlined text-xl">music_note</span>
                    </div>
                    <div>
                      <div class="font-bold text-white text-sm">Whispers of Ancient Stone</div>
                      <div class="text-zinc-400 text-[11px]">BGM Bab 1 • Suasana Dingin & Misterius</div>
                    </div>
                  </div>
                  <div class="text-[11px] px-3 py-1 rounded-full bg-white/10 text-zinc-300">
                    Transisi Halus (Crossfade 800ms)
                  </div>
                </div>
              </div>

              <!-- Visual 5: Kinetic Engine & Interactivity Simulation -->
              <div v-else-if="step.visualType === 'kinetic'" class="space-y-4">
                <div class="flex items-center justify-between text-xs font-sans text-primary-fixed-dim border-b border-white/10 pb-2">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">auto_stories</span>
                    <span>TAMPILAN FULL-SCREEN NVL</span>
                  </span>
                  <span class="text-primary font-bold">TYPEWRITER 30ms</span>
                </div>
                <div class="p-4 rounded-xl bg-white/10 border-l-4 border-primary space-y-2 font-reading-body">
                  <p class="text-sm text-white leading-relaxed italic">
                    “Malam itu, hembusan angin beku menyusup melalui jendela kaca bertatah emas di puncak Obsidian Citadel...”
                    <span class="inline-block ml-1 text-primary animate-bounce">▼</span>
                  </p>
                  <div class="pt-2 flex items-center justify-between text-[11px] font-sans text-zinc-400 not-italic">
                    <span>[Klik di mana saja untuk kalimat selanjutnya]</span>
                    <span class="text-primary font-bold">Tandai kata untuk AI Explain</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Bullet Point Explanations -->
            <ul class="space-y-3 pt-2">
              <li
                v-for="(point, pIdx) in step.explanationList"
                :key="pIdx"
                class="flex items-start gap-3 text-sm sm:text-base text-on-surface"
              >
                <span class="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">check_circle</span>
                <span class="leading-relaxed font-ui-body">{{ point }}</span>
              </li>
            </ul>

          </div>
        </div>

      </section>

      <!-- 3. FINAL CALL TO ACTION (Direct Launchpad) -->
      <section ref="ctaSectionRef" class="p-8 sm:p-14 rounded-3xl bg-surface-secondary dark:bg-[#1E1B18] border-2 border-primary/40 shadow-2xl text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-60 h-60 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <h2 class="font-display-lg text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
          Coba Rasakan Sendiri Pengalaman Membacanya
        </h2>
        <p class="font-ui-body text-base sm:text-lg text-text-secondary leading-relaxed max-w-[60ch] mx-auto text-balance">
          Buka novel interaktif pertama Anda sekarang dan nikmati perpaduan naskah sastra, visual sinematik, serta audio dinamis di Genmoire.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <RouterLink to="/read/chronicles-of-aethelgard">
            <GButton size="lg" variant="primary" icon="play_arrow" rounded>
              Mulai Membaca: Chronicles of Aethelgard
            </GButton>
          </RouterLink>
          <RouterLink to="/">
            <GButton size="lg" variant="tonal" icon="home" rounded>
              Kembali ke Beranda
            </GButton>
          </RouterLink>
          <RouterLink to="/auth">
            <GButton size="lg" variant="outline" icon="person_add" rounded>
              Daftar Akun Baru
            </GButton>
          </RouterLink>
        </div>
      </section>

    </div>
  </div>
</template>
