import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DEMO_ARTISAN_USER, DEMO_ADMIN_USER } from '../lib/staticData';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate a short async delay for realistic UX
function fakeDelay(ms = 600) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking an existing session from localStorage
    const stored = localStorage.getItem('juthoor_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('juthoor_user');
      }
    }
    setLoading(false);
  }, []);

  async function signUp(email: string, _password: string, userData: Partial<User>): Promise<void> {
    setLoading(true);
    await fakeDelay();
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      user_type: userData.user_type ?? 'buyer',
      full_name: userData.full_name ?? email.split('@')[0],
      profile_photo_url: userData.profile_photo_url,
    };
    
    const users = JSON.parse(localStorage.getItem('juthoor_users') || '[]');
    // prevent duplicates if testing with same email
    const filteredUsers = users.filter((u: User) => u.email !== email);
    filteredUsers.push(newUser);
    localStorage.setItem('juthoor_users', JSON.stringify(filteredUsers));

    localStorage.setItem('juthoor_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  }

  async function signIn(email: string, _password: string): Promise<void> {
    setLoading(true);
    await fakeDelay();
    
    const users = JSON.parse(localStorage.getItem('juthoor_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);

    const resolvedUser: User = existingUser || (
      email === DEMO_ARTISAN_USER.email ? DEMO_ARTISAN_USER :
      email === DEMO_ADMIN_USER.email ? DEMO_ADMIN_USER :
      {
          id: `user-${Date.now()}`,
          email,
          user_type: 'buyer',
          full_name: email.split('@')[0],
      }
    );
    localStorage.setItem('juthoor_user', JSON.stringify(resolvedUser));
    setUser(resolvedUser);
    setLoading(false);
  }

  async function signOut(): Promise<void> {
    await fakeDelay(300);
    localStorage.removeItem('juthoor_user');
    setUser(null);
  }

  async function updateUser(data: Partial<User>): Promise<void> {
    setLoading(true);
    await fakeDelay();
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('juthoor_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
