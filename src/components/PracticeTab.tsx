import React, { useMemo, useState } from 'react';
import { Bookmark, Eye, EyeOff, Maximize2, Sparkles, Volume2 } from 'lucide-react';
import {
  generateDynamicSituation,
  SITUATION_PRESETS,
} from '../data/dynamicEngine';
import { LANGUAGES, REACTIONS } from '../data/languages';
import type { CustomPhrase, FamilyProfile, LanguageCode } from '../types';
import { resolveThaiText } from '../utils/speech';
import { ShowLocalModal } from './ShowLocalModal';

interface PracticeTabProps {
  profile: FamilyProfile;
  language: LanguageCode;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  onSaveCustomPhrase: (phrase: CustomPhrase) => void;
}

export const PracticeTab: React.FC<PracticeTabProps> = ({
  profile,
  language,
  speakingId,
  onSpeak,
  onSaveCustomPhrase,
}) => {
  const langMeta = LANGUAGES.find((l) => l.code === language)!;
  const [situationInput, setSituationInput] = useState(SITUATION_PRESETS[0].query);
  const [submittedQuery, setSubmittedQuery] = useState(SITUATION_PRESETS[0].query);
  const [hideMyLines, setHideMyLines] = useState(false);
  const [revealedTurns, setRevealedTurns] = useState<Record<number, boolean>>({});
  const [modalPhrase, setModalPhrase] = useState<{
    id: string;
    native: string;
    phonetic: string;
    english: string;
  } | null>(null);

  const result = useMemo(
    () =>
      generateDynamicSituation(submittedQuery, language, profile.thaiPoliteForm),
    [submittedQuery, language, profile.thaiPoliteForm]
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setRevealedTurns({});
    setSubmittedQuery(situationInput);
  };

  const handlePresetClick = (presetQuery: string) => {
    setRevealedTurns({});
    setSituationInput(presetQuery);
    setSubmittedQuery(presetQuery);
  };

  return (
    <>
      <div className="section-header">
        <h1 className="section-title">Reactions &amp; Situations</h1>
        <p className="section-desc">
          Quick-tap warm reactions plus a just-in-time helper for real family moments.
        </p>
      </div>

      {/* Quick-Draw Reaction Soundboard */}
      <section aria-labelledby="reactions-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <h2 id="reactions-heading" className="slot-label" style={{ margin: 0 }}>
            Quick Warm Reactions ({langMeta.name})
          </h2>
        </div>

        <div className="reaction-grid">
          {REACTIONS.map((item) => {
            const raw = item.translations[language];
            const resolved =
              language === 'th'
                ? resolveThaiText(raw.native, raw.phonetic, profile.thaiPoliteForm)
                : {
                    native:
                      profile.thaiPoliteForm === 'kha' && raw.nativeFemale
                        ? raw.nativeFemale
                        : raw.native,
                    phonetic:
                      profile.thaiPoliteForm === 'kha' && raw.phoneticFemale
                        ? raw.phoneticFemale
                        : raw.phonetic,
                  };

            const reactId = `${item.id}-${language}`;
            const isSpeaking = speakingId === reactId;

            return (
              <button
                key={item.id}
                type="button"
                className={`reaction-tile ${isSpeaking ? 'speaking' : ''}`}
                onClick={() => onSpeak(reactId, resolved.native)}
              >
                <span className="reaction-english">{item.english}</span>
                <span className="reaction-native">{resolved.native}</span>
                <span className="reaction-phonetic">{resolved.phonetic}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 20% Dynamic Situation Helper */}
      <section
        aria-labelledby="dynamic-heading"
        className="builder-card"
        style={{ marginTop: 4 }}
      >
        <div>
          <h2
            id="dynamic-heading"
            className="section-title"
            style={{ fontSize: 17 }}
          >
            Just-in-Time Situation Helper
          </h2>
          <p className="section-desc" style={{ marginTop: 2 }}>
            Describe a moment you’re about to walk into, or pick one below.
          </p>
        </div>

        <div className="pill-grid">
          {SITUATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`slot-pill ${
                situationInput === preset.query ? 'active' : ''
              }`}
              onClick={() => handlePresetClick(preset.query)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleGenerate} className="dynamic-form">
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: 12, paddingRight: 12 }}
            value={situationInput}
            onChange={(e) => setSituationInput(e.target.value)}
            placeholder="e.g., Where is the train station?"
            aria-label="Describe your situation"
          />
          <button type="submit" className="dynamic-submit-btn">
            <Sparkles size={14} />
            Go
          </button>
        </form>

        <div
          style={{
            paddingTop: 6,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <p className="section-desc" style={{ fontWeight: 600 }}>
            {result.contextSummary}
          </p>

          {result.phrases.map((p) => {
            const isSpeaking = speakingId === p.id;
            const alreadySaved = profile.savedCustomPhrases.some(
              (saved) => saved.native === p.native && saved.language === language
            );

            return (
              <div
                key={p.id}
                className={`phrase-card ${isSpeaking ? 'speaking' : ''}`}
                style={{ padding: 12 }}
              >
                <div className="phrase-top-row">
                  <p className="phrase-english" style={{ fontSize: 13 }}>
                    {p.english}
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() =>
                        setModalPhrase({
                          id: p.id,
                          native: p.native,
                          phonetic: p.phonetic,
                          english: p.english,
                        })
                      }
                      aria-label="Show full screen to local"
                      title="Show big text to a local"
                    >
                      <Maximize2 size={12} />
                    </button>
                    <button
                      type="button"
                      className={`icon-action-btn ${
                        alreadySaved ? 'fav-active' : ''
                      }`}
                      onClick={() =>
                        onSaveCustomPhrase({
                          id: `${p.id}-${Date.now()}`,
                          language,
                          english: p.english,
                          native: p.native,
                          phonetic: p.phonetic,
                          tip: p.tip,
                          situationTitle: result.title,
                          createdAt: Date.now(),
                        })
                      }
                    >
                      <Bookmark
                        size={12}
                        fill={alreadySaved ? 'currentColor' : 'none'}
                      />
                      {alreadySaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="phrase-native-btn"
                  style={{ padding: '10px 12px' }}
                  onClick={() => onSpeak(p.id, p.native)}
                >
                  <div>
                    <div className="phrase-native-text" style={{ fontSize: 16 }}>
                      {p.native}
                    </div>
                    <div className="phrase-phonetic">{p.phonetic}</div>
                  </div>
                  <span
                    className="listen-circle"
                    style={{ width: 36, height: 36 }}
                    aria-hidden="true"
                  >
                    <Volume2 size={17} />
                  </span>
                </button>
                <span className="cultural-tip">{p.tip}</span>
              </div>
            );
          })}
        </div>

        {/* Mini 3-Turn Practice Dialogue */}
        <div
          style={{
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span className="slot-label">Mini Practice Dialogue</span>
            <button
              type="button"
              className={`icon-action-btn ${hideMyLines ? 'fav-active' : ''}`}
              onClick={() => {
                setHideMyLines((prev) => !prev);
                setRevealedTurns({});
              }}
            >
              {hideMyLines ? <EyeOff size={12} /> : <Eye size={12} />}
              {hideMyLines ? 'My Line Hidden' : 'Test Yourself'}
            </button>
          </div>

          <div className="dialogue-box">
            {result.dialogue.map((turn, idx) => {
              const turnId = `${result.id}-turn-${idx}`;
              const isSpeaking = speakingId === turnId;
              const isHidden =
                hideMyLines && turn.speaker === 'you' && !revealedTurns[idx];

              return (
                <button
                  key={turnId}
                  type="button"
                  className={`dialogue-turn ${turn.speaker}`}
                  style={{
                    textAlign: 'left',
                    borderColor: isSpeaking ? 'var(--accent-primary)' : undefined,
                  }}
                  onClick={() => {
                    if (isHidden) {
                      setRevealedTurns((prev) => ({ ...prev, [idx]: true }));
                    }
                    onSpeak(turnId, turn.native);
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span className="turn-speaker">
                      {turn.speaker === 'local'
                        ? 'Local'
                        : `${profile.name} (You)`}
                    </span>
                    <Volume2 size={14} color="var(--accent-primary)" />
                  </div>

                  {isHidden ? (
                    <>
                      <div
                        className="cultural-tip"
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: 'var(--ink-primary)',
                          marginTop: 4,
                        }}
                      >
                        Try saying: “{turn.english}”
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                          marginTop: 2,
                        }}
                      >
                        Tap to reveal &amp; hear
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="phrase-native-text"
                        style={{ fontSize: 15, marginTop: 2 }}
                      >
                        {turn.native}
                      </div>
                      <div className="phrase-phonetic" style={{ marginTop: 1 }}>
                        {turn.phonetic}
                      </div>
                      <div className="cultural-tip" style={{ marginTop: 2 }}>
                        “{turn.english}”
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

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
