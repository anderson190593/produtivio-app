// src/components/Sidebar/Sidebar.tsx

import { Link, NavLink } from 'react-router-dom'; // Para navegação
import { useAuth } from '../../hooks/useAuth'; // Para a ação de logout
import { useAuthStore } from '../../store/useAuthStore'; // Para ler quem é o usuário
import './Sidebar.css'; // Nossos estilos
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa os ícones do Bootstrap

const Sidebar = () => {
  // Pega a ação de logout do hook de ações
  const { logout } = useAuth();
  
  // Lê o estado de 'loading' e 'user' do cérebro global
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">Produtiv.io</Link>
      </div>

      <div className="sidebar-user">
        {/* Mostra o e-mail do usuário (ou 'Carregando...') */}
        <span className="user-email">
          {user ? user.email : 'Carregando...'}
        </span>
      </div>

      {/* Navegação Principal */}
      <ul className="nav flex-column sidebar-nav">
        <li className="nav-item">
          {/* NavLink é especial: ele sabe qual é a "página ativa" */}
          <NavLink to="/" className="nav-link" end>
            <i className="bi bi-grid-1x2-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/tasks" className="nav-link">
            <i className="bi bi-check2-square me-2"></i>
            Tarefas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/notes" className="nav-link">
            <i className="bi bi-journal-text me-2"></i>
            Notas
          </NavLink>
        </li>
      </ul>

      {/* Botão de Sair (no final) */}
      <div className="sidebar-footer">
        <button 
          className="btn btn-danger w-100" 
          onClick={logout}
          disabled={isLoading}
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          {isLoading ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;