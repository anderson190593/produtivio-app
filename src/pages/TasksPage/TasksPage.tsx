// src/pages/TasksPage/TasksPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import type { Priority } from '../../types';
import './TasksPage.css';

// Tipo auxiliar para o filtro
type FilterType = 'all' | 'todo' | 'done';

const TasksPage = () => {
  // Conectando ao Hook de Tarefas
  const { tasks, loadingTasks, fetchTasks, addTask, deleteTask, updateTaskStatus } = useTasks();
  
  // Estados Locais da Página
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Garante dados frescos ao carregar a página
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- O CÉREBRO DA FILTRAGEM ---
  // useMemo garante que isso só rode quando tasks, filtro ou busca mudarem
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Filtro por Status (Abas)
      if (filterType === 'todo' && task.status === 'done') return false;
      if (filterType === 'done' && task.status !== 'done') return false;

      // 2. Filtro por Texto (Busca)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        // Verifica se o título contém o texto buscado
        return task.title.toLowerCase().includes(query);
      }

      return true;
    });
  }, [tasks, filterType, searchQuery]);

  // Handler para adicionar nova tarefa
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    // Feedback otimista já acontece no hook, então só limpamos o input
    await addTask(newTaskTitle, selectedPriority);
    setNewTaskTitle('');
    setSelectedPriority('medium'); // Volta para o padrão
  };

  // Helpers de UI
  const getPriorityBadge = (p: Priority) => {
    const labels = { high: 'ALTA', medium: 'MÉDIA', low: 'BAIXA' };
    const colors = { high: 'bg-danger', medium: 'bg-warning text-dark', low: 'bg-success' };
    return <span className={`badge ${colors[p]} me-2`} style={{fontSize: '0.6rem', padding: '4px 6px'}}>{labels[p]}</span>;
  };

  // Contadores inteligentes para as abas
  const countTodo = tasks.filter(t => t.status !== 'done').length;
  const countDone = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="tasks-page-wrapper">
      <div className="container-fluid px-0">
        
        {/* Cabeçalho */}
        <header className="tasks-header">
          <h1 className="h2">Gerenciador Tático</h1>
          <p className="text-secondary">Organize, priorize e execute com precisão cirúrgica.</p>
        </header>

        {/* --- TOOLBAR (O Painel de Controle) --- */}
        <div className="tasks-toolbar">
          {/* Busca */}
          <div className="search-input-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filtrar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Abas de Filtro */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Todas <span className="badge bg-secondary bg-opacity-25 text-white ms-1 rounded-pill">{tasks.length}</span>
            </button>
            <button 
              className={`filter-tab ${filterType === 'todo' ? 'active' : ''}`}
              onClick={() => setFilterType('todo')}
            >
              Pendentes <span className="badge bg-secondary bg-opacity-25 text-white ms-1 rounded-pill">{countTodo}</span>
            </button>
            <button 
              className={`filter-tab ${filterType === 'done' ? 'active' : ''}`}
              onClick={() => setFilterType('done')}
            >
              Concluídas <span className="badge bg-secondary bg-opacity-25 text-white ms-1 rounded-pill">{countDone}</span>
            </button>
          </div>
        </div>

        {/* --- CARD DE ADIÇÃO (Input Rápido) --- */}
        <div className="add-task-card">
          <form onSubmit={handleAddTask}>
            <div className="d-flex align-items-center w-100">
              <input
                type="text"
                placeholder="Qual é a próxima missão?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary-subtle">
              <div className="priority-selector d-flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`btn btn-sm priority-btn ${selectedPriority === p ? 'active ' + p : ''}`}
                    style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}
                  >
                    {p === 'high' ? '!!!' : p === 'medium' ? '!!' : '!'} {p}
                  </button>
                ))}
              </div>
              
              <button type="submit" className="btn btn-primary btn-sm px-4 rounded-3">
                 <i className="bi bi-plus-lg me-1"></i> Adicionar
              </button>
            </div>
          </form>
        </div>

        {/* --- LISTA DE TAREFAS --- */ }
        <div className="tasks-list-container">
          {loadingTasks && tasks.length === 0 ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : filteredTasks.length === 0 ? (
            // --- EMPTY STATES INTELIGENTES ---
            <div className="text-center py-5 opacity-50 user-select-none">
              <i className={`bi ${searchQuery ? 'bi-search' : (filterType === 'done' ? 'bi-clipboard-x' : 'bi-check2-circle')} display-1 text-secondary`}></i>
              <p className="mt-3 fs-5">
                {searchQuery 
                  ? `Nenhum resultado para "${searchQuery}"` 
                  : filterType === 'done' 
                    ? "Nenhuma tarefa concluída ainda." 
                    : filterType === 'todo' && tasks.length > 0 
                        ? "Tudo limpo! Nenhuma pendência."
                        : "Comece adicionando uma nova tarefa acima."}
              </p>
            </div>
          ) : (
            <div className="list-group gap-2">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item d-flex align-items-center p-3 ${task.status === 'done' ? 'task-completed' : ''}`}
                  style={{ borderLeft: `4px solid var(--bs-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'})` }}
                >
                  {/* Checkbox Interativo */}
                  <div 
                    className={`custom-check me-3 ${task.status === 'done' ? 'checked' : ''}`}
                    onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                    title={task.status === 'done' ? "Marcar como pendente" : "Concluir tarefa"}
                  >
                    {task.status === 'done' && <i className="bi bi-check-lg"></i>}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1 flex-wrap gap-2">
                      {getPriorityBadge(task.priority)}
                      <span className={`task-title fw-medium ${task.status === 'done' ? 'text-decoration-line-through text-secondary' : 'text-white'}`}>
                        {task.title}
                      </span>
                    </div>
                    <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-clock me-1"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <button 
                    className="btn-icon text-secondary"
                    onClick={() => deleteTask(task.id)}
                    title="Excluir tarefa"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;