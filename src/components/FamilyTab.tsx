import React, { useState } from 'react';
import { Check, Plus, Trash2, Volume2 } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { CURATED_PHRASES } from '../data/phrases';
import type { FamilyProfile, ThaiPoliteForm } from '../types';

interface FamilyTabProps {
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile;
  speakingId: string | null;
  onSelectProfile: (profileId: string) => void;
  onAddProfile: (name: string, emoji: string, thaiPoliteForm: ThaiPoliteForm) => void;
  onSpeak: (id: string, text: string, langOverride?: FamilyProfile['activeLanguage']) => void;
  onRemoveCustomPhrase: (phraseId: string) => void;
}

const AVATAR_CHOICES = ['🧭', '🌸', '🌞', '🐼', '🦁', '🌿'];

export const FamilyTab: React.FC<FamilyTabProps> = ({
  profiles,
  activeProfile,
  speakingId,
  onSelectProfile,
  onAddProfile,
  onSpeak,
  onRemoveCustomPhrase,
}) => {
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌿');
  const [newPolite, setNewPolite] = useState<ThaiPoliteForm>('khrap');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddProfile(newName.trim(), newEmoji, newPolite);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <>
      <div className="section-header">
        <h1 className="section-title">Family Profiles</h1>
        <p className="section-desc">
          Switch learners on this device — each person keeps their own practiced phrases and Thai polite ending.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {profiles.map((p) => {
          const isActive = p.id === activeProfile.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`family-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectProfile(p.id)}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="family-avatar" aria-hidden="true">
                  {p.avatarEmoji}
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                    {p.learnedPhraseIds.length} phrases practiced · Thai:{' '}
                    {p.thaiPoliteForm === 'khrap' ? 'ครับ (khrap)' : 'ค่ะ (kha)'}
                  </div>
                </div>
              </div>
              {isActive && (
                <span
                  className="icon-action-btn learned-active"
                  style={{ pointerEvents: 'none' }}
                >
                  <Check size={13} /> Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!showAddForm ? (
        <button
          type="button"
          className="primary-listen-btn"
          style={{ background: 'var(--ink-primary)' }}
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={17} /> Add Family Member
        </button>
      ) : (
        <form onSubmit={handleCreate} className="builder-card">
          <div className="slot-group">
            <label htmlFor="new-member-name" className="slot-label">
              Family Member Name
            </label>
            <input
              id="new-member-name"
              type="text"
              className="slot-input"
              placeholder="e.g., Mom, Dad, Alex..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="slot-group">
            <span className="slot-label">Pick an Icon</span>
            <div className="pill-grid">
              {AVATAR_CHOICES.map((em) => (
                <button
                  key={em}
                  type="button"
                  className={`slot-pill ${newEmoji === em ? 'active' : ''}`}
                  onClick={() => setNewEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="slot-group">
            <span className="slot-label">Thai Polite Ending</span>
            <div className="segmented-control" style={{ alignSelf: 'flex-start' }}>
              <button
                type="button"
                className={`seg-btn ${newPolite === 'khrap' ? 'active' : ''}`}
                onClick={() => setNewPolite('khrap')}
              >
                ครับ khrap (M)
              </button>
              <button
                type="button"
                className={`seg-btn ${newPolite === 'kha' ? 'active' : ''}`}
                onClick={() => setNewPolite('kha')}
              >
                ค่ะ kha (F)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="slot-pill"
              style={{ flex: 1 }}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-listen-btn"
              style={{ flex: 2, height: 42 }}
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Language Progress Overview for Active Member */}
      <div className="builder-card">
        <span className="slot-label">
          {activeProfile.name}’s Progress Across Languages
        </span>
        {LANGUAGES.map((lang) => {
          const total = CURATED_PHRASES.filter((p) => p.language === lang.code).length;
          const done = CURATED_PHRASES.filter(
            (p) =>
              p.language === lang.code &&
              activeProfile.learnedPhraseIds.includes(p.id)
          ).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div
              key={lang.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>{lang.flag}</span>
              <span style={{ width: 88, fontSize: 13, fontWeight: 700 }}>
                {lang.name}
              </span>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="progress-text" style={{ width: 42, textAlign: 'right' }}>
                {done}/{total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Saved Custom Situation Phrases */}
      <div className="builder-card">
        <span className="slot-label">
          {activeProfile.name}’s Saved Situation Phrases (
          {activeProfile.savedCustomPhrases.length})
        </span>
        {activeProfile.savedCustomPhrases.length === 0 ? (
          <p className="section-desc">
            Save any phrase from the Practice tab’s Situation Helper to keep it here for your trip.
          </p>
        ) : (
          <div className="phrase-list">
            {activeProfile.savedCustomPhrases.map((cp) => {
              const langMeta = LANGUAGES.find((l) => l.code === cp.language);
              const isSpeaking = speakingId === cp.id;
              return (
                <div
                  key={cp.id}
                  className={`phrase-card ${isSpeaking ? 'speaking' : ''}`}
                  style={{ padding: 12 }}
                >
                  <div className="phrase-top-row">
                    <span className="phrase-badge">
                      {langMeta?.flag} {langMeta?.name}
                    </span>
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => onRemoveCustomPhrase(cp.id)}
                      aria-label="Delete saved phrase"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                  <p className="phrase-english" style={{ fontSize: 13 }}>
                    {cp.english}
                  </p>
                  <button
                    type="button"
                    className="phrase-native-btn"
                    style={{ padding: '10px 12px' }}
                    onClick={() => onSpeak(cp.id, cp.native, cp.language)}
                  >
                    <div>
                      <div className="phrase-native-text" style={{ fontSize: 16 }}>
                        {cp.native}
                      </div>
                      <div className="phrase-phonetic">{cp.phonetic}</div>
                    </div>
                    <span
                      className="listen-circle"
                      style={{ width: 34, height: 34 }}
                      aria-hidden="true"
                    >
                      <Volume2 size={16} />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
