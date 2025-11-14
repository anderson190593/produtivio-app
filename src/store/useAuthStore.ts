// src/store/useAuthStore.ts

import { create } from 'zustand';
import type { User } from 'firebase/auth'; 

// 1. Definimos os tipos (agora com 'error' e 'setError')
interface AuthState {
  user: User | null;         
  isLoading: boolean;        
  error: string | null; // <-- ADICIONADO
  setUser: (user: User | null) => void; 
  setIsLoading: (loading: boolean) => void; 
  setError: (error: string | null) => void; // <-- ADICIONADO
}

// 2. Criamos o "store"
export const useAuthStore = create<AuthState>((set) => ({
  // 3. Valores iniciais
  user: null,       
  isLoading: true,  
  error: null, // <-- ADICIONADO
  
  // 4. Ações
  setUser: (user) => set({ user, error: null }), // Limpa o erro ao setar o usuário
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }), // <-- ADICIONADO
}));