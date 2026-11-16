import { useEffect, useMemo, useState } from 'react';
import {
  Gauge,
  MessageCircleHeart,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { ConnectTab } from './components/ConnectTab';
import { FamilyTab } from './components/FamilyTab';
import { IntroTab } from './components/IntroTab';
import { PracticeTab } from './components/PracticeTab';
import { LANGUAGES } from './data/languages';
import type {
  CustomPhrase,
  FamilyProfile,
  LanguageCode,
  ThaiPoliteForm,
} from './types';
import { speakPhrase, stopSpeaking, warmupVoices } from './utils/speech';
import {
  loadAppState,
  saveAppState,
  type StoredAppState,
} from './utils/storage';

type TabId = 'connect' | 'intro' | 'practice' | 'family';

export function App() {
  const [appState, setAppState] = useState<StoredAppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabId>('connect');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    warmupVoices();
  }, []);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const activeProfile = useMemo(
    () =>
      appState.profiles.find((p) => p.id === appState.activeProfileId) ??
      appState.profiles[0],
    [appState.profiles, appState.activeProfileId]
  );

  const activeLanguage = activeProfile.activeLanguage;

  const updateActiveProfile = (
    updater: (profile: FamilyProfile) => FamilyProfile
  ) => {
    setAppState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? updater(p) : p
      ),
    }));
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    stopSpeaking();
    setSpeakingId(null);
    updateActiveProfile((p) => ({ ...p, activeLanguage: lang }));
  };

  const handleToggleSpeed = () => {
    setAppState((prev) => ({
      ...prev,
      playbackRate: prev.playbackRate === 1.0 ? 0.75 : 1.0,
    }));
  };

  const handleSpeak = (
    id: string,
    text: string,
    langOverride?: LanguageCode
  ) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }

    speakPhrase(text, langOverride ?? activeLanguage, appState.playbackRate, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
      onError: (reason) => {
        setSpeakingId(null);
        setToastMsg(reason);
      },
    });
  };

  const handleToggleLearned = (phraseId: string) => {
    updateActiveProfile((p) => {
      const exists = p.learnedPhraseIds.includes(phraseId);
      return {
        ...p,
        learnedPhraseIds: exists
          ? p.learnedPhraseIds.filter((id) => id !== phraseId)
          : [...p.learnedPhraseIds, phraseId],
      };
    });
  };

  const handleToggleFavorite = (phraseId: string) => {
    updateActiveProfile((p) => {
      const exists = p.favoritePhraseIds.includes(phraseId);
      return {
        ...p,
        favoritePhraseIds: exists
          ? p.favoritePhraseIds.filter((id) => id !== phraseId)
          : [...p.favoritePhraseIds, phraseId],
      };
    });
  };

  const handleChangeThaiPolite = (form: ThaiPoliteForm) => {
    updateActiveProfile((p) => ({ ...p, thaiPoliteForm: form }));
  };

  const handleUpdateIntroPrefs = (prefs: FamilyProfile['introPrefs']) => {
    updateActiveProfile((p) => ({ ...p, introPrefs: prefs }));
  };

  const handleSaveCustomPhrase = (phrase: CustomPhrase) => {
    updateActiveProfile((p) => {
      const already = p.savedCustomPhrases.some(
        (item) =>
          item.native === phrase.native && item.language === phrase.language
      );
      if (already) {
        setToastMsg('Already saved in your Family Notebook.');
        return p;
      }
      setToastMsg(`Saved to ${p.name}’s Family Notebook!`);
      return {
        ...p,
        savedCustomPhrases: [phrase, ...p.savedCustomPhrases],
      };
    });
  };

  const handleRemoveCustomPhrase = (phraseId: string) => {
    updateActiveProfile((p) => ({
      ...p,
      savedCustomPhrases: p.savedCustomPhrases.filter((c) => c.id !== phraseId),
    }));
  };

  const handleAddProfile = (
    name: string,
    avatarEmoji: string,
    thaiPoliteForm: ThaiPoliteForm
  ) => {
    const newId = `profile-${Date.now()}`;
    const newProfile: FamilyProfile = {
      id: newId,
      name,
      avatarEmoji,
      thaiPoliteForm,
      activeLanguage,
      learnedPhraseIds: [],
      favoritePhraseIds: [],
      savedCustomPhrases: [],
      introPrefs: {
        displayName: name,
        originKey: 'singapore',
        companionKey: 'family',
        loveKey: 'food',
      },
    };
    setAppState((prev) => ({
      ...prev,
      activeProfileId: newId,
      profiles: [...prev.profiles, newProfile],
    }));
    setToastMsg(`Welcome, ${name}!`);
  };

  return (
    <div className="app-viewport">
      <div className="app-shell">
        {/* Sticky Top Bar */}
        <header className="top-header">
          <div className="header-row">
            <div className="brand-lockup">
              <div className="brand-mark" aria-hidden="true">
                L
              </div>
              <div>
                <span className="brand-title">Lingo</span>
                <span className="brand-sub">Family Social Companion</span>
              </div>
            </div>

            <div className="header-controls">
              <button
                type="button"
                className={`speed-pill ${
                  appState.playbackRate === 0.75 ? 'slow' : ''
                }`}
                onClick={handleToggleSpeed}
                title="Toggle audio playback speed"
                aria-label={`Audio speed ${appState.playbackRate}x`}
              >
                <Gauge size={13} />
                {appState.playbackRate === 0.75 ? '0.75x Slow' : '1.0x'}
              </button>

              <button
                type="button"
                className="profile-chip"
                onClick={() => setActiveTab('family')}
                aria-label="Switch family profile"
              >
                <span>{activeProfile.avatarEmoji}</span>
                <span>{activeProfile.name}</span>
              </button>
            </div>
          </div>

          <nav className="lang-strip" aria-label="Choose language">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`lang-btn ${
                  activeLanguage === lang.code ? 'active' : ''
                }`}
                onClick={() => handleSelectLanguage(lang.code)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Main View */}
        <main className="main-content">
          {activeTab === 'connect' && (
            <ConnectTab
              profile={activeProfile}
              language={activeLanguage}
              speakingId={speakingId}
              onSpeak={handleSpeak}
              onToggleLearned={handleToggleLearned}
              onToggleFavorite={handleToggleFavorite}
              onChangeThaiPolite={handleChangeThaiPolite}
            />
          )}

          {activeTab === 'intro' && (
            <IntroTab
              profile={activeProfile}
              language={activeLanguage}
              speakingId={speakingId}
              onSpeak={handleSpeak}
              onUpdateIntroPrefs={handleUpdateIntroPrefs}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeTab
              profile={activeProfile}
              language={activeLanguage}
              speakingId={speakingId}
              onSpeak={handleSpeak}
              onSaveCustomPhrase={handleSaveCustomPhrase}
            />
          )}

          {activeTab === 'family' && (
            <FamilyTab
              profiles={appState.profiles}
              activeProfile={activeProfile}
              speakingId={speakingId}
              onSelectProfile={(id) =>
                setAppState((prev) => ({ ...prev, activeProfileId: id }))
              }
              onAddProfile={handleAddProfile}
              onSpeak={handleSpeak}
              onRemoveCustomPhrase={handleRemoveCustomPhrase}
            />
          )}
        </main>

        {/* Toast */}
        {toastMsg && (
          <div className="toast-banner" role="status">
            <span>{toastMsg}</span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              style={{ fontWeight: 700, color: '#F6C6B3' }}
            >
              OK
            </button>
          </div>
        )}

        {/* Sticky Bottom Navigation */}
        <nav className="bottom-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'connect' ? 'active' : ''}`}
            onClick={() => setActiveTab('connect')}
          >
            <MessageCircleHeart size={20} />
            <span>Connect</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => setActiveTab('intro')}
          >
            <UserRound size={20} />
            <span>My Intro</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Sparkles size={20} />
            <span>Situations</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            <Users size={20} />
            <span>Family</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
