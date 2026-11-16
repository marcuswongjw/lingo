import React from 'react';
import { Volume2 } from 'lucide-react';
import {
  buildPersonalIntro,
  COMPANION_OPTIONS,
  LOVE_OPTIONS,
  ORIGIN_OPTIONS,
} from '../data/introBuilder';
import { LANGUAGES } from '../data/languages';
import type { FamilyProfile, LanguageCode } from '../types';

interface IntroTabProps {
  profile: FamilyProfile;
  language: LanguageCode;
  speakingId: string | null;
  onSpeak: (id: string, text: string) => void;
  onUpdateIntroPrefs: (prefs: FamilyProfile['introPrefs']) => void;
}

export const IntroTab: React.FC<IntroTabProps> = ({
  profile,
  language,
  speakingId,
  onSpeak,
  onUpdateIntroPrefs,
}) => {
  const langMeta = LANGUAGES.find((l) => l.code === language)!;
  const { displayName, originKey, companionKey, loveKey } = profile.introPrefs;

  const built = buildPersonalIntro(
    language,
    profile.thaiPoliteForm,
    displayName,
    originKey,
    companionKey,
    loveKey
  );

  const introSpeechId = `intro-output-${language}`;
  const isSpeaking = speakingId === introSpeechId;

  return (
    <>
      <div className="section-header">
        <h1 className="section-title">My Family Intro</h1>
        <p className="section-desc">
          Build your own natural {langMeta.name} introduction using Lego-brick slots.
        </p>
      </div>

      <div className="intro-output-card">
        <div className="phrase-top-row">
          <span className="slot-label" style={{ color: 'var(--accent-primary)' }}>
            {langMeta.flag} Ready to say in {langMeta.name}
          </span>
        </div>

        <div className="phrase-native-text" style={{ fontSize: 18 }}>
          {built.native}
        </div>
        <div className="phrase-phonetic" style={{ marginTop: 0 }}>
          {built.phonetic}
        </div>
        <p className="section-desc" style={{ fontSize: 13 }}>
          “{built.english}”
        </p>

        <button
          type="button"
          className="primary-listen-btn"
          onClick={() => onSpeak(introSpeechId, built.native)}
        >
          <Volume2 size={18} />
          {isSpeaking ? 'Speaking...' : `Listen in ${langMeta.name}`}
        </button>
      </div>

      <div className="builder-card">
        <div className="slot-group">
          <label htmlFor="intro-name-input" className="slot-label">
            1. Your Name
          </label>
          <input
            id="intro-name-input"
            type="text"
            className="slot-input"
            value={displayName}
            placeholder="Enter your name"
            onChange={(e) =>
              onUpdateIntroPrefs({
                ...profile.introPrefs,
                displayName: e.target.value,
              })
            }
          />
        </div>

        <div className="slot-group">
          <span className="slot-label">2. Where You’re From</span>
          <div className="pill-grid">
            {ORIGIN_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`slot-pill ${originKey === opt.key ? 'active' : ''}`}
                onClick={() =>
                  onUpdateIntroPrefs({ ...profile.introPrefs, originKey: opt.key })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slot-group">
          <span className="slot-label">3. Who You’re With</span>
          <div className="pill-grid">
            {COMPANION_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`slot-pill ${companionKey === opt.key ? 'active' : ''}`}
                onClick={() =>
                  onUpdateIntroPrefs({
                    ...profile.introPrefs,
                    companionKey: opt.key,
                  })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slot-group">
          <span className="slot-label">4. What You Love</span>
          <div className="pill-grid">
            {LOVE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`slot-pill ${loveKey === opt.key ? 'active' : ''}`}
                onClick={() =>
                  onUpdateIntroPrefs({ ...profile.introPrefs, loveKey: opt.key })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
