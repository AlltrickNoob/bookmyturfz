// backend/firebase.js
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(decoded);
  } catch (error) {
    console.error('[firebase] Invalid FIREBASE_SERVICE_ACCOUNT_BASE64:', error.message);
  }
}

if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('[firebase] Invalid FIREBASE_SERVICE_ACCOUNT JSON:', error.message);
  }
}

if (!serviceAccount) {
  const serviceAccountPath = path.join(__dirname, '..', 'seed', 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  }
}

if (!serviceAccount) {
  throw new Error('Firebase service account not configured. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT, or include seed/serviceAccountKey.json');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://turf-1c32c-default-rtdb.firebaseio.com/'
  });
}

module.exports = admin;
