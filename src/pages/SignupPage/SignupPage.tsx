// src/pages/SignupPage/SignupPage.tsx

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // 1. Importa as "Ações"
import { useAuthStore } from '../../store/useAuthStore'; // 2. Importa o "Cérebro"
import '../AuthPages.css'; 

const SignupPage = () => {
  // Estados locais (só para os campos do formulário)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // 3. Pegamos a AÇÃO de 'signup' do nosso hook de ações
  const { signup } = useAuth();

  // 4. Lemos os ESTADOS GLOBAIS direto do "cérebro" (Zustand)
  // Esta é a sintaxe correta do Zustand: usamos "seletores"
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const setAuthError = useAuthStore((state) => state.setError); // Ação para limpar o erro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLocalError(null); // Limpa erro local
    setAuthError(null);  // Limpa erro global do "cérebro"

    // Validação local
    if (password !== confirmPassword) {
      setLocalError('As senhas não conferem!');
      return; 
    }
    
    // Chama a ação de signup
    await signup(email, password);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="mb-4">Produtiv.io</h1>
        <h2 className="h4 mb-4 fw-normal">Criar nova conta</h2>
        
        <form onSubmit={handleSubmit}>
        
          {/* Mostra o erro global (authError) ou o erro local (localError) */}
          {(authError || localError) && (
            <div className="alert alert-danger">
              {authError || localError}
            </div>
          )}

          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="floatingEmail" 
              placeholder="name@example.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <label htmlFor="floatingEmail">E-mail</label>
          </div>
          <div className="form-floating mb-3">
            <input 
              type="password" 
              className="form-control" 
              id="floatingPassword" 
              placeholder="Password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <label htmlFor="floatingPassword">Senha (mín. 6 caracteres)</label>
          </div>
          <div className="form-floating mb-4">
            <input 
              type="password" 
              className="form-control" 
              id="floatingConfirmPassword" 
              placeholder="Confirm Password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <label htmlFor="floatingConfirmPassword">Confirmar Senha</label>
          </div>
          
          {/* Lê o 'isLoading' do cérebro global */}
          <button 
            className="w-100 btn btn-lg btn-primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="mt-4 text-muted">
          Já tem uma conta? <a href="/login">Entre</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;