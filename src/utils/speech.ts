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

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResult>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

function normalizeForCompare(text: string, language: LanguageCode): string {
  const cleaned = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¡!¿?.,;:'"()\-…/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Thai has no spaces between words
  return language === 'th' ? cleaned.replace(/\s+/g, '') : cleaned;
}

function diceSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;

  const bigramsA = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i++) {
    const bg = a.slice(i, i + 2);
    bigramsA.set(bg, (bigramsA.get(bg) ?? 0) + 1);
  }

  let matches = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const bg = b.slice(i, i + 2);
    const count = bigramsA.get(bg) ?? 0;
    if (count > 0) {
      bigramsA.set(bg, count - 1);
      matches++;
    }
  }
  return (2 * matches) / (a.length - 1 + (b.length - 1));
}

export interface SpeechAssessmentResult {
  heard: string;
  score: number; // 0 to 100
  verdict: 'great' | 'close' | 'retry';
  feedback: string;
}

export function scoreSpeechMatch(
  expected: string,
  heard: string,
  language: LanguageCode
): SpeechAssessmentResult {
  const normExp = normalizeForCompare(expected, language);
  const normHeard = normalizeForCompare(heard, language);

  if (!normHeard) {
    return {
      heard,
      score: 0,
      verdict: 'retry',
      feedback: 'Didn’t catch that — try speaking a little closer to the mic.',
    };
  }

  let ratio = diceSimilarity(normExp, normHeard);

  if (language !== 'th') {
    const expWords = normExp.split(' ').filter(Boolean);
    const heardWords = new Set(normHeard.split(' ').filter(Boolean));
    const wordHits = expWords.filter((w) => heardWords.has(w)).length;
    const wordRatio = expWords.length > 0 ? wordHits / expWords.length : 0;
    ratio = Math.max(ratio, wordRatio * 0.65 + ratio * 0.35);
  }

  const score = Math.min(100, Math.round(ratio * 100));

  if (score >= 75) {
    return {
      heard,
      score,
      verdict: 'great',
      feedback: 'Great pronunciation! Sounds very clear.',
    };
  }
  if (score >= 45) {
    return {
      heard,
      score,
      verdict: 'close',
      feedback: 'Close! Listen at 0.75x and try one more time.',
    };
  }
  return {
    heard,
    score,
    verdict: 'retry',
    feedback: 'Not quite a match yet — tap Listen and give it another go!',
  };
}

let activeRecognition: SpeechRecognitionLike | null = null;

export function stopListening(): void {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // ignore
    }
    activeRecognition = null;
  }
}

export function startSpeechAssessment(
  language: LanguageCode,
  expectedText: string,
  callbacks: {
    onStart?: () => void;
    onResult: (result: SpeechAssessmentResult) => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }
): void {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    callbacks.onError(
      'Voice check is supported in Chrome and Safari. Try opening Lingo in Chrome or Safari on your phone!'
    );
    return;
  }

  stopSpeaking();
  stopListening();

  const langMeta = LANGUAGES.find((l) => l.code === language);
  const recognition = new Ctor();
  recognition.lang = langMeta?.bcp47 ?? 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let handled = false;
  activeRecognition = recognition;
  callbacks.onStart?.();

  recognition.onresult = (event) => {
    handled = true;
    const transcript = event.results[0]?.[0]?.transcript ?? '';
    const assessment = scoreSpeechMatch(expectedText, transcript, language);
    callbacks.onResult(assessment);
  };

  recognition.onerror = (event) => {
    handled = true;
    activeRecognition = null;
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      callbacks.onError('Microphone permission is needed to check your pronunciation.');
    } else if (event.error === 'no-speech') {
      callbacks.onError('No speech detected — tap the mic and speak right away.');
    } else if (event.error !== 'aborted') {
      callbacks.onError(`Could not check voice (${event.error}). Try again!`);
    }
    callbacks.onEnd?.();
  };

  recognition.onend = () => {
    activeRecognition = null;
    if (!handled) {
      callbacks.onEnd?.();
    } else {
      callbacks.onEnd?.();
    }
  };

  try {
    recognition.start();
  } catch {
    activeRecognition = null;
    callbacks.onError('Could not start microphone. Please try again.');
    callbacks.onEnd?.();
  }
}

