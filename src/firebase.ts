import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

type Source = 'env' | 'hosting-runtime' | 'missing';

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

function clean(value: string | undefined) {
  const next = value?.trim();
  if (!next) return undefined;
  if (next.includes('PASTE_') || next.includes('YOUR_') || next.includes('_HERE')) return undefined;
  return next;
}

function envConfig(): FirebaseOptions {
  return {
    apiKey: clean(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: clean(import.meta.env.VITE_FIREBASE_APP_ID),
  };
}

function missingKeys(config: FirebaseOptions) {
  return requiredKeys.filter((key) => !config[key]);
}

async function hostingRuntimeConfig(): Promise<FirebaseOptions | null> {
  try {
    const response = await fetch('/__/firebase/init.json', { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as FirebaseOptions;
  } catch {
    return null;
  }
}

let app: FirebaseApp | null = null;
let appPromise: Promise<FirebaseApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let source: Source = 'missing';

async function resolveFirebaseConfig(): Promise<FirebaseOptions> {
  const fromEnv = envConfig();
  if (missingKeys(fromEnv).length === 0) {
    source = 'env';
    return fromEnv;
  }

  const fromHosting = await hostingRuntimeConfig();
  if (fromHosting && missingKeys(fromHosting).length === 0) {
    source = 'hosting-runtime';
    return fromHosting;
  }

  throw new Error(`Missing Firebase browser config: ${missingKeys(fromEnv).join(', ')}`);
}

export async function getFirebaseAppAsync(): Promise<FirebaseApp> {
  appPromise ??= resolveFirebaseConfig().then((config) => {
    app ??= initializeApp(config);
    return app;
  });
  return appPromise;
}

export async function getFirebaseAuthAsync(): Promise<Auth> {
  auth ??= getAuth(await getFirebaseAppAsync());
  return auth;
}

export async function getFirebaseDbAsync(): Promise<Firestore> {
  db ??= getFirestore(await getFirebaseAppAsync());
  return db;
}

export function getFirebaseConfigSource(): Source {
  return source;
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) app = initializeApp(envConfig());
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}
