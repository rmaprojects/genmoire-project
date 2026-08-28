<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useAuthStore } from '@/stores/useAuthStore';
import GButton from '@/components/common/GButton.vue';

const router = useRouter();
const authStore = useAuthStore();

// Pure state-driven mode switching
const activeMode = ref<'login' | 'register'>('login');

// Form state - initialized BLANK per user requirement
const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const showPassword = ref<boolean>(false);
const showForgotModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const authContainerRef = ref<HTMLElement | null>(null);
const bookAssemblyRef = ref<HTMLElement | null>(null);
const formFieldsRef = ref<HTMLElement | null>(null);
const orb1Ref = ref<HTMLElement | null>(null);
const orb2Ref = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

const setMode = (mode: 'login' | 'register') => {
  if (activeMode.value === mode) return;
  activeMode.value = mode;
  errorMessage.value = '';

  nextTick(() => {
    if (formFieldsRef.value) {
      gsap.fromTo(
        formFieldsRef.value.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  });
};

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Ambient floating orbs
    if (orb1Ref.value) {
      gsap.to(orb1Ref.value, {
        x: 25,
        y: -30,
        scale: 1.15,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    if (orb2Ref.value) {
      gsap.to(orb2Ref.value, {
        x: -25,
        y: 25,
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });
    }

    // 2. Book Assembly 3D Entrance
    if (bookAssemblyRef.value) {
      gsap.from(bookAssemblyRef.value, {
        opacity: 0,
        y: 40,
        scale: 0.94,
        rotationY: -6,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
  }, authContainerRef.value || undefined);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});

const handleLogin = () => {
  if (!email.value.trim()) {
    errorMessage.value = 'Mohon masukkan alamat email Anda.';
    return;
  }
  if (!password.value) {
    errorMessage.value = 'Mohon masukkan kata sandi.';
    return;
  }
  isLoading.value = true;
  setTimeout(() => {
    authStore.login(email.value, password.value);
    isLoading.value = false;
    router.push('/dashboard');
  }, 400);
};

const handleRegister = () => {
  if (!name.value.trim()) {
    errorMessage.value = 'Mohon masukkan nama lengkap Anda.';
    return;
  }
  if (!email.value.trim()) {
    errorMessage.value = 'Mohon masukkan alamat email Anda.';
    return;
  }
  if (!password.value) {
    errorMessage.value = 'Mohon buat kata sandi baru.';
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = 'Kata sandi minimal terdiri dari 6 karakter.';
    return;
  }
  isLoading.value = true;
  setTimeout(() => {
    authStore.register(name.value, email.value, password.value);
    isLoading.value = false;
    router.push('/dashboard');
  }, 400);
};

const handleSubmit = () => {
  if (activeMode.value === 'login') {
    handleLogin();
  } else {
    handleRegister();
  }
};

const handleGoogleAuth = () => {
  isLoading.value = true;
  setTimeout(() => {
    authStore.loginWithGoogle();
    isLoading.value = false;
    router.push('/dashboard');
  }, 500);
};

const handleForgotPassword = () => {
  showForgotModal.value = true;
};

const isLogin = computed(() => activeMode.value === 'login');
</script>

<template>
  <div ref="authContainerRef" class="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-surface-primary">
    <!-- Atmospheric Background Patterns -->
    <div class="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[radial-gradient(#8B6914_1px,transparent_1px)] [background-size:24px_24px]"></div>
    <div ref="orb1Ref" class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div ref="orb2Ref" class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Main Auth Assembly (Ribbons + Book + Form) - Enlarged & Perfectly Centered -->
    <div ref="bookAssemblyRef" class="relative w-full max-w-5xl lg:max-w-6xl flex flex-col md:flex-row items-center justify-center z-10 my-auto py-6">
      
      <!-- 1. LEFT HORIZONTAL BOOKMARK RIBBONS (Shows ONLY icon when idle, expands with text when active) -->
      <div
        role="tablist"
        aria-label="Pilihan Autentikasi"
        class="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-center gap-3 md:gap-4 z-30 mb-4 md:mb-0 md:-mr-5 shrink-0 select-none"
      >
        <!-- Login Ribbon Tab -->
        <button
          type="button"
          role="tab"
          :aria-selected="isLogin"
          aria-controls="auth-form-panel"
          class="ribbon-swallowtail-left relative h-14 sm:h-15 transition-all duration-300 ease-out flex items-center cursor-pointer group shrink-0 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          :class="[
            isLogin
              ? 'w-48 sm:w-56 bg-gradient-to-r from-[#6A4D19] via-[#856322] to-[#9C752B] text-[#F0EAE1] shadow-2xl z-20 font-bold justify-start pl-8 sm:pl-9 pr-6 border-y border-l border-[#9C752B]/40'
              : 'w-24 sm:w-28 bg-[#2A231B] dark:bg-[#221D17] text-[#BA9248]/75 hover:text-[#BA9248] hover:w-28 sm:hover:w-32 hover:bg-[#352D23] opacity-90 hover:opacity-100 z-10 justify-start pl-7 pr-3 border-y border-l border-[#544128]/60 shadow-md'
          ]"
          :title="isLogin ? 'Mode Masuk Aktif' : 'Beralih ke mode Masuk'"
          @click="setMode('login')"
        >
          <!-- Subtle Gold Stitch Accent on Left when active -->
          <div
            v-if="isLogin"
            class="absolute left-6 top-3 bottom-3 w-0.5 border-l border-dashed border-white/40 pointer-events-none"
          />

          <div class="flex items-center gap-3 relative z-10">
            <span
              class="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:scale-110"
              :class="{ 'fill': isLogin }"
            >
              person
            </span>
            <!-- Show label ONLY when active/selected -->
            <Transition name="fade">
              <span v-if="isLogin" class="text-sm sm:text-base font-bold font-sans tracking-tight whitespace-nowrap">
                Masuk
              </span>
            </Transition>
          </div>
        </button>

        <!-- Register Ribbon Tab -->
        <button
          type="button"
          role="tab"
          :aria-selected="!isLogin"
          aria-controls="auth-form-panel"
          class="ribbon-swallowtail-left relative h-14 sm:h-15 transition-all duration-300 ease-out flex items-center cursor-pointer group shrink-0 focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:outline-none"
          :class="[
            !isLogin
              ? 'w-48 sm:w-56 bg-gradient-to-r from-[#344820] via-[#435D29] to-[#557734] text-[#F0EAE1] shadow-2xl z-20 font-bold justify-start pl-8 sm:pl-9 pr-6 border-y border-l border-[#557734]/40'
              : 'w-24 sm:w-28 bg-[#1F2618] dark:bg-[#1A2014] text-[#749654]/75 hover:text-[#749654] hover:w-28 sm:hover:w-32 hover:bg-[#28321F] opacity-90 hover:opacity-100 z-10 justify-start pl-7 pr-3 border-y border-l border-[#3E4F28]/60 shadow-md'
          ]"
          :title="!isLogin ? 'Mode Daftar Aktif' : 'Beralih ke mode Daftar'"
          @click="setMode('register')"
        >
          <!-- Subtle Sage Stitch Accent on Left when active -->
          <div
            v-if="!isLogin"
            class="absolute left-6 top-3 bottom-3 w-0.5 border-l border-dashed border-white/40 pointer-events-none"
          />

          <div class="flex items-center gap-3 relative z-10">
            <span
              class="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:scale-110"
              :class="{ 'fill': !isLogin }"
            >
              person_add
            </span>
            <!-- Show label ONLY when active/selected -->
            <Transition name="fade">
              <span v-if="!isLogin" class="text-sm sm:text-base font-bold font-sans tracking-tight whitespace-nowrap">
                Daftar
              </span>
            </Transition>
          </div>
        </button>
      </div>

      <!-- 2. MIDDLE: THE BOOK COVER (Substantial Grand Hardcover Volume with Framed Title Cartouche) -->
      <div
        class="w-full md:w-[420px] lg:w-[460px] min-h-[580px] md:min-h-[660px] rounded-3xl p-7 sm:p-9 lg:p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden transition-colors duration-500 z-20 shrink-0 border-2"
        :class="isLogin
          ? 'bg-gradient-to-br from-[#543D15] via-[#3D2C0E] to-[#1C1406] border-[#78571E]/60 shadow-stone-950/60'
          : 'bg-gradient-to-br from-[#2D3E1B] via-[#202C13] to-[#0E1508] border-[#3F5B25]/60 shadow-stone-950/60'"
      >
        <!-- Book Spine Hinge Line (Left inner crease) -->
        <div class="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-white/20 border-r border-dashed border-white/10 pointer-events-none"></div>

        <!-- Atmospheric Glow & Shading -->
        <div class="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -left-12 -bottom-12 w-56 h-56 bg-black/40 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Book Header Title Box / Cartouche Plate (Framed Box) -->
        <div class="relative z-10 bg-black/25 dark:bg-black/40 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-lg">
          <div class="flex items-center gap-2 mb-2 opacity-85">
            <span class="material-symbols-outlined text-base">auto_stories</span>
            <span class="text-[10px] font-sans font-bold tracking-widest uppercase">Genmoire Book Reader</span>
          </div>
          <Transition name="slide-fade" mode="out-in">
            <div :key="activeMode">
              <h2 class="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {{ isLogin ? 'Selamat Datang.' : 'Daftar Sekarang.' }}
              </h2>
              <p class="text-xs sm:text-sm font-reading text-white/90 mt-2 leading-relaxed italic">
                {{ isLogin
                  ? 'Masuk ke akun Anda dan lanjutkan membaca buku favorit Anda.'
                  : 'Buat akun baru untuk mulai menikmati buku dalam format visual novel.'
                }}
              </p>
            </div>
          </Transition>
        </div>

        <!-- Center Illustration / Seal (Fixed height) -->
        <div class="h-40 sm:h-48 flex items-center justify-center relative z-10 select-none">
          <div class="relative flex items-center justify-center">
            <!-- Floating icons -->
            <span class="material-symbols-outlined text-white/30 text-2xl absolute -top-5 -left-8 animate-pulse">music_note</span>
            <span class="material-symbols-outlined text-white/40 text-xl absolute -bottom-3 -right-8 animate-bounce">auto_stories</span>
            <span class="material-symbols-outlined text-white/35 text-lg absolute top-8 -right-10 animate-pulse">menu_book</span>

            <!-- Main Book Medallion -->
            <div class="w-24 h-24 sm:w-30 sm:h-30 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transform transition-transform hover:scale-105">
              <Transition name="scale-fade" mode="out-in">
                <span :key="activeMode" class="material-symbols-outlined text-5xl sm:text-6xl">
                  {{ isLogin ? 'menu_book' : 'person_add' }}
                </span>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Bottom Book Meta Box (Preserving user's RMA Projects text) -->
        <div class="relative z-10 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-white/80 font-sans shadow-sm bg-black/20 border border-white/10">
          <p>Project Genmoire</p>
          <p>©️ RMA Projects</p>
        </div>
      </div>

      <!-- 3. RIGHT: FORM PANEL (Expanded height to comfortably contain all content inside border) -->
      <div
        id="auth-form-panel"
        role="tabpanel"
        class="w-full md:flex-1 min-h-[580px] md:min-h-[660px] bg-surface-secondary/95 dark:bg-[#1E1B18]/95 border-2 border-border-subtle/80 rounded-3xl md:rounded-l-none md:rounded-r-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 mt-4 md:mt-0 md:-ml-4 shadow-2xl backdrop-blur-md"
      >
        <!-- Form Content Container -->
        <div class="max-w-md w-full mx-auto my-auto space-y-4">
          <!-- Title & Subtitle with Smooth Crossfade -->
          <div class="h-14 flex flex-col justify-center">
            <Transition name="slide-fade" mode="out-in">
              <div :key="activeMode">
                <h1 class="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface">
                  {{ isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru' }}
                </h1>
                <p class="text-xs sm:text-sm text-text-secondary mt-0.5">
                  {{ isLogin
                    ? 'Masukkan email dan kata sandi Anda untuk melanjutkan.'
                    : 'Lengkapi data diri Anda untuk menyimpan riwayat membaca.'
                  }}
                </p>
              </div>
            </Transition>
          </div>

          <!-- Google 1-Click SSO Button -->
          <button
            type="button"
            class="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-border-subtle bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 text-sm font-bold text-on-surface shadow-sm active:scale-[0.99] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            :disabled="isLoading"
            @click="handleGoogleAuth"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{{ isLogin ? 'Masuk Cepat dengan Google' : 'Daftar Cepat dengan Google' }}</span>
          </button>

          <div class="flex items-center gap-4">
            <div class="flex-1 h-px bg-border-subtle"></div>
            <span class="text-[11px] font-sans uppercase tracking-widest text-text-muted">atau email</span>
            <div class="flex-1 h-px bg-border-subtle"></div>
          </div>

          <form ref="formFieldsRef" class="space-y-3" @submit.prevent="handleSubmit">
            <!-- Fluid Username Field (Smooth Collapse / Expand) -->
            <Transition name="expand">
              <div v-if="!isLogin" class="space-y-1 overflow-hidden">
                <label for="auth-name-input" class="text-xs font-bold uppercase tracking-wider text-text-secondary">Nama Lengkap</label>
                <div class="relative">
                  <input
                    id="auth-name-input"
                    v-model="name"
                    type="text"
                    autocomplete="name"
                    required
                    :disabled="isLoading"
                    class="w-full bg-surface-container/80 border border-border-subtle rounded-xl py-2.5 pl-4 pr-11 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all shadow-inner"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                  <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[20px] pointer-events-none">
                    person
                  </span>
                </div>
              </div>
            </Transition>

            <!-- Email Input -->
            <div class="space-y-1">
              <label for="auth-email-input" class="text-xs font-bold uppercase tracking-wider text-text-secondary">Alamat Email</label>
              <div class="relative">
                <input
                  id="auth-email-input"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  :disabled="isLoading"
                  class="w-full bg-surface-container/80 border border-border-subtle rounded-xl py-2.5 pl-4 pr-11 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
                  placeholder="nama@email.com"
                />
                <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[20px] pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <label for="auth-password-input" class="text-xs font-bold uppercase tracking-wider text-text-secondary">Kata Sandi</label>
                <button
                  v-if="isLogin"
                  type="button"
                  class="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  @click="handleForgotPassword"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div class="relative">
                <input
                  id="auth-password-input"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  required
                  :disabled="isLoading"
                  class="w-full bg-surface-container/80 border border-border-subtle rounded-xl py-2.5 pl-4 pr-11 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner font-sans"
                  placeholder="Ketik kata sandi Anda..."
                />
                <button
                  type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-on-surface transition-colors cursor-pointer p-0.5 rounded focus:none"
                  :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                  :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                  @click="showPassword = !showPassword"
                >
                  <span class="material-symbols-outlined text-[20px] block">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Inline Animated Error Message -->
            <Transition name="fade">
              <div
                v-if="errorMessage"
                role="alert"
                class="p-2.5 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-2 text-xs font-medium"
              >
                <span class="material-symbols-outlined text-base shrink-0">error</span>
                <span>{{ errorMessage }}</span>
              </div>
            </Transition>

            <!-- Submit CTA -->
            <GButton
              type="submit"
              size="lg"
              :variant="isLogin ? 'primary' : 'secondary'"
              :iconRight="isLogin ? 'arrow_forward' : 'person_add'"
              :loading="isLoading"
              customClass="w-full mt-2 uppercase tracking-wider font-bold"
            >
              {{ isLogin ? 'MASUK SEKARANG' : 'DAFTAR SEKARANG' }}
            </GButton>

            <!-- Question placed DIRECTLY BELOW the submit button per user request -->
            <div class="text-center text-xs sm:text-sm text-text-secondary pt-2">
              <Transition name="fade" mode="out-in">
                <div :key="activeMode" class="flex items-center justify-center">
                  <span>{{ isLogin ? 'Belum memiliki akun?' : 'Sudah memiliki akun?' }}</span>
                  <button
                    type="button"
                    class="text-primary font-bold hover:underline ml-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                    @click="setMode(isLogin ? 'register' : 'login')"
                  >
                    {{ isLogin ? 'Daftar Sekarang' : 'Masuk di Sini' }}
                  </button>
                </div>
              </Transition>
            </div>
          </form>
        </div>

        <!-- Footer terms info -->
        <p class="text-center text-[11px] text-text-muted mt-2">
          Dengan masuk atau mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Genmoire.
        </p>
      </div>
    </div>

    <!-- Forgot Password Info Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showForgotModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="showForgotModal = false"
        >
          <div class="bg-surface-secondary border border-border-subtle rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">key</span>
              </div>
              <div>
                <h3 class="font-display-lg text-lg font-bold text-on-surface">Akun Demo Pengujian</h3>
                <p class="text-xs text-text-secondary">Simulasi Masuk Cepat</p>
              </div>
            </div>

            <p class="text-xs text-text-secondary leading-relaxed">
              Genmoire bekerja langsung di peramban Anda. Anda dapat masuk menggunakan email apa saja atau menggunakan akun demo kami:
            </p>

            <div class="p-3 rounded-xl bg-surface-container border border-border-subtle/80 font-sans text-xs space-y-1">
              <div class="flex justify-between">
                <span class="text-text-muted">Email:</span>
                <span class="text-on-surface font-bold">pembaca@genmoire.id</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-muted">Kata Sandi:</span>
                <span class="text-primary font-bold">genmoire123</span>
              </div>
            </div>

            <GButton
              variant="primary"
              size="sm"
              customClass="w-full"
              @click="showForgotModal = false; email = 'pembaca@genmoire.id'; password = 'genmoire123'"
            >
              Gunakan Akun Demo
            </GButton>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Authentic Horizontal Bookmark Ribbon with Left Swallowtail V-cut */
.ribbon-swallowtail-left {
  clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 18px 50%, 0% 0%);
  filter: drop-shadow(-2px 3px 6px rgba(0, 0, 0, 0.35));
}

/* Fluid slide & fade transitions for smooth state switching */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Expand / collapse animation for register fields */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 100px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
  margin-top: 0;
  margin-bottom: 0;
}
</style>
