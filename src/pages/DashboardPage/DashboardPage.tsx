// src/pages/DashboardPage/DashboardPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTasksStore } from '../../store/useTasksStore';
import './DashboardPage.css';

const DashboardPage = () => {
  // Conectando aos "cérebros" globais
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasks);

  // --- Lógica Local: Saudação ---
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bom dia');
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  // --- Lógica Local: Estatísticas ---
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  // Calcula porcentagem (evita divisão por zero)
  const progress = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // Pega a primeira tarefa pendente (assumindo que estão ordenadas por criação)
  const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null;

  // Tenta pegar o nome do usuário ou usa o início do e-mail
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="dashboard-wrapper">
      
      {/* Cabeçalho com Saudação Tech */}
      <header className="dashboard-header mb-5">
        <h1 className="display-5 fw-bold">
          {greeting}, <span className="text-accent">{userName}</span>.
        </h1>
        <p className="text-secondary lead">
          Sistemas operacionais. Aqui está o resumo do seu foco hoje.
        </p>
      </header>

      {/* Grid de Widgets */}
      <div className="dashboard-grid">

        {/* Widget 1: Progresso Diário */}
        <div className="tech-card summary-card">
          <div className="card-icon">
            <i className="bi bi-bar-chart-line-fill"></i>
          </div>
          <h3>Progresso Diário</h3>
          
          <div className="progress-container mt-3">
            <div className="d-flex justify-content-between mb-2 text-small">
              <span className="text-light">{completedTasks.length}/{tasks.length} Tarefas</span>
              <span className="text-accent fw-bold">{progress}%</span>
            </div>
            {/* Barra de progresso customizada */}
            <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${progress}%`, backgroundColor: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-glow)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Widget 2: Próximo Foco */}
        <div className="tech-card task-card">
          <div className="card-icon warning">
             <i className="bi bi-bullseye"></i>
          </div>
          <h3>Próximo Foco</h3>
          
          {nextTask ? (
            <div className="next-task-content mt-3">
              <p className="task-title text-white fw-bold text-truncate mb-1" style={{ fontSize: '1.2rem' }}>
                {nextTask.title}
              </p>
              <p className="text-secondary small mb-3">
                Pendente desde {new Date(nextTask.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <Link to="/tasks" className="btn btn-sm btn-outline-light w-100">
                Concluir Agora <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          ) : (
            <div className="text-secondary mt-3">
              <p>Nenhuma pendência imediata.</p>
              <Link to="/tasks" className="btn btn-sm btn-primary w-100">
                <i className="bi bi-plus-lg me-1"></i> Nova Tarefa
              </Link>
            </div>
          )}
        </div>

        {/* Widget 3: Status do Sistema (Decorativo/Futuro) */}
        <div className="tech-card info-card">
          <div className="card-icon info">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <h3>Status do Sistema</h3>
          <div className="mt-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="status-dot online"></span>
              <span className="text-secondary small">Firebase: <span className="text-light">Conectado</span></span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="status-dot online"></span>
              <span className="text-secondary small">Sincronização: <span className="text-light">Ativa</span></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;