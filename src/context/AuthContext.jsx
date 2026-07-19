import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, microsoftProvider } from '../scripts/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [role, setRoleState] = useState('student');
  const [actualRole, setActualRole] = useState('student');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user){
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        let fetchedRole = 'student';
        if (!snap.exists()){
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName ?? null,
            email: user.email ?? null,
            role: 'student',
            points: 0,
            createdAt: serverTimestamp(),
          });
        } else {
          fetchedRole = snap.data()?.role ?? 'student';
        }
        setActualRole(fetchedRole);
        setRoleState(fetchedRole);
      } else {
        setActualRole('student');
        setRoleState('student');
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);
  const logout = () => signOut(auth);

  const setRole = (nextRole) => {
    if (actualRole != 'teacher') return;
    setRoleState(nextRole);
  };

  const value = {
    currentUser,
    loading,
    role,
    setRole,
    isRealTeacher: actualRole === 'teacher',
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