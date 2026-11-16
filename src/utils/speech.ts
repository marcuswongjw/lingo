import type { LanguageCode, ThaiPoliteForm } from '../types';
import { LANGUAGES } from '../data/languages';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function resolveThaiText(
  native: string,
  phonetic: string,
  politeForm: ThaiPoliteForm,
  nativeAltFemale?: string,
  phoneticAltFemale?: string
): { native: string; phonetic: string } {
  if (politeForm === 'kha' && nativeAltFemale && phoneticAltFemale) {
    return { native: nativeAltFemale, phonetic: phoneticAltFemale };
  }
  const politeThai = politeForm === 'khrap' ? 'ครับ' : 'ค่ะ';
  const politePhon = politeForm === 'khrap' ? 'khrap' : 'kha';
  return {
    native: native.replace(/\{polite\}/g, politeThai),
    phonetic: phonetic.replace(/\{polite\}/g, politePhon),
  };
}

export function speakPhrase(
  text: string,
  language: LanguageCode,
  rate: number = 1.0,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (reason: string) => void;
  }
): void {
  if (!isSpeechSupported()) {
    callbacks?.onError?.('Speech playback is not supported in this browser.');
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const langMeta = LANGUAGES.find((l) => l.code === language);
  const targetBcp47 = langMeta?.bcp47 ?? 'en-US';
  const targetPrefix = targetBcp47.split('-')[0].toLowerCase();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetBcp47;
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = synth.getVoices();
  if (voices.length > 0) {
    const exactVoice = voices.find(
      (v) => v.lang.toLowerCase() === targetBcp47.toLowerCase()
    );
    const prefixVoice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(targetPrefix)
    );
    const chosen = exactVoice ?? prefixVoice;
    if (chosen) {
      utterance.voice = chosen;
    }
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
  };

  utterance.onerror = (event) => {
    if (event.error === 'interrupted' || event.error === 'canceled') {
      callbacks?.onEnd?.();
      return;
    }
    callbacks?.onError?.(
      `Audio voice for ${langMeta?.name ?? language} may not be installed on this device.`
    );
    callbacks?.onEnd?.();
  };

  synth.speak(utterance);
}

/** Pre-warm voices list on browsers that load voices asynchronously */
export function warmupVoices(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.getVoices();
}
