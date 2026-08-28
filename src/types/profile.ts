export interface TierReward {
  icon: string;
  label: string;
  description?: string;
}

export interface TierDefinition {
  tier: number;
  title: string;
  englishTitle?: string;
  min: number;
  max: number;
  description: string;
  personality: string;
  visualTreatment: string;
  emblemIcon: string;
  badgeClass: string;
  accentColor: string;
  cardBorderClass: string;
  rewards: TierReward[];
  benefits: string[];
}

export type TraitRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface TraitDefinition {
  id: string;
  title: string;
  flavorText: string;
  secretHint: string; // The requirement ("Cara membuka") shown while locked
  icon: string;
  rarity: TraitRarity;
  conditionDescription: string;
}

export interface ReadingHistoryEntry {
  bookId: string;
  bookTitle: string;
  completedAt: string;
  durationMinutes: number;
  sessionHour: number; // 0-23
}

export interface UserProfileState {
  // Tier & Progression
  booksCompleted: number;
  currentTier: number;
  tierTitle: string;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null; // 'YYYY-MM-DD'

  // Traits
  unlockedTraits: string[]; // List of trait IDs

  // History & Heatmap
  readingHistory: ReadingHistoryEntry[];
  dailyReadTime: Record<string, number>; // 'YYYY-MM-DD' -> minutes read
  explainCount: number;
  notesOpenedCount: number;
  consecutiveReadingDays: number;
}
