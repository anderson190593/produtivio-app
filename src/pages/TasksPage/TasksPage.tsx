// src/pages/TasksPage/TasksPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import type { Priority } from '../../types';
import './TasksPage.css';

type FilterType = 'all' | 'todo' | 'done';

const TasksPage = () => {
  const { tasks, loadingTasks, fetchTasks, addTask, deleteTask, updateTaskStatus } = useTasks();
  
  // Estados Locais
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Atualiza dados ao entrar
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- LÓGICA DE FILTRAGEM (O Coração da Página) ---
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Filtro por Status (Abas)
      if (filterType === 'todo' && task.status === 'done') return false;
      if (filterType === 'done' && task.status !== 'done') return false;

      // 2. Filtro por Texto (Busca)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return task.title.toLowerCase().includes(query);
      }

      return true;
    });
  }, [tasks, filterType, searchQuery]);

  // Adicionar Tarefa
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, selectedPriority);
    setNewTaskTitle('');
    setSelectedPriority('medium');
  };

  // Helpers Visuais
  const getPriorityBadge = (p: Priority) => {
    const labels = { high: 'ALTA', medium: 'MÉDIA', low: 'BAIXA' };
    const colors = { high: 'bg-danger', medium: 'bg-warning text-dark', low: 'bg-success' };
    return <span className={`badge ${colors[p]} me-2`} style={{fontSize: '0.6rem'}}>{labels[p]}</span>;
  };

  // Contadores para as abas
  const countTodo = tasks.filter(t => t.status !== 'done').length;
  const countDone = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="tasks-page-wrapper">
      <div className="container-fluid px-0">
        
        {/* Cabeçalho */}
        <header className="tasks-header">
          <h1 className="h2">Gerenciador de Tarefas</h1>
          <p className="text-secondary">Organize, priorize e execute com precisão.</p>
        </header>

        {/* --- TOOLBAR (Busca e Filtros) --- */}
        <div className="tasks-toolbar">
          {/* Busca */}
          <div className="search-input-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar tarefa..."
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
              Todas <span className="ms-1 opacity-50">{tasks.length}</span>
            </button>
            <button 
              className={`filter-tab ${filterType === 'todo' ? 'active' : ''}`}
              onClick={() => setFilterType('todo')}
            >
              Pendentes <span className="ms-1 opacity-50">{countTodo}</span>
            </button>
            <button 
              className={`filter-tab ${filterType === 'done' ? 'active' : ''}`}
              onClick={() => setFilterType('done')}
            >
              Concluídas <span className="ms-1 opacity-50">{countDone}</span>
            </button>
          </div>
        </div>

        {/* --- CARD DE ADIÇÃO (Input) --- */}
        <div className="add-task-card">
          <form onSubmit={handleAddTask}>
            <div className="d-flex align-items-center w-100">
              <input
                type="text"
                className="form-control flex-grow-1 bg-transparent border-0 text-white shadow-none ps-2"
                placeholder="O que precisa ser feito?"
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
              
              <button type="submit" className="btn btn-primary btn-sm px-4 rounded-pill">
                 Adicionar <i className="bi bi-plus-lg ms-1"></i>
              </button>
            </div>
          </form>
        </div>

        {/* --- LISTA DE TAREFAS --- */}
        <div className="tasks-list-container">
          {loadingTasks && tasks.length === 0 ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : filteredTasks.length === 0 ? (
            // EMPTY STATE INTELIGENTE
            <div className="text-center py-5 opacity-50">
              <i className={`bi ${searchQuery ? 'bi-search' : 'bi-clipboard-check'} display-1 text-secondary`}></i>
              <p className="mt-3 fs-5">
                {searchQuery 
                  ? `Nenhuma tarefa encontrada para "${searchQuery}"` 
                  : filterType === 'done' 
                    ? "Nenhuma tarefa concluída ainda." 
                    : "Nenhuma tarefa pendente. Bom trabalho!"}
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
                  {/* Checkbox */}
                  <div 
                    className={`custom-check me-3 ${task.status === 'done' ? 'checked' : ''}`}
                    onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
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
                      {new Date(task.createdAt).toLocaleDateString()} às {new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </small>
                  </div>

                  <button 
                    className="btn btn-icon text-secondary"
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