import React from 'react';
import { Volume2, X } from 'lucide-react';
import type { LanguageCode } from '../types';
import { LANGUAGES } from '../data/languages';

interface ShowLocalModalProps {
  nativeText: string;
  phoneticText: string;
  englishText: string;
  language: LanguageCode;
  isSpeaking: boolean;
  onSpeak: () => void;
  onClose: () => void;
}

export const ShowLocalModal: React.FC<ShowLocalModalProps> = ({
  nativeText,
  phoneticText,
  englishText,
  language,
  isSpeaking,
  onSpeak,
  onClose,
}) => {
  const langMeta = LANGUAGES.find((l) => l.code === language)!;

  return (
    <div
      className="show-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Show phrase to local"
      onClick={onClose}
    >
      <div className="show-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="show-modal-header">
          <span className="phrase-badge">
            {langMeta.flag} {langMeta.name}
          </span>
          <button
            type="button"
            className="show-modal-close"
            onClick={onClose}
            aria-label="Close full-screen card"
          >
            <X size={20} />
          </button>
        </div>

        <div className="show-modal-body">
          <div className="show-modal-native">{nativeText}</div>
          <div className="show-modal-phonetic">{phoneticText}</div>
          <p className="show-modal-english">“{englishText}”</p>
        </div>

        <button
          type="button"
          className="primary-listen-btn"
          onClick={onSpeak}
        >
          <Volume2 size={18} />
          {isSpeaking ? 'Speaking...' : `Play Audio (${langMeta.name})`}
        </button>
      </div>
    </div>
  );
};
