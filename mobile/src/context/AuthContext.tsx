import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminUser } from '../types/admin';
import { apiService } from '../services/api';

const STORAGE_KEY = '@active_community:admin_session';

interface AuthContextData {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarSessao = async () => {
      try {
        const sessaoSalva = await AsyncStorage.getItem(STORAGE_KEY);
        if (sessaoSalva) {
          const { admin: savedAdmin, token: savedToken } = JSON.parse(sessaoSalva);
          setAdmin(savedAdmin);
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão de administrador:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarSessao();
  }, []);

  const login = async (email: string, senha: string) => {
    const resultado = await apiService.loginAdmin(email, senha);
    setAdmin(resultado.admin);
    setToken(resultado.token);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          admin: resultado.admin,
          token: resultado.token,
        })
      );
    } catch (error) {
      console.error('Erro ao salvar sessão localmente:', error);
    }
  };

  const logout = async () => {
    setAdmin(null);
    setToken(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao remover sessão local:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
