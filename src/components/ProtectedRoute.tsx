// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Este componente é o nosso "Segurança de Balada"
const ProtectedRoute = () => {
  // 1. Ele verifica o "cérebro" para saber o status do usuário
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // 2. Se o app ainda está "Carregando" (verificando o login), mostre um spinner
  if (isLoading) {
    return (
      <div className="login-page-wrapper">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // 3. Se *não* está carregando e o usuário é 'null' (deslogado)
  if (!user) {
    // Redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // 4. Se passou por tudo, o usuário está logado.
  // O <Outlet /> é um placeholder do React Router que diz:
  // "Mostre qualquer página que esteja *dentro* desta Rota Protegida" (ex: o Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;