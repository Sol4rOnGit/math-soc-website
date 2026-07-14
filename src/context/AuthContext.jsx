import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, microsoftProvider } from '../scripts/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // DEMO ONLY: role normally comes from Firestore, e.g. a `users/{uid}.role`
  // field set by an admin. Until Firestore is wired up, use local state so
  // both teacher and student views can be demoed with the switcher in the navbar.
  const [role, setRole] = useState('student');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // Real implementation: fetch role here, e.g.
      // const snap = await getDoc(doc(db, 'users', user.uid));
      // setRole(snap.data()?.role ?? 'student');
    });
    return unsubscribe;
  }, []);

  const loginWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);
  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loading,
    role,
    setRole,
    loginWithMicrosoft,
    logout,
    isTeacher: role === 'teacher',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}