// src/hooks/useAuth.ts

import { useNavigate } from 'react-router-dom'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase/config'; 
import { useAuthStore } from '../store/useAuthStore'; // Importar o "cérebro"

// Este é o nosso hook customizado
export const useAuth = () => {
  
  // --- MUDANÇA CRUCIAL AQUI ---
  // Em vez de usar .getState(), nós usamos o hook seletor.
  // Esta é a forma "reativa" e correta de pegar as ações do store.
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setError = useAuthStore((state) => state.setError);
  // --- FIM DA MUDANÇA ---

  const navigate = useNavigate(); 

  // --- FUNÇÃO DE TRATAMENTO DE ERRO (Sem mudanças) ---
  const handleError = (err: unknown) => {
    setIsLoading(false); 
    if (err instanceof Error) {
      setError(err.message); 
    } else {
      setError('Ocorreu um erro inesperado.'); 
    }
  };

  // Função 1: Cadastrar com E-mail/Senha
  const signup = async (email: string, password: string) => {
    setIsLoading(true); 
    setError(null);     
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); 
      setIsLoading(false);            
      navigate('/'); 
    } catch (err: unknown) { 
      handleError(err); 
    }
  };

  // Função 2: Logar com E-mail/Senha
  const login = async (email: string, password: string) => {
    setIsLoading(true); 
    setError(null);     
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); 
      setIsLoading(false);            
      navigate('/'); 
    } catch (err: unknown) { 
      handleError(err); 
    }
  };

  // Função 3: Logar com Google
  const loginWithGoogle = async () => {
    setIsLoading(true); 
    setError(null);     
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); 
      setIsLoading(false);    
      navigate('/'); 
    } catch (err: unknown) { 
      handleError(err); 
    }
  };

  // Função 4: Deslogar (Logout)
  const logout = async () => {
    setIsLoading(true); 
    setError(null);     
    try {
      await signOut(auth);
      setUser(null); 
      setIsLoading(false); 
      navigate('/login'); 
    } catch (err: unknown) { 
      handleError(err); 
    }
  };

  // O hook agora SÓ retorna as ações.
  return { signup, login, loginWithGoogle, logout };
};