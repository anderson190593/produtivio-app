// src/pages/SignupPage/SignupPage.tsx

import '../AuthPages.css'; // 1. REUSANDO nosso CSS compartilhado!

const SignupPage = () => {
  return (
    <div className="login-page-wrapper"> {/* Usando a mesma classe do CSS compartilhado */}
      <div className="login-container"> {/* Usando a mesma classe */}
        <h1 className="mb-4">Produtiv.io</h1>
        <h2 className="h4 mb-4 fw-normal">Criar nova conta</h2>
        
        <form>
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="floatingEmail" 
              placeholder="name@example.com" 
              required 
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
            />
            <label htmlFor="floatingPassword">Senha</label>
          </div>
          <div className="form-floating mb-4">
            <input 
              type="password" 
              className="form-control" 
              id="floatingConfirmPassword" 
              placeholder="Confirm Password" 
              required 
            />
            <label htmlFor="floatingConfirmPassword">Confirmar Senha</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Cadastrar
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