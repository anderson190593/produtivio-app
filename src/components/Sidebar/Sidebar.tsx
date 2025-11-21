// src/components/Sidebar/Sidebar.tsx

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useUIStore } from '../../store/useUIStore'; 
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasks);
  
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <>
      {/* Overlay escuro para mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      />

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <Link to="/" className="sidebar-brand" onClick={closeSidebar}>
            <i className="bi bi-terminal-fill" style={{ color: 'var(--accent-color)' }}></i>
            Produtiv.io
          </Link>
          
          {/* Botão X para fechar no mobile */}
          <button className="btn btn-link text-secondary d-md-none p-0" onClick={closeSidebar}>
            <i className="bi bi-x-lg" style={{ fontSize: '1.5rem' }}></i>
          </button>
        </div>

        {/* --- BLOCO DO PERFIL (Corrigido) --- */}
        {/* Agora é um Link clicável que leva para /profile */}
        <Link 
          to="/profile" 
          className="sidebar-user text-decoration-none" 
          onClick={closeSidebar} 
          title="Editar Perfil"
        >
          <div className="user-avatar-placeholder">
            {/* Mostra a inicial do Nome ou do Email */}
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="d-flex flex-column overflow-hidden">
            <span className="user-email text-white">
              {/* Prioriza o Nome de Exibição */}
              {user?.displayName || user?.email}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Configurações <i className="bi bi-gear-fill ms-1"></i>
            </span>
          </div>
        </Link>
        {/* --- FIM DO BLOCO DO PERFIL --- */}

        <ul className="nav flex-column sidebar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link" end onClick={closeSidebar}>
              <i className="bi bi-grid-1x2-fill"></i>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/tasks" className="nav-link d-flex justify-content-between align-items-center" onClick={closeSidebar}>
              <span>
                <i className="bi bi-check2-square"></i>
                Tarefas
              </span>
              {pendingCount > 0 && (
                <span className="badge rounded-pill">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/notes" className="nav-link" onClick={closeSidebar}>
              <i className="bi bi-journal-text"></i>
              Notas
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button 
            className="btn btn-danger w-100" 
            onClick={() => {
              closeSidebar();
              logout();
            }}
            disabled={isLoading}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            {isLoading ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;