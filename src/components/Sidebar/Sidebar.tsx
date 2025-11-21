// src/components/Sidebar/Sidebar.tsx

//import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { useTasksStore } from '../../store/useTasksStore'; // Importando do Store global
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  
  // Usamos o Store diretamente para pegar o número de tarefas em tempo real
  const tasks = useTasksStore((state) => state.tasks);

  // Se quisermos buscar tarefas ao carregar o app (opcional aqui se já feito no Dashboard)
  // const { fetchTasks } = useTasks();
  // useEffect(() => { if (user) fetchTasks(); }, [user, fetchTasks]);

  // Filtra tarefas pendentes para o contador (Badge)
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          <i className="bi bi-terminal-fill" style={{ color: 'var(--accent-color)' }}></i>
          Produtiv.io
        </Link>
      </div>

      <div className="sidebar-user">
        {/* Avatar Placeholder (Círculo com a inicial) */}
        <div className="user-avatar-placeholder">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="d-flex flex-column overflow-hidden">
          <span className="user-email" title={user?.email || ''}>
            {user ? user.email : 'Carregando...'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Plano Free
          </span>
        </div>
      </div>

      <ul className="nav flex-column sidebar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/tasks" className="nav-link d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-check2-square"></i>
              Tarefas  {/* <--- CORRIGIDO AQUI: De "Os" para "Tarefas" */}
            </span>
            
            {/* Badge só aparece se houver tarefas pendentes */}
            {pendingCount > 0 && (
              <span className="badge rounded-pill">
                {pendingCount}
              </span>
            )}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/notes" className="nav-link">
            <i className="bi bi-journal-text"></i>
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