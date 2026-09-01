import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TierDefinition, TraitDefinition, ReadingHistoryEntry } from '@/types/profile';
import traitsData from '@/data/traits.json';
import confetti from 'canvas-confetti';

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    tier: 1,
    title: 'BookTok Scroller',
    englishTitle: 'Casual & Trendy Reader',
    min: 0,
    max: 2,
    description: 'Eksplorasi kasual dan penemuan buku baru yang sedang tren.',
    personality: 'Penjelajah tren & pembaca pemula yang baru memulai kebiasaan membaca.',
    visualTreatment: 'Lencana Perunggu Hangat dengan aksen minimalis.',
    emblemIcon: 'smartphone',
    badgeClass: 'text-[#795900] bg-[#F1EDE6] border-[#D0C4C0] dark:bg-[#27231F] dark:text-[#BA9248] dark:border-[#423A32]',
    accentColor: '#795900',
    cardBorderClass: 'border-border-subtle hover:border-[#795900]/50',
    rewards: [
      {
        icon: 'auto_awesome',
        label: '25 Kredit AI Explain per-bulan',
        description: 'Bantuan pemahaman istilah, idiom, dan konteks cerita saat membaca.',
      },
    ],
    benefits: [
      'Akses membaca visual novel dasar',
      'Pencatatan statistik membaca harian',
      'Tergabung dalam forum komunitas',
    ],
  },
  {
    tier: 2,
    title: 'Genmoire Reader',
    englishTitle: 'Aesthetic Curation Reader',
    min: 3,
    max: 9,
    description: 'Mulai konsisten membaca mingguan dan mengkurasi koleksi buku estetis.',
    personality: 'Kurator bacaan estetis dengan ketertarikan visual & audio narasi.',
    visualTreatment: 'Lencana Perak Elegan dengan motif kolektor buku.',
    emblemIcon: 'collections_bookmark',
    badgeClass: 'text-[#5D5451] bg-[#F1EDE6] border-[#D0C4C0] dark:bg-[#27231F] dark:text-[#9E9385] dark:border-[#423A32]',
    accentColor: '#5D5451',
    cardBorderClass: 'border-border-subtle hover:border-[#9E9385]/50',
    rewards: [
      {
        icon: 'auto_awesome',
        label: '50 Kredit AI Explain per-bulan',
        description: 'Dua kali lipat kredit untuk eksplorasi glif istilah cerita.',
      },
      {
        icon: 'percent',
        label: '10% Voucher Diskon Buku',
        description: 'Voucher diskon membeli buku setiap menamatkan 10 buku.',
      },
    ],
    benefits: [
      'Semua manfaat BookTok Scroller',
      'Akses kustomisasi avatar profil',
      'Lencana Tier 2 eksklusif di profil & forum',
    ],
  },
  {
    tier: 3,
    title: 'Imperial Scholar',
    englishTitle: 'Academic Authority Reader',
    min: 10,
    max: 24,
    description: 'Pembaca setia yang rutin menyelesaikan buku dengan wawasan kritis.',
    personality: 'Cendekiawan literatur yang mengapresiasi kedalaman narasi.',
    visualTreatment: 'Lencana Emas Kencana dengan lambang akademis berwibawa.',
    emblemIcon: 'workspace_premium',
    badgeClass: 'text-primary bg-primary/10 border-primary/30 dark:bg-[#5C4114]/30 dark:text-[#BA9248] dark:border-[#5C4114]/60',
    accentColor: '#BA9248',
    cardBorderClass: 'border-primary/40 hover:border-primary',
    rewards: [
      {
        icon: 'auto_awesome',
        label: '75 Kredit AI Explain per-bulan',
        description: 'Dukungan mendalam untuk buku klasik dan istilah kompleks.',
      },
      {
        icon: 'percent',
        label: '10% Voucher Diskon Buku',
        description: 'Voucher diskon membeli buku setiap menamatkan 6 buku.',
      },
    ],
    benefits: [
      'Semua manfaat Genmoire Reader',
      'Akses lebih cepat untuk voucher diskon (tiap 6 buku tamat)',
      'Lencana Cendekiawan Emas berkilau di forum',
      'Prioritas respons AI Explain berkecepatan tinggi',
    ],
  },
  {
    tier: 4,
    title: 'Lorekeeper',
    englishTitle: 'Deep Lore Devotion Reader',
    min: 25,
    max: 49,
    description: 'Pembaca berpengalaman dengan dedikasi tinggi pada dunia sastra.',
    personality: 'Penjaga warisan kisah dengan jam baca intensif dan konsisten.',
    visualTreatment: 'Lencana Ametis Ungu & Zamrud dengan sigil literatur kuno.',
    emblemIcon: 'history_edu',
    badgeClass: 'text-[#4A6729] bg-[#E8EEDF] border-[#B7D29E] dark:bg-[#344820]/30 dark:text-[#749654] dark:border-[#344820]/60',
    accentColor: '#749654',
    cardBorderClass: 'border-[#4A6729]/40 hover:border-[#749654]',
    rewards: [
      {
        icon: 'auto_awesome',
        label: '80 Kredit AI Explain per-bulan',
        description: 'Kredit melimpah untuk membaca karya tebal dan multi-bab.',
      },
      {
        icon: 'percent',
        label: '10% Voucher Diskon Buku',
        description: 'Voucher diskon membeli buku setiap menamatkan 5 buku.',
      },
    ],
    benefits: [
      'Semua manfaat Imperial Scholar',
      'Akses voucher diskon lebih sering (hanya tiap 5 buku tamat)',
      'Pemberian lencana khusus Lorekeeper di profil',
      'Fitur eksklusif catatan marjin interaktif',
    ],
  },
  {
    tier: 5,
    title: 'Loremaster',
    englishTitle: 'Legendary Status Reader',
    min: 50,
    max: Infinity,
    description: 'Puncak tertinggi pembaca legendaris dengan wawasan paripurna.',
    personality: 'Penguasa literatur legendaris dengan rekor jam baca tertinggi.',
    visualTreatment: 'Lencana Obsidian & Emas Murni dengan mahkota kehormatan.',
    emblemIcon: 'military_tech',
    badgeClass: 'text-primary bg-primary/15 border-primary/40 dark:bg-[#5C4114]/40 dark:text-[#D8D0C3] dark:border-[#5C4114]/80',
    accentColor: '#D8D0C3',
    cardBorderClass: 'border-primary/60 hover:border-primary',
    rewards: [
      {
        icon: 'auto_awesome',
        label: '90 Kredit AI Explain per-bulan',
        description: 'Kapasitas maksimal kredit pemahaman AI setiap bulannya.',
      },
      {
        icon: 'stars',
        label: '15% Voucher Diskon Buku',
        description: 'Dukungan mendalam untuk buku klasik dan istilah kompleks.',
      },
    ],
    benefits: [
      'Gelar & Lencana eksklusif Loremaster',
      'Kupon Diskon Buku 40% dari Penerbit Partner',
      'Kredit AI Explain 100x per bulan',
      'Akses Ruang Diskusi VIP & Teori Spoiler',
      'Akses awal ke buku eksklusif dan beta fitur Genmoire',
    ],
  },
];

