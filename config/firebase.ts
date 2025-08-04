import * as admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import env from '#start/env';
import * as path from 'path';

const serviceAccountPath = env.get('FIREBASE_PRIVATE_KEY_PATH');
const serviceAccount: ServiceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;