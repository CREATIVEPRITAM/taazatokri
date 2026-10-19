import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLLECTIONS, AdminUser } from '@taazatokri/shared';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify that the authenticated UID exists in the 'admins' collection
          const adminDocRef = doc(db, COLLECTIONS.ADMINS, firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists()) {
            setUser(firebaseUser);
            setAdminProfile(adminDoc.data() as AdminUser);
            setError(null);
          } else {
            // Immediate sign out if user is not in the admins collection
            await signOut(auth);
            setUser(null);
            setAdminProfile(null);
            setError('You are not authorized to access the TaazaTokari Admin Panel.');
          }
        } catch (err) {
          console.error('[AuthContext] Verification error:', err);
          await signOut(auth);
          setUser(null);
          setAdminProfile(null);
          setError('Failed to verify admin authorization. Please try again.');
        }
      } else {
        setUser(null);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      // Verify presence in the 'admins' collection
      const adminDocRef = doc(db, COLLECTIONS.ADMINS, uid);
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
        await signOut(auth);
        setUser(null);
        setAdminProfile(null);
        const unauthorizedMessage = 'You are not authorized to access the TaazaTokari Admin Panel.';
        setError(unauthorizedMessage);
        throw new Error(unauthorizedMessage);
      }

      setUser(userCredential.user);
      setAdminProfile(adminDoc.data() as AdminUser);
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      let friendlyMessage = err.message || 'An error occurred during login.';

      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        friendlyMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Invalid email format. Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Too many failed login attempts. Please try again later or reset your password.';
      } else if (err.message && err.message.includes('not authorized')) {
        friendlyMessage = 'You are not authorized to access the TaazaTokari Admin Panel.';
      }

      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setAdminProfile(null);
    } catch (err: any) {
      console.error('[AuthContext] Logout error:', err);
      setError('Failed to log out. Please try again.');
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error('[AuthContext] Password reset error:', err);
      let friendlyMessage = 'Failed to send password reset email.';
      if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please provide a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        // For security, don't disclose whether user exists, or show clear note
        friendlyMessage = 'If an account exists with this email, a reset link has been dispatched.';
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        loading,
        error,
        login,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
