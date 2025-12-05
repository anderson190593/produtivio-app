// src/pages/DashboardPage/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useTasks } from '../../hooks/useTasks'; // Importamos o hook para usar a função addTask
import './DashboardPage.css';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasks);
  const { addTask } = useTasks(); // Hook de ações

  // --- ESTADOS LOCAIS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quickTask, setQuickTask] = useState('');
  
  // Pomodoro State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos

  // --- EFEITOS (Relógio & Timer) ---
  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentDate(new Date()), 1000);
    
    let timerInterval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timerInterval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Aqui poderia tocar um som
    }

    return () => {
      clearInterval(clockInterval);
      clearInterval(timerInterval);
    };
  }, [timerActive, timeLeft]);

  // Formata o tempo do Pomodoro (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(25 * 60);
  };

  // Handler do Brain Dump
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    await addTask(quickTask, 'medium'); // Adiciona como média prioridade padrão
    setQuickTask('');
  };

  // --- Lógica de Dados ---
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  // Calculo simples de "Streak" (Tarefas feitas hoje)
  const tasksDoneToday = completedTasks.filter(t => {
    const today = new Date().setHours(0,0,0,0);
    const taskDate = new Date(t.createdAt).setHours(0,0,0,0); // Usando createdAt como base
    return taskDate === today; // Na vida real, usaríamos uma propriedade 'completedAt'
  }).length;

  return (
    <div className="dashboard-wrapper">
      
      {/* HEADER TURBINADO: Data e Hora */}
      <header className="dashboard-header mb-5 d-flex justify-content-between align-items-end flex-wrap gap-3">
        <div>
          <h1 className="display-5 fw-bold mb-1">
            Olá, <span className="text-accent">{userName}</span>.
          </h1>
          <p className="text-secondary lead mb-0">
            Sistemas operacionais. Produtividade em nível máximo.
          </p>
        </div>
        
        <div className="text-end time-widget">
          <div className="h1 fw-bold text-white mb-0" style={{ fontFamily: 'monospace', letterSpacing: '-2px' }}>
            {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="text-accent small text-uppercase fw-bold letter-spacing-2">
            {currentDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      {/* GRID PRINCIPAL (6 CARDS) */}
      <div className="dashboard-grid">

        {/* 1. PROGRESSO */}
        <div className="tech-card summary-card">
          <div className="card-icon">
            <i className="bi bi-bar-chart-line-fill"></i>
          </div>
          <h3>Progresso Diário</h3>
          <div className="progress-container mt-3">
            <div className="d-flex justify-content-between mb-2 text-small">
              <span className="text-light">{completedTasks.length}/{tasks.length} Missões</span>
              <span className="text-accent fw-bold">{progress}%</span>
            </div>
            <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${progress}%`, backgroundColor: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-glow)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. PRÓXIMO FOCO */}
        <div className="tech-card task-card">
          <div className="card-icon warning">
             <i className="bi bi-crosshair"></i>
          </div>
          <h3>Próximo Foco</h3>
          {nextTask ? (
            <div className="mt-3">
              <p className="text-white fw-bold text-truncate mb-1 fs-5">
                {nextTask.title}
              </p>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <span className={`badge ${nextTask.priority === 'high' ? 'bg-danger' : 'bg-secondary'} rounded-pill`}>
                  {nextTask.priority === 'high' ? 'Prioridade Alta' : 'Normal'}
                </span>
                <Link to="/tasks" className="text-secondary text-decoration-none small hover-white">
                  Ver Detalhes <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-secondary mt-3">
              <p>Sem pendências imediatas.</p>
            </div>
          )}
        </div>

        {/* 3. FOCUS TIMER (POMODORO) - NOVO */}
        <div className="tech-card timer-card">
          <div className="d-flex justify-content-between align-items-start">
            <div className="card-icon danger">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <span className={`badge ${timerActive ? 'bg-danger' : 'bg-dark'} text-white`}>
              {timerActive ? 'EM FOCO' : 'PAUSADO'}
            </span>
          </div>
          <h3>Modo Foco</h3>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="timer-display h2 mb-0 fw-bold text-white font-monospace">
              {formatTime(timeLeft)}
            </div>
            <div>
              <button onClick={toggleTimer} className="btn btn-icon-round me-2">
                <i className={`bi ${timerActive ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
              </button>
              <button onClick={resetTimer} className="btn btn-icon-round secondary">
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 4. BRAIN DUMP (CAPTURA RÁPIDA) - NOVO */}
        <div className="tech-card input-card">
          <div className="card-icon success">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <h3>Captura Rápida</h3>
          <form onSubmit={handleQuickAdd} className="mt-3 d-flex gap-2">
            <input 
              type="text" 
              className="form-control bg-dark border-secondary text-white" 
              placeholder="Ideia ou tarefa..."
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm px-3">
              <i className="bi bi-plus-lg"></i>
            </button>
          </form>
          <p className="text-secondary mt-2 mb-0" style={{fontSize: '0.75rem'}}>
            Vai direto para a lista de tarefas pendentes.
          </p>
        </div>

        {/* 5. METRICAS (STREAK) - NOVO */}
        <div className="tech-card metric-card">
          <div className="card-icon info">
            <i className="bi bi-trophy-fill"></i>
          </div>
          <h3>Produtividade Hoje</h3>
          <div className="d-flex align-items-end gap-2 mt-2">
            <span className="display-4 fw-bold text-white">{tasksDoneToday}</span>
            <span className="text-secondary mb-2">tarefas concluídas</span>
          </div>
          <div className="mt-2 text-success small">
            <i className="bi bi-graph-up-arrow me-1"></i>
            Continue o ritmo!
          </div>
        </div>

        {/* 6. STATUS DO SISTEMA */}
        <div className="tech-card system-card">
          <div className="card-icon">
            <i className="bi bi-hdd-network-fill"></i>
          </div>
          <h3>System Status</h3>
          <div className="mt-3 d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-secondary border-opacity-25">
              <span className="text-secondary small">Database</span>
              <span className="badge bg-success bg-opacity-25 text-success">ONLINE</span>
            </div>
            <div className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-secondary border-opacity-25">
              <span className="text-secondary small">Sync</span>
              <span className="badge bg-info bg-opacity-25 text-info">AUTO</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;