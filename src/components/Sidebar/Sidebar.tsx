// src/components/Sidebar/Sidebar.tsx

import { useEffect } from 'react'; // Adicionado useEffect
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { useTasks } from '../../hooks/useTasks'; // Importamos o hook de tarefas
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  // 1. Pegamos as tarefas e a função de buscar do nosso hook
  const { tasks, fetchTasks } = useTasks();

  // 2. Assim que a Sidebar (o app) carregar, buscamos os dados!
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">Produtiv.io</Link>
      </div>

      <div className="sidebar-user">
        <span className="user-email">
          {user ? user.email : 'Carregando...'}
        </span>
      </div>

      <ul className="nav flex-column sidebar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            <i className="bi bi-grid-1x2-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/tasks" className="nav-link d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-check2-square me-2"></i>
              Tarefas
            </span>
            {/* 3. Mostramos o contador (Badge) */}
            {tasks.length > 0 && (
              <span className="badge bg-primary rounded-pill">{tasks.length}</span>
            )}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/notes" className="nav-link">
            <i className="bi bi-journal-text me-2"></i>
            Notas
          </NavLink>
        </li>
      </ul>

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