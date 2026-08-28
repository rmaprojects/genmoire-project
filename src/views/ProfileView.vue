<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import TierBadge from '@/components/dashboard/TierBadge.vue';
import GButton from '@/components/common/GButton.vue';
import GInput from '@/components/common/GInput.vue';
import GModal from '@/components/common/GModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const profileContainerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const topGridRef = ref<HTMLElement | null>(null);
const customSectionRef = ref<HTMLElement | null>(null);

// Profile state
const editingName = ref<string>(authStore.currentUser.name);
const userBio = ref<string>(authStore.currentUser.bio || '');
const selectedTraitId = ref<string>(authStore.currentUser.featuredTraitId || '');
const isBioSaved = ref<boolean>(false);

// Modals state
const isLogoutModalOpen = ref<boolean>(false);
const isAvatarModalOpen = ref<boolean>(false);
const isNameModalOpen = ref<boolean>(false);
const customAvatarUrl = ref<string>('');

// Preset Avatars
const avatarPresets = [
  { id: '1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80', label: 'Cendekia' },
  { id: '2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', label: 'Pujangga' },
  { id: '3', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80', label: 'Penjelajah' },
  { id: '4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80', label: 'Pustakawan' },
  { id: '5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', label: 'Filsuf' },
  { id: '6', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', label: 'Bibliophile' },
  { id: '7', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80', label: 'Arsiparis' },
  { id: '8', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80', label: 'Penutur' },
];

const selectedAvatar = ref<string>(authStore.currentUser.avatar);

// Get current selected trait object
const currentTrait = computed(() => {
  return profileStore.allTraits.find(t => t.id === selectedTraitId.value);
});

// Format title: "[Name] the [Trait Title]" (e.g. "Raka the Night Owl")
const formattedTitleName = computed(() => {
  const baseName = authStore.currentUser.name || 'Pembaca';
  if (selectedTraitId.value && currentTrait.value) {
    return `${baseName} the ${currentTrait.value.title}`;
  }
  return baseName;
});

const unlockedTraits = computed(() => {
  return profileStore.allTraits.filter(t => profileStore.isTraitUnlocked(t.id));
});

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      // 1. Header entrance
      if (headerRef.value) {
        gsap.from(headerRef.value, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 2. User card and Tier card entrance
      if (topGridRef.value) {
        gsap.from(topGridRef.value.children, {
          opacity: 0,
          y: 25,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 3. Customization section
      if (customSectionRef.value) {
        gsap.from(customSectionRef.value, {
          opacity: 0,
          y: 25,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.15,
          clearProps: 'opacity,transform',
        });
      }
    }, profileContainerRef.value || undefined);
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});

// Toggle trait selection (clicking on already selected trait cancels/unselects)
const toggleTraitSelection = (traitId: string) => {
  if (selectedTraitId.value === traitId) {
    selectedTraitId.value = ''; // Cancel / Unselect
  } else {
    selectedTraitId.value = traitId;
  }
  authStore.updateProfile(authStore.currentUser.name, selectedTraitId.value, userBio.value);
};

// Save bio
const handleSaveBio = () => {
  authStore.updateBio(userBio.value);
  isBioSaved.value = true;
  setTimeout(() => {
    isBioSaved.value = false;
  }, 2500);
};

// Save Name Modal
const handleSaveName = () => {
  if (editingName.value.trim()) {
    authStore.updateName(editingName.value.trim());
    isNameModalOpen.value = false;
  }
};

// Save Avatar Modal
const handleSaveAvatar = () => {
  const finalAvatar = customAvatarUrl.value.trim() || selectedAvatar.value;
  authStore.updateAvatar(finalAvatar);
  isAvatarModalOpen.value = false;
};

// Handle local file upload for avatar
const handleAvatarFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        selectedAvatar.value = e.target.result as string;
        customAvatarUrl.value = '';
      }
    };
    reader.readAsDataURL(target.files[0]);
  }
};

// Logout handler
const confirmLogout = () => {
  isLogoutModalOpen.value = false;
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <div ref="profileContainerRef" class="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
    
    <!-- Page Header (Clean, Editorial, No logout button at top) -->
    <div ref="headerRef" class="pb-6 border-b border-border-subtle/80">
      <h1 class="font-display-lg text-3xl sm:text-4xl font-extrabold text-on-surface">
        Profil Pembaca
      </h1>
      <p class="text-base text-text-secondary mt-1">
        Kelola identitas, bio pribadi, dan gelar pencapaian membaca Anda.
      </p>
    </div>

    <!-- User Identity & Tier Overview Grid -->
    <div ref="topGridRef" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- User Card (Avatar, Name with 'the [Trait]', Bio & Logout) -->
      <div class="md:col-span-1 bg-surface-secondary rounded-3xl p-6 border border-border-subtle shadow-warm-md flex flex-col items-center text-center space-y-5">
        
        <!-- Avatar with Edit Button -->
        <div class="relative group">
          <img
            :src="authStore.currentUser.avatar"
            :alt="authStore.currentUser.name"
            class="w-28 h-28 rounded-full object-cover border-4 border-primary/30 shadow-md transition-transform group-hover:scale-105"
          />
          <button
            type="button"
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary hover:bg-primary-hover hover:scale-110 transition-all shadow-md flex items-center justify-center cursor-pointer border-2 border-surface-secondary"
            title="Ubah Foto Profil"
            @click="isAvatarModalOpen = true; selectedAvatar = authStore.currentUser.avatar"
          >
            <span class="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>

        <!-- Name with 'the [Trait]' and Edit Name Button -->
        <div class="w-full space-y-1.5">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <h2 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface leading-snug">
              {{ formattedTitleName }}
            </h2>
            <button
              type="button"
              class="p-1 rounded-lg text-text-muted hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              title="Edit Nama"
              @click="editingName = authStore.currentUser.name; isNameModalOpen = true"
            >
              <span class="material-symbols-outlined text-base">edit</span>
            </button>
          </div>

          <p class="text-xs sm:text-sm font-sans text-text-muted">
            {{ authStore.currentUser.email }}
          </p>

          <span class="inline-block px-3 py-0.5 rounded-full text-[11px] font-sans font-bold bg-primary/10 text-primary border border-primary/20">
            Bergabung {{ authStore.currentUser.joinedDate }}
          </span>
        </div>

        <!-- Streak & Read Time Stats -->
        <div class="w-full pt-3 border-t border-border-subtle/60 grid grid-cols-2 gap-2 text-center text-xs">
          <div class="p-2 rounded-2xl bg-surface-container/60">
            <p class="text-text-muted">Streak</p>
            <p class="text-lg font-bold text-primary">{{ profileStore.currentStreak }} Hari</p>
          </div>
          <div class="p-2 rounded-2xl bg-surface-container/60">
            <p class="text-text-muted">Waktu Baca</p>
            <p class="text-lg font-bold text-primary">{{ profileStore.totalMinutesRead }}m</p>
          </div>
        </div>

        <!-- Bio Textarea Section (Under Name & Stats) -->
        <div class="w-full pt-3 border-t border-border-subtle/60 text-left space-y-2">
          <div class="flex items-center justify-between mt-5">
            <label class="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-primary">edit_note</span>
              Bio
            </label>
            <span v-if="isBioSaved" class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Tersimpan!
            </span>
          </div>

          <div class="relative">
            <textarea
              v-model="userBio"
              rows="3"
              maxlength="160"
              placeholder="Tuliskan bio singkat atau kutipan favorit Anda..."
              class="w-full bg-surface-container/80 border border-border-subtle rounded-2xl p-3 text-xs sm:text-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none shadow-inner custom-scrollbar"
              @blur="handleSaveBio"
            />
            <div class="flex justify-between items-center text-[10px] text-text-muted px-1 mt-0.5">
              <span>{{ userBio.length }}/160 karakter</span>
            </div>
          </div>
        </div>

        <!-- Log Out Button (Relocated Below Bio with Confirmation Alert Modal) -->
        <div class="w-full pt-2">
          <GButton
            variant="danger"
            size="sm"
            icon="logout"
            rounded
            class="w-full justify-center shadow-xs"
            @click="isLogoutModalOpen = true"
          >
            Keluar Akun
          </GButton>
        </div>

      </div>

      <!-- Tier Status Card (Clean, Polished, Directly Rendered as Top-Level Card) -->
      <TierBadge
        class="md:col-span-2"
        :tierInfo="profileStore.currentTierInfo"
        :progressToNext="profileStore.tierProgressPercent"
      />
    </div>

    <!-- Featured Trait Selection Section (Only "Pilih Pencapaian Utama") -->
    <div ref="customSectionRef" class="bg-surface-secondary rounded-3xl p-6 sm:p-8 border border-border-subtle/60 dark:border-transparent shadow-warm-md space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border-subtle/70">
        <div>
          <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">workspace_premium</span>
            Pilih Pencapaian Utama
          </h3>
          <p class="text-xs sm:text-sm text-text-secondary mt-1">
            Gelar pencapaian akan disematkan ke nama Anda (misal: <em>{{ authStore.currentUser.name }} the {{ currentTrait?.title || 'Night Owl' }}</em>). Klik 2x atau klik ulang untuk membatalkan pilihan.
          </p>
        </div>

        <span class="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 dark:border-transparent shrink-0 self-start sm:self-auto">
          {{ unlockedTraits.length }} Lencana Terbuka
        </span>
      </div>

      <div class="space-y-4">
        <!-- Traits Grid with Toggle Cancel Logic -->
        <div v-if="unlockedTraits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div
            v-for="trait in unlockedTraits"
            :key="trait.id"
            class="p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative select-none group"
            :class="[
              selectedTraitId === trait.id
                ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary'
                : 'bg-surface-container/60 border-border-subtle/50 hover:bg-surface-container hover:border-primary/40 dark:border-transparent'
            ]"
            @click="toggleTraitSelection(trait.id)"
          >
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="selectedTraitId === trait.id ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-secondary text-primary'"
            >
              <span class="material-symbols-outlined text-2xl">{{ trait.icon }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <p class="text-sm font-bold text-on-surface dark:text-[#F3EFE6] truncate">{{ trait.title }}</p>
                <span
                  v-if="selectedTraitId === trait.id"
                  class="material-symbols-outlined text-primary text-base shrink-0"
                  title="Klik ulang untuk membatalkan"
                >
                  check_circle
                </span>
              </div>
              
              <!-- Cara Mendapatkan Pencapaian (Persyaratan / Hint) -->
              <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-1 leading-relaxed">
                <span class="font-semibold text-text-primary dark:text-[#E6DFD5]">Syarat:</span> {{ trait.secretHint }}
              </p>
              
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-block text-[10px] font-sans uppercase font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 dark:border-transparent">
                  {{ trait.rarity }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6 rounded-2xl bg-surface-container/50 border border-border-subtle/50 dark:border-transparent text-center text-sm text-text-secondary">
          Belum ada pencapaian yang terbuka. Lanjutkan membaca buku untuk membuka lencana rahasia pertama Anda!
        </div>
      </div>
    </div>

    <!-- Modal 1: Edit Name Modal -->
    <GModal
      v-model="isNameModalOpen"
      title="Ubah Nama Tampilan"
      icon="edit"
      maxWidth="md"
    >
      <div class="space-y-5 py-2">
        <p class="text-base text-text-primary dark:text-[#E6DFD5] leading-relaxed">
          Masukkan nama lengkap atau nama panggilan yang ingin Anda gunakan di Genmoire:
        </p>
        <GInput
          v-model="editingName"
          label="Nama Lengkap / Panggilan"
          icon="badge"
          placeholder="Ketik nama Anda..."
          @keyup.enter="handleSaveName"
        />
      </div>

      <template #footer>
        <GButton size="md" variant="ghost" rounded @click="isNameModalOpen = false">
          Batal
        </GButton>
        <GButton size="md" variant="primary" icon="check" rounded @click="handleSaveName">
          Simpan Nama
        </GButton>
      </template>
    </GModal>

    <!-- Modal 2: Edit Avatar Modal (Presets & Custom Image) -->
    <GModal
      v-model="isAvatarModalOpen"
      title="Pilih Foto Profil"
      icon="photo_camera"
      maxWidth="lg"
    >
      <div class="space-y-6 py-2">
        <div>
          <p class="text-sm font-bold uppercase tracking-wider text-text-primary dark:text-[#F3EFE6] mb-4">
            Pilihan Avatar Karakter Sastra
          </p>
          <div class="grid grid-cols-4 gap-3 sm:gap-4">
            <button
              v-for="preset in avatarPresets"
              :key="preset.id"
              type="button"
              class="relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer hover:scale-105 group"
              :class="selectedAvatar === preset.url ? 'border-primary ring-2 ring-primary/40 shadow-md' : 'border-border-subtle hover:border-primary/50'"
              @click="selectedAvatar = preset.url; customAvatarUrl = ''"
            >
              <img :src="preset.url" :alt="preset.label" class="w-full h-full object-cover" />
              <div
                v-if="selectedAvatar === preset.url"
                class="absolute inset-0 bg-primary/30 flex items-center justify-center text-white"
              >
                <span class="material-symbols-outlined text-2xl font-bold">check_circle</span>
              </div>
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-border-subtle/80 space-y-3">
          <p class="text-sm font-bold uppercase tracking-wider text-text-primary dark:text-[#F3EFE6]">
            Atau Unggah / Masukkan URL Foto Sendiri
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="customAvatarUrl"
              type="url"
              placeholder="https://example.com/foto-anda.jpg"
              class="flex-1 bg-surface-primary dark:bg-[#181512] border border-border-subtle rounded-2xl px-4 py-3 text-base text-on-surface dark:text-[#E6DFD5] placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              @input="selectedAvatar = customAvatarUrl"
            />
            
            <label class="px-5 py-3 rounded-2xl bg-surface-primary dark:bg-[#181512] hover:bg-surface-container border border-border-subtle text-sm font-bold text-on-surface dark:text-[#E6DFD5] flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 active:scale-95 shadow-xs">
              <span class="material-symbols-outlined text-xl text-primary">upload_file</span>
              <span>Pilih File</span>
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarFileUpload" />
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <GButton size="md" variant="ghost" rounded @click="isAvatarModalOpen = false">
          Batal
        </GButton>
        <GButton size="md" variant="primary" icon="check" rounded @click="handleSaveAvatar">
          Terapkan Foto
        </GButton>
      </template>
    </GModal>

    <!-- Modal 3: Logout Confirmation Alert Modal (Clean, No Nested Box Containers) -->
    <GModal
      v-model="isLogoutModalOpen"
      title="Konfirmasi Keluar Akun"
      icon="logout"
      maxWidth="sm"
    >
      <div class="space-y-3 py-2">
        <p class="text-lg sm:text-xl font-bold text-on-surface dark:text-[#F3EFE6] leading-snug">
          Apakah Anda yakin ingin keluar dari akun Genmoire Anda?
        </p>
        <p class="text-base text-text-secondary dark:text-[#C5BBAF] leading-relaxed">
          Seluruh koleksi buku, catatan baca, dan lencana pencapaian Anda tetap tersimpan dengan aman di peramban ini.
        </p>
      </div>

      <template #footer>
        <GButton size="md" variant="ghost" rounded @click="isLogoutModalOpen = false">
          Batal
        </GButton>
        <GButton size="md" variant="danger" icon="logout" rounded @click="confirmLogout">
          Ya, Keluar Akun
        </GButton>
      </template>
    </GModal>

  </div>
</template>
