import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { CATEGORIES, LANGUAGES } from '../data/languages';
import { CURATED_PHRASES } from '../data/phrases';
import type { CategoryId, FamilyProfile, LanguageCode, ThaiPoliteForm } from '../types';
import { resolveThaiText } from '../utils/speech';

interface ConnectTabProps {
  profile: FamilyProfile;
  language: LanguageCode;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  onToggleLearned: (phraseId: string) => void;
  onToggleFavorite: (phraseId: string) => void;
  onChangeThaiPolite: (form: ThaiPoliteForm) => void;
}

export const ConnectTab: React.FC<ConnectTabProps> = ({
  profile,
  language,
  speakingId,
  onSpeak,
  onToggleLearned,
  onToggleFavorite,
  onChangeThaiPolite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'favorites'>('greetings');
  const [searchQuery, setSearchQuery] = useState('');

  const langMeta = LANGUAGES.find((l) => l.code === language)!;

  const langPhrases = useMemo(
    () => CURATED_PHRASES.filter((p) => p.language === language),
    [language]
  );

  const learnedCount = useMemo(
    () =>
      langPhrases.filter((p) => profile.learnedPhraseIds.includes(p.id)).length,
    [langPhrases, profile.learnedPhraseIds]
  );

  const progressPct =
    langPhrases.length > 0
      ? Math.round((learnedCount / langPhrases.length) * 100)
      : 0;

  const filteredPhrases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return langPhrases.filter((p) => {
      if (selectedCategory === 'favorites') {
        if (!profile.favoritePhraseIds.includes(p.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (p.category !== selectedCategory) return false;
      }

      if (!q) return true;
      return (
        p.english.toLowerCase().includes(q) ||
        p.native.toLowerCase().includes(q) ||
        p.phonetic.toLowerCase().includes(q) ||
        p.culturalTip.toLowerCase().includes(q)
      );
    });
  }, [langPhrases, selectedCategory, searchQuery, profile.favoritePhraseIds]);

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <>
      <div className="section-header">
        <h1 className="section-title">
          {langMeta.flag} Connect in {langMeta.name}
        </h1>
        <p className="section-desc">
          Tap any phrase to hear it aloud. Focus on warmth, not perfection.
        </p>
      </div>

      {language === 'th' && (
        <div className="thai-polite-bar">
          <span className="thai-polite-label">Polite ending for {profile.name}:</span>
          <div className="segmented-control" role="group" aria-label="Thai polite particle">
            <button
              type="button"
              className={`seg-btn ${profile.thaiPoliteForm === 'khrap' ? 'active' : ''}`}
              onClick={() => onChangeThaiPolite('khrap')}
            >
              ครับ khrap (M)
            </button>
            <button
              type="button"
              className={`seg-btn ${profile.thaiPoliteForm === 'kha' ? 'active' : ''}`}
              onClick={() => onChangeThaiPolite('kha')}
            >
              ค่ะ kha (F)
            </button>
          </div>
        </div>
      )}

      <div className="progress-strip">
        <span className="progress-text">
          {learnedCount}/{langPhrases.length} practiced
        </span>
        <div className="progress-bar-track" aria-hidden="true">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="progress-text">{progressPct}%</span>
      </div>

      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={`Search ${langMeta.name} phrases or English...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search phrases"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="category-scroll" role="tablist" aria-label="Connection stages">
        <button
          type="button"
          className={`cat-chip ${selectedCategory === 'favorites' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('favorites')}
        >
          ★ Saved
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.step}. {cat.title}
          </button>
        ))}
        <button
          type="button"
          className={`cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Phrases
        </button>
      </div>

      {activeCategoryMeta && !searchQuery && (
        <p className="section-desc" style={{ marginTop: -6 }}>
          <strong>Step {activeCategoryMeta.step}:</strong> {activeCategoryMeta.subtitle}
        </p>
      )}

      <div className="phrase-list">
        {filteredPhrases.length === 0 ? (
          <div className="empty-state">
            {selectedCategory === 'favorites'
              ? 'No saved phrases in this language yet. Tap "Save" on any card to keep it handy.'
              : 'No matching phrases found. Try clearing your search.'}
          </div>
        ) : (
          filteredPhrases.map((phrase) => {
            const resolved =
              language === 'th'
                ? resolveThaiText(
                    phrase.native,
                    phrase.phonetic,
                    profile.thaiPoliteForm,
                    phrase.nativeAltFemale,
                    phrase.phoneticAltFemale
                  )
                : { native: phrase.native, phonetic: phrase.phonetic };

            const isSpeaking = speakingId === phrase.id;
            const isLearned = profile.learnedPhraseIds.includes(phrase.id);
            const isFav = profile.favoritePhraseIds.includes(phrase.id);

            return (
              <article
                key={phrase.id}
                className={`phrase-card ${isSpeaking ? 'speaking' : ''} ${
                  isLearned ? 'learned' : ''
                }`}
              >
                <div className="phrase-top-row">
                  <p className="phrase-english">{phrase.english}</p>
                  {phrase.badge && (
                    <span className="phrase-badge">{phrase.badge}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="phrase-native-btn"
                  onClick={() => onSpeak(phrase.id, resolved.native)}
                  aria-label={`Listen to ${phrase.english}`}
                >
                  <div>
                    <div className="phrase-native-text">{resolved.native}</div>
                    <div className="phrase-phonetic">{resolved.phonetic}</div>
                  </div>
                  <span className="listen-circle" aria-hidden="true">
                    <Volume2 size={20} />
                  </span>
                </button>

                <div className="phrase-footer">
                  <span className="cultural-tip">{phrase.culturalTip}</span>
                  <div className="phrase-actions">
                    <button
                      type="button"
                      className={`icon-action-btn ${isFav ? 'fav-active' : ''}`}
                      onClick={() => onToggleFavorite(phrase.id)}
                      aria-label={isFav ? 'Remove from saved' : 'Save phrase'}
                    >
                      <Bookmark size={13} fill={isFav ? 'currentColor' : 'none'} />
                      {isFav ? 'Saved' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className={`icon-action-btn ${isLearned ? 'learned-active' : ''}`}
                      onClick={() => onToggleLearned(phrase.id)}
                      aria-label={isLearned ? 'Mark unpracticed' : 'Mark practiced'}
                    >
                      <Check size={13} />
                      {isLearned ? 'Practiced' : 'Got it'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
};
