import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

type FirebaseConfigStatus = {
  ready: boolean;
  source: 'env' | 'hosting-runtime' | 'missing';
  missing: string[];
  authDomain?: string;
  projectId?: string;
};

const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
] as const;

function clean(value: string | undefined) {
  const next = value?.trim();
  if (!next) return undefined;
  if (next.includes('PASTE_') || next.includes('YOUR_') || next.includes('_HERE')) return undefined;
  return next;
}

function envConfig(): FirebaseOptions {
  return {
    apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };
}

function missingKeys(config: FirebaseOptions) {
  return requiredKeys.filter((key) => !config[key]);
}

async function hostingRuntimeConfig(): Promise<FirebaseOptions | null> {
  if (typeof window === 'undefined') return null;

  try {
    const response = await fetch('/__/firebase/init.json', { cache: 'no-store' });
    if (!response.ok) return null;

    const payload = (await response.json()) as FirebaseOptions;
    return payload;
  } catch {
    return null;
  }
}

let appPromise: Promise<FirebaseApp> | null = null;
let resolvedConfig: FirebaseOptions | null = null;
let resolvedSource: FirebaseConfigStatus['source'] = 'missing';

async function resolveFirebaseConfig(): Promise<FirebaseOptions> {
  const fromEnv = envConfig();
  if (missingKeys(fromEnv).length === 0) {
    resolvedConfig = fromEnv;
    resolvedSource = 'env';
    return fromEnv;
  }

  const fromHosting = await hostingRuntimeConfig();
  if (fromHosting && missingKeys(fromHosting).length === 0) {
    resolvedConfig = fromHosting;
    resolvedSource = 'hosting-runtime';
    return fromHosting;
  }

  const missing = missingKeys(fromEnv).join(', ');
  throw new Error(`Missing Firebase browser config: ${missing}. Firebase Hosting runtime config was not available at /__/firebase/init.json.`);
}

export async function getFirebaseApp(): Promise<FirebaseApp> {
  appPromise ??= resolveFirebaseConfig().then((config) => {
    const existing = getApps()[0];
    if (existing) return getApp();
    return initializeApp(config);
  });

  return appPromise;
}

export async function getClientAuth(): Promise<Auth> {
  return getAuth(await getFirebaseApp());
}

export async function getClientFirestore(): Promise<Firestore> {
  return getFirestore(await getFirebaseApp());
}

export async function getFirebaseConfigStatus(): Promise<FirebaseConfigStatus> {
  try {
    const app = await getFirebaseApp();
    const options = resolvedConfig ?? app.options;
    return {
      ready: true,
      source: resolvedSource,
      missing: [],
      authDomain: typeof options.authDomain === 'string' ? options.authDomain : undefined,
      projectId: typeof options.projectId === 'string' ? options.projectId : undefined,
    };
  } catch {
    const fromEnv = envConfig();
    return {
      ready: false,
      source: 'missing',
      missing: missingKeys(fromEnv),
      authDomain: typeof fromEnv.authDomain === 'string' ? fromEnv.authDomain : undefined,
      projectId: typeof fromEnv.projectId === 'string' ? fromEnv.projectId : undefined,
    };
  }
}

// Backwards-compatible exports for older imports. New browser code should use
// getClientAuth/getClientFirestore so Firebase Hosting runtime config can load.
export const app = null as unknown as FirebaseApp;
export const firebaseApp = app;
export const firestore = null as unknown as Firestore;
export const auth = null as unknown as Auth;
