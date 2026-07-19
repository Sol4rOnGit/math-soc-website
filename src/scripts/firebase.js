import { initializeApp } from 'firebase/app';
import { getAuth, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//microsoft auth
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  // tenant: 'YOUR_AZURE_TENANT_ID', // uncomment to restrict sign-in to school's tenant if we have that and want to do this
});