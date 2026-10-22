import admin from 'firebase-admin';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

let firebaseApp: admin.app.App | null = null;

export interface VerifiedFirebaseToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
}

export function initFirebaseAdmin(): admin.app.App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    if (env.FIREBASE_PRIVATE_KEY && env.FIREBASE_CLIENT_EMAIL) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      logger.info('✅ Firebase Admin SDK initialized with service account.');
    } else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      firebaseApp = admin.initializeApp({
        projectId: env.FIREBASE_PROJECT_ID || 'demo-kaarigar',
      });
      logger.info({ emulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST }, '✅ Firebase Admin SDK initialized with Auth Emulator.');
    } else {
      logger.warn('⚠️ Firebase credentials not configured. Production requires valid service account credentials.');
    }
  } catch (err: unknown) {
    logger.error({ error: err instanceof Error ? err.message : String(err) }, 'Failed to initialize Firebase Admin SDK');
  }

  return firebaseApp;
}

export async function verifyFirebaseIdToken(token: string): Promise<VerifiedFirebaseToken> {
  // 1. Allow Dev/Test bypass only if explicitly enabled in non-production
  if (env.ALLOW_DEV_AUTH_BYPASS && token.startsWith('mock-token-')) {
    const parts = token.replace('mock-token-', '').split(':');
    const role = parts[0] || 'customer';
    const email = parts[1] || `${role}@test.kaarigar.ai`;
    const uid = `mock_uid_${role}_${Buffer.from(email).toString('hex').slice(0, 12)}`;
    return {
      uid,
      email,
      name: `Test ${role.toUpperCase()} User`,
      picture: 'https://placehold.co/150x150.png',
      emailVerified: true,
    };
  }

  // 2. Real verification with Firebase Admin SDK
  const app = initFirebaseAdmin();
  if (!app) {
    throw new Error('Firebase Admin SDK is not initialized. Check credentials.');
  }

  try {
    // checkRevoked = true checks if the token has been revoked
    const decodedToken = await admin.auth(app).verifyIdToken(token, true);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid or expired Firebase ID token';
    logger.warn({ error: errorMsg }, 'Firebase token verification failed');
    throw new Error(errorMsg);
  }
}
