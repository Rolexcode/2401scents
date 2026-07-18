import {
  signInWithEmailAndPassword, signOut as fbSignOut,
  onAuthStateChanged, type User,
} from 'firebase/auth';
import { auth } from './firebase';

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function signOutAdmin() {
  return fbSignOut(auth);
}
export function watchAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
