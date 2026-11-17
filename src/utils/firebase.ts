import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { FamilyProfile } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as
    | string
    | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function subscribeAuth(
  callback: (user: User | null) => void
): () => void {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function signInHousehold(
  email: string,
  password: string
): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured.');
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signUpHousehold(
  email: string,
  password: string
): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured.');
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutHousehold(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function fetchHouseholdMembers(
  userId: string
): Promise<FamilyProfile[]> {
  if (!db) return [];
  const membersRef = collection(db, 'households', userId, 'members');
  const snapshot = await getDocs(membersRef);
  const profiles: FamilyProfile[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as FamilyProfile;
    profiles.push({
      ...data,
      id: docSnap.id,
      learnedPhraseIds: data.learnedPhraseIds ?? [],
      favoritePhraseIds: data.favoritePhraseIds ?? [],
      savedCustomPhrases: data.savedCustomPhrases ?? [],
    });
  });
  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

export async function upsertHouseholdMember(
  userId: string,
  profile: FamilyProfile
): Promise<void> {
  if (!db) return;
  const memberRef = doc(db, 'households', userId, 'members', profile.id);
  const payload: Record<string, unknown> = {
    id: profile.id,
    name: profile.name,
    avatarEmoji: profile.avatarEmoji,
    thaiPoliteForm: profile.thaiPoliteForm,
    activeLanguage: profile.activeLanguage,
    learnedPhraseIds: profile.learnedPhraseIds,
    favoritePhraseIds: profile.favoritePhraseIds,
    savedCustomPhrases: profile.savedCustomPhrases,
    introPrefs: profile.introPrefs,
    updatedAt: Date.now(),
  };
  if (profile.pin) {
    payload.pin = profile.pin;
  }
  await setDoc(memberRef, payload, { merge: true });
}

export async function deleteHouseholdMember(
  userId: string,
  profileId: string
): Promise<void> {
  if (!db) return;
  const memberRef = doc(db, 'households', userId, 'members', profileId);
  await deleteDoc(memberRef);
}
