import * as admin from 'firebase-admin';

// Initialize Firebase Admin singleton
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();

// Configure Firestore settings
db.settings({ ignoreUndefinedProperties: true });
