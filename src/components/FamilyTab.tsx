import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Cloud,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Volume2,
} from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { CURATED_PHRASES } from '../data/phrases';
import type { FamilyProfile, ThaiPoliteForm } from '../types';
import {
  isFirebaseConfigured,
  signInHousehold,
  signOutHousehold,
  signUpHousehold,
} from '../utils/firebase';

interface FamilyTabProps {
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile;
  speakingId: string | null;
  householdEmail: string | null;
  isSyncing: boolean;
  onSyncNow: () => void;
  onSelectProfile: (profileId: string) => void;
  onAddProfile: (
    name: string,
    emoji: string,
    thaiPoliteForm: ThaiPoliteForm,
    pin?: string
  ) => void;
  onEditProfile: (
    profileId: string,
    updates: {
      name: string;
      avatarEmoji: string;
      thaiPoliteForm: ThaiPoliteForm;
      pin?: string;
    }
  ) => void;
  onDeleteProfile: (profileId: string) => void;
  onSpeak: (
    id: string,
    text: string,
    langOverride?: FamilyProfile['activeLanguage']
  ) => void;
  onRemoveCustomPhrase: (phraseId: string) => void;
  onToast: (msg: string) => void;
}

const AVATAR_CHOICES = ['🧭', '🌸', '🌞', '🐼', '🦁', '🌿'];

