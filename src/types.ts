export type LanguageCode = 'th' | 'id' | 'it' | 'es';

export type ThaiPoliteForm = 'khrap' | 'kha';

export type CategoryId =
  | 'greetings'
  | 'intro'
  | 'curiosity'
  | 'repair'
  | 'appreciation'
  | 'goodbyes';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
  regionNote: string;
  accentColor: string;
  accentSoft: string;
}

export interface Phrase {
  id: string;
  language: LanguageCode;
  category: CategoryId;
  english: string;
  /** Supports {polite} / {politePhonetic} tokens for Thai khrap/kha adaptation */
  native: string;
  nativeAltFemale?: string;
  phonetic: string;
  phoneticAltFemale?: string;
  culturalTip: string;
  /** Optional tag like "Essential", "Icebreaker", "Polite" */
  badge?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  step: number;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface ReactionItem {
  id: string;
  english: string;
  emotion: string;
  translations: Record<
    LanguageCode,
    {
      native: string;
      nativeFemale?: string;
      phonetic: string;
      phoneticFemale?: string;
    }
  >;
}

export interface FamilyProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  pin?: string;
  thaiPoliteForm: ThaiPoliteForm;
  activeLanguage: LanguageCode;
  learnedPhraseIds: string[];
  favoritePhraseIds: string[];
  /** Custom saved phrases from the 20% Dynamic engine */
  savedCustomPhrases: CustomPhrase[];
  introPrefs: {
    displayName: string;
    originKey: string;
    companionKey: string;
    loveKey: string;
  };
}

export interface CustomPhrase {
  id: string;
  language: LanguageCode;
  english: string;
  native: string;
  phonetic: string;
  tip: string;
  situationTitle: string;
  createdAt: number;
}

export interface DialogueTurn {
  speaker: 'local' | 'you';
  english: string;
  native: string;
  phonetic: string;
  hint?: string;
}

export interface DynamicSituationResult {
  id: string;
  title: string;
  contextSummary: string;
  phrases: {
    id: string;
    english: string;
    native: string;
    phonetic: string;
    tip: string;
  }[];
  dialogue: DialogueTurn[];
}
