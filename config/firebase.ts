import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import env from '#start/env';
import * as path from 'path';
import { readFileSync } from 'fs';

const serviceAccountPath = env.get('FIREBASE_PRIVATE_KEY_PATH');

if (!serviceAccountPath) {
  throw new Error('FIREBASE_PRIVATE_KEY_PATH environment variable is not set');
}

const serviceAccount: ServiceAccount = JSON.parse(
  readFileSync(path.resolve(serviceAccountPath), 'utf8')
);

// Verificar si Firebase ya está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;