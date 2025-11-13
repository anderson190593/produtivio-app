// src/pages/LoginPage/LoginPage.tsx

import '../AuthPages.css'; // Importa os estilos desta página

// Sintaxe limpa e moderna do componente
const LoginPage = () => {
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="mb-4">Produtiv.io</h1>
        <h2 className="h4 mb-4 fw-normal">Login</h2>
        
        <form>
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="floatingInput" 
              placeholder="name@example.com" 
              required 
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
            />
            <label htmlFor="floatingPassword">Senha</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Entrar
          </button>
        </form>
        
        <p className="mt-4 text-muted">
          Não tem uma conta? <a href="/signup">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;