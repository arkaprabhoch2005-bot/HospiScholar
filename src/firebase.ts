import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { getFirestore, initializeFirestore, collection, addDoc } from 'firebase/firestore';

import firebaseConfigLocal from '../firebase-applet-config.json';

// Use environment variables if available (Vercel), otherwise fallback to local config (AI Studio)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigLocal.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigLocal.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigLocal.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigLocal.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigLocal.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigLocal.appId
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const dbId = (firebaseConfigLocal as { firestoreDatabaseId?: string })?.firestoreDatabaseId;

function initFirestoreInstance() {
  const settings = {
    experimentalForceLongPolling: true,
  };
  try {
    if (dbId && dbId !== '(default)') {
      return initializeFirestore(app, settings, dbId);
    }
    return initializeFirestore(app, settings);
  } catch {
    if (dbId && dbId !== '(default)') {
      return getFirestore(app, dbId);
    }
    return getFirestore(app);
  }
}

export const db = initFirestoreInstance();
export const appId = "hospi-scholar-app";

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signInAnonymously };

export type OperationType = 'create' | 'read' | 'update' | 'delete' | 'list';

/**
 * Structured error handler for Firestore operations.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string): void {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    code: (error as any)?.code,
    operationType,
    path
  };
  console.warn(`Firestore Error [${operationType}] on ${path}:`, JSON.stringify(errInfo));
}

export interface GuestVisitRecord {
  name: string;
  email: string;
  photoURL: string;
  method: 'google' | 'guest' | 'admin';
  status: 'signed_in' | 'attempted' | 'failed' | 'guest_access';
  userAgent: string;
  timestamp: number;
  time: string;
  date: string;
  uid: string;
  errorDetails?: string;
}

/**
 * Tracks a guest/visitor entrance or login attempt to Firestore
 */
export async function recordGuestVisit(record: Omit<GuestVisitRecord, 'timestamp' | 'time' | 'date' | 'userAgent'> & { errorDetails?: string }) {
  if (!db) return;
  const path = `artifacts/${appId}/public/data/guest_visits`;
  try {
    const now = new Date();
    const data: GuestVisitRecord = {
      name: (record.name || 'Anonymous Visitor').slice(0, 120),
      email: (record.email || '').slice(0, 150),
      photoURL: (record.photoURL || '').slice(0, 1000),
      method: record.method,
      status: record.status,
      userAgent: (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown').slice(0, 500),
      timestamp: now.getTime(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: now.toLocaleDateString(),
      uid: (record.uid || `guest-${Math.random().toString(36).substring(2, 9)}`).slice(0, 128),
      errorDetails: (record.errorDetails || '').slice(0, 200)
    };

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'guest_visits'), data);
    return data;
  } catch (err) {
    handleFirestoreError(err, 'create', path);
    return null;
  }
}
