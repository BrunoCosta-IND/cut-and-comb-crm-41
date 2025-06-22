
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { storage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const currentUser = storage.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Erro ao carregar usuário atual:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = storage.getUserByEmail(email);
      
      // Verificar credenciais (em produção, isso seria feito no backend)
      const validCredentials = (
        (email === 'creator@barbershop.com' && password === 'creator123') ||
        (email === 'admin@barbeariaelegante.com' && password === 'admin123')
      );
      
      if (foundUser && validCredentials) {
        setUser(foundUser);
        storage.setCurrentUser(foundUser);
        setIsLoading(false);
        return true;
      }
      
      setError('Email ou senha incorretos');
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Erro interno. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      storage.clearCurrentUser();
      setError(null);
    } catch (err) {
      console.error('Erro durante o logout:', err);
      setError('Erro ao fazer logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
