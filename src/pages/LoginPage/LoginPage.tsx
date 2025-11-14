// src/pages/LoginPage/LoginPage.tsx

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // 1. Importa as "Ações"
import { useAuthStore } from '../../store/useAuthStore'; // 2. Importa o "Cérebro"
import '../AuthPages.css'; 

const LoginPage = () => {
  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Pegamos as AÇÕES
  const { login, loginWithGoogle } = useAuth();
  
  // 4. Lemos os ESTADOS GLOBAIS
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError); // Para limpar o erro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros antigos
    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    setError(null); // Limpa erros antigos
    await loginWithGoogle();
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="mb-4">Produtiv.io</h1>
        <h2 className="h4 mb-4 fw-normal">Login</h2>
        
        <form onSubmit={handleSubmit}>

          {/* Lê o 'error' do cérebro global */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="floatingInput" 
              placeholder="name@example.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <label htmlFor="floatingInput">E-mail</label>
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
            <label htmlFor="floatingPassword">Senha</label>
          </div>
          
          {/* Lê o 'isLoading' do cérebro global */}
          <button 
            className="w-100 btn btn-lg btn-primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-separator">
          <span>OU</span>
        </div>

        <button 
          className="w-100 btn btn-lg btn-outline-dark" 
          onClick={handleGoogleLogin}
          disabled={isLoading} // Também desabilita durante o carregamento
        >
          {/* Ícone do Google */}
          <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
          Entrar com Google
        </button>
        
        <p className="mt-4 text-muted">
          Não tem uma conta? <a href="/signup">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;