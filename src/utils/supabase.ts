import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { FamilyProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

interface HouseholdMemberRow {
  id: string;
  household_user_id: string;
  name: string;
  avatar_emoji: string;
  pin: string | null;
  thai_polite_form: 'khrap' | 'kha';
  active_language: 'th' | 'id' | 'it' | 'es';
  learned_phrase_ids: string[];
  favorite_phrase_ids: string[];
  saved_custom_phrases: FamilyProfile['savedCustomPhrases'];
  intro_prefs: FamilyProfile['introPrefs'];
}

function rowToProfile(row: HouseholdMemberRow): FamilyProfile {
  return {
    id: row.id,
    name: row.name,
    avatarEmoji: row.avatar_emoji,
    pin: row.pin ?? undefined,
    thaiPoliteForm: row.thai_polite_form,
    activeLanguage: row.active_language,
    learnedPhraseIds: row.learned_phrase_ids ?? [],
    favoritePhraseIds: row.favorite_phrase_ids ?? [],
    savedCustomPhrases: row.saved_custom_phrases ?? [],
    introPrefs: row.intro_prefs ?? {
      displayName: row.name,
      originKey: 'singapore',
      companionKey: 'family',
      loveKey: 'food',
    },
  };
}

export async function fetchHouseholdMembers(
  userId: string
): Promise<FamilyProfile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as HouseholdMemberRow[]).map(rowToProfile);
}

export async function upsertHouseholdMember(
  userId: string,
  profile: FamilyProfile
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('household_members').upsert(
    {
      id: profile.id,
      household_user_id: userId,
      name: profile.name,
      avatar_emoji: profile.avatarEmoji,
      pin: profile.pin ?? null,
      thai_polite_form: profile.thaiPoliteForm,
      active_language: profile.activeLanguage,
      learned_phrase_ids: profile.learnedPhraseIds,
      favorite_phrase_ids: profile.favoritePhraseIds,
      saved_custom_phrases: profile.savedCustomPhrases,
      intro_prefs: profile.introPrefs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}
