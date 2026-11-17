import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  Eye,
  Maximize2,
  Mic,
  RotateCw,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { CATEGORIES, LANGUAGES } from '../data/languages';
import { CURATED_PHRASES } from '../data/phrases';
import type {
  CategoryId,
  FamilyProfile,
  LanguageCode,
  ThaiPoliteForm,
} from '../types';
import {
  resolveThaiText,
  startSpeechAssessment,
  stopListening,
  type SpeechAssessmentResult,
} from '../utils/speech';
import { ShowLocalModal } from './ShowLocalModal';

interface ConnectTabProps {
  profile: FamilyProfile;
  language: LanguageCode;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  onToggleLearned: (phraseId: string) => void;
  onToggleFavorite: (phraseId: string) => void;
  onChangeThaiPolite: (form: ThaiPoliteForm) => void;
  onToast: (msg: string) => void;
}

export const ConnectTab: React.FC<ConnectTabProps> = ({
  profile,
  language,
  speakingId,
  onSpeak,
  onToggleLearned,
  onToggleFavorite,
  onChangeThaiPolite,
  onToast,
}) => {
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryId | 'all' | 'favorites'
  >('greetings');
  const [searchQuery, setSearchQuery] = useState('');

  // Recall Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);

  // Voice assessment state
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<
    Record<string, SpeechAssessmentResult>
  >({});

  // Full-screen "Show to Local" modal state
  const [modalPhrase, setModalPhrase] = useState<{
    id: string;
    native: string;
    phonetic: string;
    english: string;
  } | null>(null);

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

  const quizPool = filteredPhrases.length > 0 ? filteredPhrases : langPhrases;
  const currentQuizPhrase = quizPool[quizIndex % quizPool.length];
  const currentQuizResolved = currentQuizPhrase
    ? language === 'th'
      ? resolveThaiText(
          currentQuizPhrase.native,
          currentQuizPhrase.phonetic,
          profile.thaiPoliteForm,
          currentQuizPhrase.nativeAltFemale,
          currentQuizPhrase.phoneticAltFemale
        )
      : {
          native: currentQuizPhrase.native,
          phonetic: currentQuizPhrase.phonetic,
        }
    : null;

  const handleAssessSpeech = (
    phraseId: string,
    expectedNative: string,
    revealQuizOnResult = false
  ) => {
    if (listeningId === phraseId) {
      stopListening();
      setListeningId(null);
      return;
    }

    startSpeechAssessment(language, expectedNative, {
      onStart: () => setListeningId(phraseId),
      onResult: (res) => {
        setAssessments((prev) => ({ ...prev, [phraseId]: res }));
        if (revealQuizOnResult) {
          setQuizRevealed(true);
        }
        if (res.verdict === 'great' && !profile.learnedPhraseIds.includes(phraseId)) {
          onToggleLearned(phraseId);
        }
      },
      onError: (msg) => {
        onToast(msg);
      },
      onEnd: () => setListeningId(null),
    });
  };

  const handleNextQuiz = (markLearned: boolean) => {
    if (
      markLearned &&
      currentQuizPhrase &&
      !profile.learnedPhraseIds.includes(currentQuizPhrase.id)
    ) {
      onToggleLearned(currentQuizPhrase.id);
    }
    setQuizRevealed(false);
    setQuizIndex((prev) => (prev + 1) % quizPool.length);
  };

  return (
    <>
      <div
        className="section-header"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div>
          <h1 className="section-title">
            {langMeta.flag} {langMeta.name}
          </h1>
          <p className="section-desc" style={{ fontSize: 12.5 }}>
            {mode === 'browse'
              ? 'Tap to listen · Tap Speak to test voice'
              : 'Speak aloud or reveal to check'}
          </p>
        </div>

        <div className="segmented-control" role="group" aria-label="Learning mode">
          <button
            type="button"
            className={`seg-btn ${mode === 'browse' ? 'active' : ''}`}
            onClick={() => setMode('browse')}
          >
            Browse
          </button>
          <button
            type="button"
            className={`seg-btn ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => {
              setMode('quiz');
              setQuizIndex(0);
              setQuizRevealed(false);
            }}
          >
            Recall Quiz
          </button>
        </div>
      </div>

      {language === 'th' && (
        <div className="thai-polite-bar">
          <span className="thai-polite-label">
            Polite ending for {profile.name}:
          </span>
          <div
            className="segmented-control"
            role="group"
            aria-label="Thai polite particle"
          >
            <button
              type="button"
              className={`seg-btn ${
                profile.thaiPoliteForm === 'khrap' ? 'active' : ''
              }`}
              onClick={() => onChangeThaiPolite('khrap')}
            >
              ครับ khrap (M)
            </button>
            <button
              type="button"
              className={`seg-btn ${
                profile.thaiPoliteForm === 'kha' ? 'active' : ''
              }`}
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

      {mode === 'browse' && (
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
      )}

      <div className="category-scroll-wrap">
        <div
          className="category-scroll"
          role="tablist"
          aria-label="Connection stages"
        >
          <button
            type="button"
            className={`cat-chip ${
              selectedCategory === 'favorites' ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedCategory('favorites');
              setQuizIndex(0);
              setQuizRevealed(false);
            }}
          >
            ★ Saved
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-chip ${
                selectedCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setQuizIndex(0);
                setQuizRevealed(false);
              }}
            >
              {cat.step}. {cat.title}
            </button>
          ))}
          <button
            type="button"
            className={`cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory('all');
              setQuizIndex(0);
              setQuizRevealed(false);
            }}
          >
            All Phrases
          </button>
        </div>
      </div>

      {mode === 'quiz' && currentQuizPhrase && currentQuizResolved ? (
        <div className="recall-card">
          <div className="phrase-top-row">
            <span className="slot-label">
              Card {(quizIndex % quizPool.length) + 1} of {quizPool.length}
            </span>
            {profile.learnedPhraseIds.includes(currentQuizPhrase.id) && (
              <span
                className="phrase-badge"
                style={{
                  background: 'var(--accent-sage-soft)',
                  color: 'var(--accent-sage)',
                }}
              >
                Practiced
              </span>
            )}
          </div>

          <div>
            <p className="slot-label" style={{ marginBottom: 6 }}>
              How do you say in {langMeta.name}?
            </p>
            <h2 className="recall-prompt">“{currentQuizPhrase.english}”</h2>
            <p className="cultural-tip" style={{ marginTop: 6, display: 'block' }}>
              Hint: {currentQuizPhrase.culturalTip}
            </p>
          </div>

          {assessments[currentQuizPhrase.id] && (
            <div
              className={`speak-result-box ${
                assessments[currentQuizPhrase.id].verdict
              }`}
            >
              <strong>
                {assessments[currentQuizPhrase.id].feedback} (
                {assessments[currentQuizPhrase.id].score}% match)
              </strong>
              <span>
                Heard: “{assessments[currentQuizPhrase.id].heard}”
              </span>
            </div>
          )}

          {!quizRevealed ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="primary-listen-btn"
                style={{
                  flex: 1,
                  background:
                    listeningId === currentQuizPhrase.id
                      ? 'var(--ink-primary)'
                      : 'var(--accent-primary)',
                }}
                onClick={() =>
                  handleAssessSpeech(
                    currentQuizPhrase.id,
                    currentQuizResolved.native,
                    true
                  )
                }
              >
                <Mic size={18} />
                {listeningId === currentQuizPhrase.id
                  ? 'Listening...'
                  : 'Speak to Answer'}
              </button>
              <button
                type="button"
                className="slot-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  height: 48,
                  padding: '0 16px',
                }}
                onClick={() => {
                  setQuizRevealed(true);
                  onSpeak(currentQuizPhrase.id, currentQuizResolved.native);
                }}
              >
                <Eye size={16} />
                Reveal
              </button>
            </div>
          ) : (
            <>
              <div className="recall-answer-box">
                <div className="phrase-native-text" style={{ fontSize: 21 }}>
                  {currentQuizResolved.native}
                </div>
                <div className="phrase-phonetic" style={{ marginTop: 2 }}>
                  {currentQuizResolved.phonetic}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="slot-pill"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    height: 44,
                  }}
                  onClick={() =>
                    onSpeak(currentQuizPhrase.id, currentQuizResolved.native)
                  }
                >
                  <Volume2 size={16} />
                  Listen
                </button>
                <button
                  type="button"
                  className="slot-pill"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    height: 44,
                  }}
                  onClick={() =>
                    handleAssessSpeech(
                      currentQuizPhrase.id,
                      currentQuizResolved.native,
                      true
                    )
                  }
                >
                  <Mic size={15} />
                  {listeningId === currentQuizPhrase.id ? 'Listening...' : 'Speak'}
                </button>
                <button
                  type="button"
                  className="primary-listen-btn"
                  style={{
                    flex: 1.2,
                    height: 44,
                    background: 'var(--accent-sage)',
                  }}
                  onClick={() => handleNextQuiz(true)}
                >
                  <Check size={16} />
                  Next
                </button>
              </div>
              <button
                type="button"
                className="slot-pill"
                style={{ alignSelf: 'center', fontSize: 12 }}
                onClick={() => handleNextQuiz(false)}
              >
                <RotateCw size={12} style={{ marginRight: 4 }} />
                Skip without marking practiced
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {activeCategoryMeta && !searchQuery && (
            <p className="section-desc" style={{ marginTop: -6 }}>
              <strong>Step {activeCategoryMeta.step}:</strong>{' '}
              {activeCategoryMeta.subtitle}
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
                const isListening = listeningId === phrase.id;
                const isLearned = profile.learnedPhraseIds.includes(phrase.id);
                const isFav = profile.favoritePhraseIds.includes(phrase.id);
                const assessment = assessments[phrase.id];

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
                        <div className="phrase-native-text">
                          {resolved.native}
                        </div>
                        <div className="phrase-phonetic">
                          {resolved.phonetic}
                        </div>
                      </div>
                      <span className="listen-circle" aria-hidden="true">
                        <Volume2 size={20} />
                      </span>
                    </button>

                    {assessment && (
                      <div className={`speak-result-box ${assessment.verdict}`}>
                        <strong>
                          {assessment.feedback} ({assessment.score}%)
                        </strong>
                        <span>Heard: “{assessment.heard}”</span>
                      </div>
                    )}

                    <div className="phrase-footer">
                      <span className="cultural-tip">{phrase.culturalTip}</span>
                      <div className="phrase-actions">
                        <button
                          type="button"
                          className={`icon-action-btn ${
                            isListening ? 'listening' : ''
                          }`}
                          onClick={() =>
                            handleAssessSpeech(phrase.id, resolved.native)
                          }
                          aria-label="Speak to check pronunciation"
                          title="Speak to check pronunciation"
                        >
                          <Mic size={13} />
                          {isListening ? 'Listening' : 'Speak'}
                        </button>
                        <button
                          type="button"
                          className="icon-action-btn"
                          onClick={() =>
                            setModalPhrase({
                              id: phrase.id,
                              native: resolved.native,
                              phonetic: resolved.phonetic,
                              english: phrase.english,
                            })
                          }
                          aria-label="Show full screen to local"
                          title="Show big text to a local"
                        >
                          <Maximize2 size={13} />
                        </button>
                        <button
                          type="button"
                          className={`icon-action-btn ${
                            isFav ? 'fav-active' : ''
                          }`}
                          onClick={() => onToggleFavorite(phrase.id)}
                          aria-label={
                            isFav ? 'Remove from saved' : 'Save phrase'
                          }
                        >
                          <Bookmark
                            size={13}
                            fill={isFav ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          type="button"
                          className={`icon-action-btn ${
                            isLearned ? 'learned-active' : ''
                          }`}
                          onClick={() => onToggleLearned(phrase.id)}
                          aria-label={
                            isLearned ? 'Mark unpracticed' : 'Mark practiced'
                          }
                        >
                          <Check size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </>
      )}

      {modalPhrase && (
        <ShowLocalModal
          nativeText={modalPhrase.native}
          phoneticText={modalPhrase.phonetic}
          englishText={modalPhrase.english}
          language={language}
          isSpeaking={speakingId === modalPhrase.id}
          onSpeak={() => onSpeak(modalPhrase.id, modalPhrase.native)}
          onClose={() => setModalPhrase(null)}
        />
      )}
    </>
  );
};