export const FamilyTab: React.FC<FamilyTabProps> = ({
  profiles,
  activeProfile,
  speakingId,
  householdEmail,
  isSyncing,
  onSyncNow,
  onSelectProfile,
  onAddProfile,
  onEditProfile,
  onDeleteProfile,
  onSpeak,
  onRemoveCustomPhrase,
  onToast,
}) => {
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌿');
  const [newPolite, setNewPolite] = useState<ThaiPoliteForm>('khrap');
  const [newPin, setNewPin] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit member state
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('🧭');
  const [editPolite, setEditPolite] = useState<ThaiPoliteForm>('khrap');
  const [editPin, setEditPin] = useState('');

  // PIN unlock state when switching to a PIN-protected member
  const [pendingProfile, setPendingProfile] = useState<FamilyProfile | null>(null);
  const [pinAttempt, setPinAttempt] = useState('');

  // Household Auth form state
  const [cloudExpanded, setCloudExpanded] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const cleanedPin = newPin.replace(/\D/g, '').slice(0, 4);
    if (newPin && cleanedPin.length !== 4) {
      onToast('PIN must be 4 digits (or leave blank).');
      return;
    }
    onAddProfile(newName.trim(), newEmoji, newPolite, cleanedPin || undefined);
    setNewName('');
    setNewPin('');
    setShowAddForm(false);
  };

  const startEditing = (p: FamilyProfile) => {
    setEditingProfileId(p.id);
    setEditName(p.name);
    setEditEmoji(p.avatarEmoji);
    setEditPolite(p.thaiPoliteForm);
    setEditPin(p.pin ?? '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileId || !editName.trim()) return;
    const cleanedPin = editPin.replace(/\D/g, '').slice(0, 4);
    if (editPin && cleanedPin.length !== 4) {
      onToast('PIN must be 4 digits (or leave blank).');
      return;
    }
    onEditProfile(editingProfileId, {
      name: editName.trim(),
      avatarEmoji: editEmoji,
      thaiPoliteForm: editPolite,
      pin: cleanedPin || undefined,
    });
    setEditingProfileId(null);
    onToast('Profile updated!');
  };

  const handleProfileTap = (profile: FamilyProfile) => {
    if (profile.id === activeProfile.id) return;
    if (profile.pin) {
      setPendingProfile(profile);
      setPinAttempt('');
    } else {
      onSelectProfile(profile.id);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingProfile) return;
    if (pinAttempt === pendingProfile.pin) {
      onSelectProfile(pendingProfile.id);
      setPendingProfile(null);
      setPinAttempt('');
    } else {
      onToast('Incorrect 4-digit PIN.');
      setPinAttempt('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) return;
    if (!email.trim() || password.length < 6) {
      onToast('Enter a valid email and password (6+ characters).');
      return;
    }

    setAuthBusy(true);
    try {
      if (authMode === 'signup') {
        await signUpHousehold(email.trim(), password);
        onToast('Household account created and synced!');
      } else {
        await signInHousehold(email.trim(), password);
        onToast('Signed into Household Cloud Sync!');
      }
      setPassword('');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOutHousehold();
    onToast('Signed out. Local profiles remain on this device.');
  };

  return (
    <>
      <div className="section-header">
        <h1 className="section-title">Family Profiles</h1>
        <p className="section-desc">
          Switch learners on this device or sync progress across every family phone.
        </p>
      </div>

      {/* Collapsible Household Cloud Sync Card */}
      <div className="builder-card" style={{ gap: 10, padding: '12px 14px' }}>
        <button
          type="button"
          onClick={() => setCloudExpanded((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 8,
          }}
        >
          <span
            className="slot-label"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Cloud size={14} color="var(--accent-primary)" />
            {householdEmail ? `Synced: ${householdEmail}` : 'Household Cloud Sync'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {householdEmail && (
              <span
                className="phrase-badge"
                style={{
                  background: 'var(--accent-sage-soft)',
                  color: 'var(--accent-sage)',
                }}
              >
                Connected
              </span>
            )}
            {householdEmail &&
              (cloudExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </span>
        </button>

        {!isFirebaseConfigured ? (
          <p className="section-desc" style={{ fontSize: 12.5 }}>
            Currently saving locally on this phone. Add{' '}
            <code>VITE_FIREBASE_*</code> config to enable cross-device sync.
          </p>
        ) : householdEmail ? (
          cloudExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              <p className="section-desc" style={{ fontSize: 12.5 }}>
                All family member progress syncs automatically to your Household cloud.
              </p>
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
                  }}
                  onClick={onSyncNow}
                  disabled={isSyncing}
                >
                  <RefreshCw size={13} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  type="button"
                  className="slot-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                  onClick={handleSignOut}
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            </div>
          )
        ) : (
          <form
            onSubmit={handleAuthSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}
          >
            <div className="segmented-control" style={{ alignSelf: 'flex-start' }}>
              <button
                type="button"
                className={`seg-btn ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`seg-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Create Household
              </button>
            </div>

            <input
              type="email"
              className="slot-input"
              placeholder="Parent / Household email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="slot-input"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="primary-listen-btn"
              style={{ height: 42 }}
              disabled={authBusy}
            >
              {authBusy
                ? 'Please wait...'
                : authMode === 'signin'
                ? 'Sign In & Sync Family'
                : 'Create Household Account'}
            </button>
          </form>
        )}
      </div>

      {/* PIN Unlock Prompt */}
      {pendingProfile && (
        <form onSubmit={handleVerifyPin} className="intro-output-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} color="var(--accent-primary)" />
            <strong style={{ fontSize: 14 }}>
              Enter 4-digit PIN for {pendingProfile.name}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="slot-input"
              style={{ flex: 1, letterSpacing: '0.3em', textAlign: 'center' }}
              placeholder="••••"
              value={pinAttempt}
              onChange={(e) =>
                setPinAttempt(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              autoFocus
            />
            <button
              type="submit"
              className="dynamic-submit-btn"
              style={{ background: 'var(--accent-primary)' }}
            >
              Unlock
            </button>
            <button
              type="button"
              className="slot-pill"
              onClick={() => setPendingProfile(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Family Member Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {profiles.map((p) => {
          const isActive = p.id === activeProfile.id;
          const isEditing = editingProfileId === p.id;

          if (isEditing) {
            return (
              <form key={p.id} onSubmit={handleSaveEdit} className="builder-card">
                <div className="slot-group">
                  <label htmlFor={`edit-name-${p.id}`} className="slot-label">
                    Edit Name
                  </label>
                  <input
                    id={`edit-name-${p.id}`}
                    type="text"
                    className="slot-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="slot-group">
                  <span className="slot-label">Icon</span>
                  <div className="pill-grid">
                    {AVATAR_CHOICES.map((em) => (
                      <button
                        key={em}
                        type="button"
                        className={`slot-pill ${editEmoji === em ? 'active' : ''}`}
                        onClick={() => setEditEmoji(em)}
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
                      className={`seg-btn ${editPolite === 'khrap' ? 'active' : ''}`}
                      onClick={() => setEditPolite('khrap')}
                    >
                      ครับ khrap (M)
                    </button>
                    <button
                      type="button"
                      className={`seg-btn ${editPolite === 'kha' ? 'active' : ''}`}
                      onClick={() => setEditPolite('kha')}
                    >
                      ค่ะ kha (F)
                    </button>
                  </div>
                </div>

                <div className="slot-group">
                  <label htmlFor={`edit-pin-${p.id}`} className="slot-label">
                    4-Digit PIN (Optional)
                  </label>
                  <input
                    id={`edit-pin-${p.id}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    className="slot-input"
                    placeholder="Leave blank to remove PIN"
                    value={editPin}
                    onChange={(e) =>
                      setEditPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                  />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="slot-pill"
                    style={{ flex: 1 }}
                    onClick={() => setEditingProfileId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-listen-btn"
                    style={{ flex: 2, height: 42 }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div
              key={p.id}
              className={`family-card ${isActive ? 'active' : ''}`}
            >
              <button
                type="button"
                onClick={() => handleProfileTap(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flex: 1,
                  textAlign: 'left',
                }}
              >
                <span className="family-avatar" aria-hidden="true">
                  {p.avatarEmoji}
                </span>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {p.name}
                    {p.pin && <Lock size={12} color="var(--ink-muted)" />}
                    {isActive && (
                      <span
                        className="phrase-badge"
                        style={{
                          background: 'var(--accent-sage-soft)',
                          color: 'var(--accent-sage)',
                        }}
                      >
                        <Check size={10} /> Active
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                    {p.learnedPhraseIds.length} practiced · Thai:{' '}
                    {p.thaiPoliteForm === 'khrap' ? 'ครับ (khrap)' : 'ค่ะ (kha)'}
                  </div>
                </div>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={() => startEditing(p)}
                  aria-label={`Edit ${p.name}`}
                >
                  <Pencil size={12} />
                </button>
                {profiles.length > 1 && (
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => onDeleteProfile(p.id)}
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
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

          <div className="slot-group">
            <label htmlFor="new-member-pin" className="slot-label">
              Optional 4-Digit PIN
            </label>
            <input
              id="new-member-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="slot-input"
              placeholder="Leave blank for no PIN"
              value={newPin}
              onChange={(e) =>
                setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
            />
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
            Save any phrase from the Situations tab to keep it here for your trip.
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
