<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuthStore } from '@/stores/useAuthStore';
import GButton from '@/components/common/GButton.vue';
import IsbnSearchInput from '@/components/library/IsbnSearchInput.vue';

gsap.registerPlugin(ScrollTrigger);

const authStore = useAuthStore();

const containerRef = ref<HTMLElement | null>(null);
const heroHeadingRef = ref<HTMLElement | null>(null);
const heroSubheadingRef = ref<HTMLElement | null>(null);
const heroCtasRef = ref<HTMLElement | null>(null);
const heroIsbnRef = ref<HTMLElement | null>(null);
const teaserRef = ref<HTMLElement | null>(null);
const bentoHeadingRef = ref<HTMLElement | null>(null);
const bentoCardsRef = ref<HTMLElement | null>(null);
const pillarsHeadingRef = ref<HTMLElement | null>(null);
const pillarsCardsRef = ref<HTMLElement | null>(null);
const orb1Ref = ref<HTMLElement | null>(null);
const orb2Ref = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      // 1. Continuous ambient floating orbs
      if (orb1Ref.value) {
        gsap.to(orb1Ref.value, {
          y: 35,
          x: 25,
          scale: 1.08,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (orb2Ref.value) {
        gsap.to(orb2Ref.value, {
          y: -40,
          x: -30,
          scale: 0.95,
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }

      // 2. Hero Section Elements Stagger Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroHeadingRef.value) {
        heroTl.from(heroHeadingRef.value, { opacity: 0, y: 35, duration: 0.8, clearProps: 'opacity,transform' });
      }
      if (heroSubheadingRef.value) {
        heroTl.from(heroSubheadingRef.value, { opacity: 0, y: 20, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.5');
      }
      if (heroCtasRef.value) {
        heroTl.from(heroCtasRef.value.children, { opacity: 0, y: 20, scale: 0.94, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)', clearProps: 'opacity,transform' }, '-=0.4');
      }
      if (heroIsbnRef.value) {
        heroTl.from(heroIsbnRef.value, { opacity: 0, y: 25, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.3');
      }

      // 3. Live Teaser Showcase Entrance on Scroll
      if (teaserRef.value) {
        gsap.from(teaserRef.value, {
          scrollTrigger: {
            trigger: teaserRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 40,
          scale: 0.96,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      // 4. Bento Grid Features Stagger Reveal
      if (bentoHeadingRef.value) {
        gsap.from(bentoHeadingRef.value, {
          scrollTrigger: {
            trigger: bentoHeadingRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 25,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      if (bentoCardsRef.value) {
        gsap.from(bentoCardsRef.value.children, {
          scrollTrigger: {
            trigger: bentoCardsRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 5. Three Pillars Stagger Reveal
      if (pillarsHeadingRef.value) {
        gsap.from(pillarsHeadingRef.value, {
          scrollTrigger: {
            trigger: pillarsHeadingRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 25,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      if (pillarsCardsRef.value) {
        gsap.from(pillarsCardsRef.value.children, {
          scrollTrigger: {
            trigger: pillarsCardsRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
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
    <!-- Atmospheric Ambient Background Blobs -->
    <div ref="orb1Ref" class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
    <div ref="orb2Ref" class="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-60"></div>

    <!-- Hero Section (Clean, Confident, Human-Crafted Editorial Typography) -->
    <section class="max-w-container-max mx-auto px-4 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 relative z-10">
      <div class="text-center max-w-4xl mx-auto flex flex-col items-center">
        
        <!-- Main Headline with calibrated tight tracking and leading -->
        <h1
          ref="heroHeadingRef"
          class="font-display-lg text-4xl sm:text-6xl md:text-7xl font-extrabold text-on-surface tracking-tight sm:tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] mb-6 max-w-4xl"
        >
          Mengubah Buku Biasa Menjadi <span class="text-primary underline decoration-primary/30 underline-offset-8">Pengalaman Visual yang Hidup</span>.
        </h1>

        <!-- Subheading with optimal 65ch reading measure and relaxed leading -->
        <p
          ref="heroSubheadingRef"
          class="font-ui-body text-base sm:text-xl text-text-secondary leading-relaxed sm:leading-[1.65] mb-10 max-w-[65ch] mx-auto text-balance"
        >
          Nikmati cara baru membaca buku digital layaknya visual novel — dilengkapi ilustrasi suasana, musik latar yang menenangkan, dan penjelasan kata sulit tanpa mengubah tulisan asli sang penulis.
        </p>

        <!-- CTA Buttons (Guest Presentation) -->
        <div ref="heroCtasRef" class="flex flex-wrap items-center justify-center gap-4 mb-14">
          <RouterLink to="/auth">
            <GButton size="lg" variant="primary" icon="login" rounded>
              Sudah punya akun? Masuk
            </GButton>
          </RouterLink>
          <RouterLink to="/how-it-works">
            <GButton size="lg" variant="outline" icon="help_outline" rounded>
              Lihat Cara Kerjanya
            </GButton>
          </RouterLink>
        </div>

        <!-- ISBN Activation Search Box -->
        <div ref="heroIsbnRef" class="w-full max-w-2xl">
          <IsbnSearchInput />
        </div>
      </div>
    </section>

    <!-- Interactive Visual Novel Showcase / Live Teaser -->
    <section ref="teaserRef" class="max-w-5xl mx-auto px-4 sm:px-8 py-12 relative z-10">
      <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-[#141210] aspect-[16/9] sm:aspect-[21/9] flex flex-col justify-end p-6 sm:p-10 group">
        <!-- Background Artwork -->
        <div
          class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style="background-image: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80')"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]"></div>
        </div>

        <!-- Interactive Tag Overlay -->
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/90 text-white text-xs font-sans font-bold uppercase tracking-wider mb-3 shadow-md border border-white/10">
            <span>Bab 1: Menara Kastil Kuno</span>
            <span class="opacity-60">•</span>
            <span>Contoh Tampilan Membaca</span>
          </div>

          <!-- Literary Excerpt with Merriweather Serif Typography -->
          <blockquote class="font-reading-body text-xl sm:text-2xl md:text-3xl text-white font-normal leading-relaxed sm:leading-[1.6] tracking-normal drop-shadow-md italic max-w-[55ch]">
            “Malam itu, hembusan angin beku menyusup melalui jendela kaca bertatah emas di puncak Obsidian Citadel...”
            <span class="inline-block ml-2 text-primary-fixed-dim not-italic animate-bounce">▼</span>
          </blockquote>

          <div class="mt-5 flex items-center gap-3">
            <RouterLink :to="authStore.isLoggedIn ? '/read/chronicles-of-aethelgard' : '/auth'">
              <span class="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-sans font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer backdrop-blur-md border border-white/20">
                <span class="material-symbols-outlined text-[18px]">play_circle</span> Mulai Baca Buku Ini
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Innovations Bento Grid -->
    <section class="max-w-container-max mx-auto px-4 sm:px-8 py-20 relative z-10">
      <div ref="bentoHeadingRef" class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
          Fitur Utama Genmoire
        </h2>
        <p class="font-ui-body text-base sm:text-lg text-text-secondary leading-relaxed max-w-[55ch] mx-auto text-balance">
          Membawa pengalaman membaca buku ke tingkat yang lebih menyenangkan dan mudah dipahami.
        </p>
      </div>

      <div ref="bentoCardsRef" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Bento 1: Visual Novel Format -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-md flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl border border-primary/30">
            <span class="material-symbols-outlined text-3xl">auto_stories</span>
          </div>
          <div>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">Tampilan Visual Novel</h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed sm:leading-[1.6] max-w-[48ch]">
              Teks tampil paragraf demi paragraf di atas ilustrasi pemandangan yang indah dengan efek teks berjalan halus, membuat membaca buku tebal tidak lagi melelahkan.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/40 flex items-center justify-between text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-primary">
            <span>Membaca Lebih Nyaman</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </div>
        </div>

        <!-- Bento 2: Context-Aware AI Explain -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-md flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl border border-secondary/30">
            <span class="material-symbols-outlined text-3xl">lightbulb</span>
          </div>
          <div>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">Penjelasan Kata Sulit</h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed sm:leading-[1.6] max-w-[48ch]">
              Cukup tandai kata atau kalimat yang belum Anda pahami untuk langsung melihat arti dan latar belakangnya tanpa perlu membuka kamus terpisah.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/40 flex items-center justify-between text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-secondary">
            <span>Mudah Memahami Makna</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </div>
        </div>

        <!-- Bento 3: Pure Text Option -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-md flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center text-3xl border border-primary-container/30">
            <span class="material-symbols-outlined text-3xl">tune</span>
          </div>
          <div>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">Pilihan Teks Murni</h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed sm:leading-[1.6] max-w-[48ch]">
              Bagi Anda yang menyukai ketenangan membaca naskah polos seperti buku konvensional, Anda dapat mematikan gambar dan musik kapan saja.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/40 flex items-center justify-between text-xs sm:text-sm font-sans font-bold tracking-wide uppercase text-primary">
            <span>Kendali Penuh di Tangan Anda</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Foundational Mission Pillars (Tiga Alasan Membaca di Genmoire) -->
    <section class="max-w-container-max mx-auto px-4 sm:px-8 py-20 relative z-10 border-t border-border-subtle/50">
      <div ref="pillarsHeadingRef" class="text-center max-w-3xl mx-auto mb-16">
        <p class="font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          MISI & TUJUAN GENMOIRE
        </p>
        <h2 class="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
          Tiga Alasan Membaca di Genmoire
        </h2>
        <p class="font-ui-body text-base sm:text-lg text-text-secondary leading-relaxed max-w-[60ch] mx-auto text-balance">
          Membantu siapa saja menikmati buku dengan lebih nyaman, jujur, dan berkesan.
        </p>
      </div>

      <div ref="pillarsCardsRef" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Pillar 1: Real Reading Habit -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-lg flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl border border-primary/30">
            <span class="material-symbols-outlined text-3xl">calendar_month</span>
          </div>
          <div>
            <span class="font-sans text-xs font-bold uppercase tracking-wider text-primary">Manfaat #1</span>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mt-1 mb-3">
              Membiasakan Diri Membaca Nyata
            </h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed">
              Membantu Anda mencatat waktu membaca harian lewat kalender aktivitas membaca agar buku-buku yang telah dibeli benar-benar selesai dibaca, bukan sekadar menumpuk di rak.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/50 text-xs font-sans font-semibold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-base">check_circle</span>
            <span>Grafik Kebiasaan Membaca</span>
          </div>
        </div>

        <!-- Pillar 2: Imagination & Less Fatigue -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-lg flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl border border-secondary/30">
            <span class="material-symbols-outlined text-3xl">visibility</span>
          </div>
          <div>
            <span class="font-sans text-xs font-bold uppercase tracking-wider text-secondary">Manfaat #2</span>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mt-1 mb-3">
              Membantu Menghidupkan Imajinasi
            </h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed">
              Bagi siapa pun yang sering kesulitan membayangkan gambaran adegan di dalam pikiran saat membaca teks polos, panduan gambar dan suara membantu menghadirkan suasana cerita secara nyata.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/50 text-xs font-sans font-semibold text-secondary flex items-center gap-2">
            <span class="material-symbols-outlined text-base">palette</span>
            <span>Ilustrasi Latar & Audio Cerita</span>
          </div>
        </div>

        <!-- Pillar 3: Respecting Author & Community -->
        <div class="p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-lg flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform duration-300">
          <div class="w-14 h-14 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center text-3xl border border-primary-container/30">
            <span class="material-symbols-outlined text-3xl">forum</span>
          </div>
          <div>
            <span class="font-sans text-xs font-bold uppercase tracking-wider text-primary">Manfaat #3</span>
            <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight mt-1 mb-3">
              Tulisan Penulis Asli & Ruang Diskusi
            </h3>
            <p class="font-ui-body text-sm sm:text-base text-text-secondary leading-relaxed">
              Setiap kalimat asli sang pengarang tetap dipertahankan utuh tanpa disederhanakan oleh AI. Ditambah ruang komunitas ramah untuk saling berdiskusi dan berbagi ulasan buku.
            </p>
          </div>
          <div class="pt-4 border-t border-border-subtle/50 text-xs font-sans font-semibold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-base">groups</span>
            <span>Komunitas Pembaca Buku</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
