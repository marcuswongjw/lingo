import type { FamilyProfile } from '../types';

const STORAGE_KEY = 'lingo_family_state_v1';

export interface StoredAppState {
  activeProfileId: string;
  profiles: FamilyProfile[];
  playbackRate: 0.75 | 1.0;
}

export const DEFAULT_PROFILES: FamilyProfile[] = [
  {
    id: 'profile-marcus',
    name: 'Marcus',
    avatarEmoji: '🧭',
    thaiPoliteForm: 'khrap',
    activeLanguage: 'th',
    learnedPhraseIds: [],
    favoritePhraseIds: ['th-greet-1', 'th-rep-1'],
    savedCustomPhrases: [],
    introPrefs: {
      displayName: 'Marcus',
      originKey: 'singapore',
      companionKey: 'family',
      loveKey: 'food',
    },
  },
  {
    id: 'profile-family-2',
    name: 'Partner',
    avatarEmoji: '🌸',
    thaiPoliteForm: 'kha',
    activeLanguage: 'it',
    learnedPhraseIds: [],
    favoritePhraseIds: ['it-greet-1'],
    savedCustomPhrases: [],
    introPrefs: {
      displayName: 'Sarah',
      originKey: 'singapore',
      companionKey: 'family',
      loveKey: 'people',
    },
  },
];

export function loadAppState(): StoredAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        activeProfileId: DEFAULT_PROFILES[0].id,
        profiles: DEFAULT_PROFILES,
        playbackRate: 1.0,
      };
    }
    const parsed = JSON.parse(raw) as StoredAppState;
    if (!parsed.profiles || parsed.profiles.length === 0) {
      return {
        activeProfileId: DEFAULT_PROFILES[0].id,
        profiles: DEFAULT_PROFILES,
        playbackRate: 1.0,
      };
    }
    return parsed;
  } catch {
    return {
      activeProfileId: DEFAULT_PROFILES[0].id,
      profiles: DEFAULT_PROFILES,
      playbackRate: 1.0,
    };
  }
}

export function saveAppState(state: StoredAppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
