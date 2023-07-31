import { Capacitor } from "@capacitor/core";
import { getApp, initializeApp } from "firebase/app";
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});

let _firebaseAuth = null;

if (Capacitor.isNativePlatform()) {
  _firebaseAuth = initializeAuth(getApp(), {
    persistence: indexedDBLocalPersistence,
  });
} else {
  _firebaseAuth = getAuth();
}

export const firebaseAuth = _firebaseAuth;

// used for the firestore refs
export const db = getFirestore(firebaseApp);
export const todos_collection = collection(db, "todos");
