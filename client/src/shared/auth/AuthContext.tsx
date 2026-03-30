import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { upsertUserProfile } from "@/features/auth/services/userProfile";
import { auth } from "@/shared/firebase/firebase";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser(mapFirebaseUser(firebaseUser));
      void upsertUserProfile(firebaseUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await upsertUserProfile(credential.user);
      },
      signUp: async (email: string, password: string) => {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const baseName = email.split("@")[0] || "Usuario";
        const normalizedName =
          baseName.charAt(0).toUpperCase() + baseName.slice(1);
        await updateProfile(credential.user, { displayName: normalizedName });
        await upsertUserProfile(credential.user);
      },
      signOut: async () => {
        await firebaseSignOut(auth);
      },
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}

function mapFirebaseUser(firebaseUser: User): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName,
  };
}