export const useProfileStore = defineStore('profile', () => {
  // Load or pre-seed rich profile state
  const booksCompleted = ref<number>(
    Number(localStorage.getItem('gm-books-completed')) || 12
  );
  const currentStreak = ref<number>(
    Number(localStorage.getItem('gm-current-streak')) || 7
  );
  const longestStreak = ref<number>(
    Number(localStorage.getItem('gm-longest-streak')) || 14
  );
  const lastReadDate = ref<string | null>(
    localStorage.getItem('gm-last-read-date') || new Date().toISOString().split('T')[0]
  );
  const explainCount = ref<number>(
    Number(localStorage.getItem('gm-explain-count')) || 42
  );
  const notesOpenedCount = ref<number>(
    Number(localStorage.getItem('gm-notes-count')) || 18
  );

  const unlockedTraits = ref<string[]>(
    JSON.parse(localStorage.getItem('gm-unlocked-traits') || '["night-owl", "speed-reader", "curious-mind"]')
  );

  const pendingTraitToast = ref<TraitDefinition | null>(null);
  const showTierUpOverlay = ref<boolean>(false);
  const previousTier = ref<number>(
    Number(localStorage.getItem('gm-current-tier')) || 3
  );

  // Generate realistic 53-week daily read time data for heatmap
  const getInitialDailyReadTime = (): Record<string, number> => {
    const saved = localStorage.getItem('gm-daily-read-time');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    const data: Record<string, number> = {};
    const today = new Date();
    // Pre-populate last 90 days with active reading clusters
    for (let i = 90; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const rand = Math.random();
      if (rand > 0.4) {
        data[dateStr] = Math.floor(Math.random() * 65) + 10; // 10 - 75 mins
      }
    }
    // Ensure today has read time
    const todayStr = today.toISOString().split('T')[0];
    data[todayStr] = 45;
    return data;
  };

  const dailyReadTime = ref<Record<string, number>>(getInitialDailyReadTime());

  const readingHistory = ref<ReadingHistoryEntry[]>(
    JSON.parse(localStorage.getItem('gm-reading-history') || JSON.stringify([
      {
        bookId: 'the-alchemist',
        bookTitle: 'The Alchemist (Sang Alkemis)',
        completedAt: '2026-08-11T23:30:00Z',
        durationMinutes: 42,
        sessionHour: 23
      },
      {
        bookId: 'chronicles-of-aethelgard',
        bookTitle: 'Chronicles of Aethelgard: The Obsidian Grimoire',
        completedAt: '2026-08-09T01:15:00Z',
        durationMinutes: 28,
        sessionHour: 1
      },
      {
        bookId: 'fate-stay-night-prelude',
        bookTitle: 'The Awakening of Fuyuki: Holy Grail Prelude',
        completedAt: '2026-08-05T21:40:00Z',
        durationMinutes: 20,
        sessionHour: 21
      }
    ]))
  );

  // Computed Current Tier
  const totalMinutesRead = computed(() => {
    return Object.values(dailyReadTime.value).reduce((acc, m) => acc + m, 0);
  });

  const currentTierInfo = computed<TierDefinition>(() => {
    const found = TIER_DEFINITIONS.slice().reverse().find(t => booksCompleted.value >= t.min);
    return found || TIER_DEFINITIONS[0];
  });

  const nextTierInfo = computed<TierDefinition | null>(() => {
    const next = TIER_DEFINITIONS.find(t => t.tier === currentTierInfo.value.tier + 1);
    return next || null;
  });

  const tierProgressPercent = computed<number>(() => {
    if (!nextTierInfo.value) return 100;
    const currentTierMin = currentTierInfo.value.min;
    const nextTierMin = nextTierInfo.value.min;
    const progress = booksCompleted.value - currentTierMin;
    const totalNeeded = nextTierMin - currentTierMin;
    return Math.min(100, Math.round((progress / totalNeeded) * 100));
  });

  const booksRemainingToNextTier = computed<number>(() => {
    if (!nextTierInfo.value) return 0;
    return Math.max(0, nextTierInfo.value.min - booksCompleted.value);
  });

  const allTiers = computed<TierDefinition[]>(() => TIER_DEFINITIONS);
  const allTraits = computed<TraitDefinition[]>(() => traitsData as TraitDefinition[]);

  // Check if trait is unlocked
  const isTraitUnlocked = (traitId: string) => unlockedTraits.value.includes(traitId);

  // Actions
  const recordReadingSession = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailyReadTime.value[today]) {
      dailyReadTime.value[today] = 0;
    }
    dailyReadTime.value[today] += minutes;
    localStorage.setItem('gm-daily-read-time', JSON.stringify(dailyReadTime.value));

    // Update streak if not updated today
    if (lastReadDate.value !== today) {
      currentStreak.value += 1;
      if (currentStreak.value > longestStreak.value) {
        longestStreak.value = currentStreak.value;
      }
      lastReadDate.value = today;
      localStorage.setItem('gm-current-streak', currentStreak.value.toString());
      localStorage.setItem('gm-longest-streak', longestStreak.value.toString());
      localStorage.setItem('gm-last-read-date', today);
    }

    evaluateTraits();
  };

  const recordExplainUsage = () => {
    explainCount.value += 1;
    localStorage.setItem('gm-explain-count', explainCount.value.toString());
    evaluateTraits();
  };

  const recordBookCompletion = (bookId: string, bookTitle: string, durationMinutes: number) => {
    booksCompleted.value += 1;
    localStorage.setItem('gm-books-completed', booksCompleted.value.toString());

    const now = new Date();
    const entry: ReadingHistoryEntry = {
      bookId,
      bookTitle,
      completedAt: now.toISOString(),
      durationMinutes,
      sessionHour: now.getHours(),
    };
    readingHistory.value.unshift(entry);
    localStorage.setItem('gm-reading-history', JSON.stringify(readingHistory.value));

    // Check for Tier Up
    if (currentTierInfo.value.tier > previousTier.value) {
      previousTier.value = currentTierInfo.value.tier;
      localStorage.setItem('gm-current-tier', previousTier.value.toString());
      showTierUpOverlay.value = true;
      triggerConfetti();
    }

    evaluateTraits();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5C4114', '#BA9248', '#344820', '#1B1815']
      });
    } catch (e) {
      // safe fallback
    }
  };

  const unlockTrait = (traitId: string) => {
    if (!unlockedTraits.value.includes(traitId)) {
      unlockedTraits.value.push(traitId);
      localStorage.setItem('gm-unlocked-traits', JSON.stringify(unlockedTraits.value));
    }
    const traitObj = allTraits.value.find(t => t.id === traitId);
    if (traitObj) {
      pendingTraitToast.value = traitObj;
      setTimeout(() => {
        if (pendingTraitToast.value?.id === traitId) {
          pendingTraitToast.value = null;
        }
      }, 5000);
    }
  };

  const triggerTierUpDemo = () => {
    showTierUpOverlay.value = true;
  };

  const triggerAchievementDemo = (traitId?: string) => {
    const targetId = traitId || allTraits.value[0]?.id || 'curious-mind';
    unlockTrait(targetId);
  };

  const evaluateTraits = () => {
    // 1. Curious Mind: explainCount >= 15
    if (explainCount.value >= 15) {
      unlockTrait('curious-mind');
    }
    // 2. Marathon Reader: streak >= 7
    if (currentStreak.value >= 7) {
      unlockTrait('marathon-reader');
    }
    // 3. Night Owl: >= 2 completions between 22:00 and 05:00
    const lateNightReads = readingHistory.value.filter(h => h.sessionHour >= 22 || h.sessionHour <= 5);
    if (lateNightReads.length >= 2) {
      unlockTrait('night-owl');
    }
    // 4. Bibliophile: booksCompleted >= 20
    if (booksCompleted.value >= 20) {
      unlockTrait('bibliophile');
    }
  };

  return {
    booksCompleted,
    currentStreak,
    longestStreak,
    lastReadDate,
    explainCount,
    notesOpenedCount,
    unlockedTraits,
    totalMinutesRead,
    dailyReadTime,
    readingHistory,
    currentTierInfo,
    nextTierInfo,
    tierProgressPercent,
    booksRemainingToNextTier,
    allTiers,
    allTraits,
    pendingTraitToast,
    showTierUpOverlay,
    isTraitUnlocked,
    recordReadingSession,
    recordExplainUsage,
    recordBookCompletion,
    unlockTrait,
    evaluateTraits,
    triggerTierUpDemo,
    triggerAchievementDemo,
  };
});
