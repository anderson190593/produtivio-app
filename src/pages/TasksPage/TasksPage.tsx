// src/pages/TasksPage/TasksPage.tsx

import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import type { Priority } from '../../types';
import './TasksPage.css';

const TasksPage = () => {
  const { tasks, loadingTasks, fetchTasks, addTask, deleteTask, updateTaskStatus } = useTasks();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  // Ao entrar, garante que os dados estão atualizados (importante para ordenação)
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, selectedPriority);
    setNewTaskTitle('');
    setSelectedPriority('medium'); // Reseta
  };

  // Helper para cor da prioridade
  const getPriorityColor = (p: Priority) => {
    if (p === 'high') return 'text-danger border-danger';
    if (p === 'medium') return 'text-warning border-warning';
    return 'text-success border-success'; // Low
  };

  const getPriorityBadge = (p: Priority) => {
    const labels = { high: 'ALTA', medium: 'MÉDIA', low: 'BAIXA' };
    const colors = { high: 'bg-danger', medium: 'bg-warning text-dark', low: 'bg-success' };
    return <span className={`badge ${colors[p]} me-2`} style={{fontSize: '0.6rem'}}>{labels[p]}</span>;
  };

  return (
    <div className="tasks-page-wrapper">
      <div className="container-fluid px-0">
        
        <header className="tasks-header mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h1 className="h2">Centro de Comando</h1>
            <p className="text-secondary mb-0">Gerencie missões e prioridades.</p>
          </div>
          <div className="text-end text-secondary small">
            {tasks.filter(t => t.status === 'todo').length} Pendentes
          </div>
        </header>

        {/* Input Card 2.0 */}
        <div className="add-task-card mb-4">
          <form onSubmit={handleAddTask}>
            <div className="d-flex align-items-center w-100">
              <input
                type="text"
                className="form-control flex-grow-1"
                placeholder="Nova missão..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            
            {/* Barra de Ferramentas do Input */}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary-subtle">
              <div className="priority-selector d-flex gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`btn btn-sm btn-outline-secondary priority-btn ${selectedPriority === p ? 'active ' + getPriorityColor(p) : ''}`}
                    style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}
                  >
                    {p === 'high' ? '!!!' : p === 'medium' ? '!!' : '!'} {p}
                  </button>
                ))}
              </div>
              
              <button type="submit" className="btn btn-primary btn-sm px-4">
                 <i className="bi bi-plus-lg ms-1"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Tarefas 2.0 */}
        <div className="tasks-list-container">
          {loadingTasks && tasks.length === 0 ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5 opacity-50">
              <i className="bi bi-check-circle display-1 text-secondary"></i>
              <p className="mt-3">Tudo limpo, comandante.</p>
            </div>
          ) : (
            <div className="list-group gap-2">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item d-flex align-items-center p-3 ${task.status === 'done' ? 'task-completed' : ''}`}
                  style={{ borderLeft: `4px solid var(--bs-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'})` }}
                >
                  {/* Checkbox Customizado */}
                  <div 
                    className={`custom-check me-3 ${task.status === 'done' ? 'checked' : ''}`}
                    onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                  >
                    {task.status === 'done' && <i className="bi bi-check-lg"></i>}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      {getPriorityBadge(task.priority)}
                      <span className={`task-title ${task.status === 'done' ? 'text-decoration-line-through text-secondary' : 'text-white'}`}>
                        {task.title}
                      </span>
                    </div>
                    <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-clock me-1"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <button 
                    className="btn btn-icon text-danger opacity-50 hover-opacity-100"
                    onClick={() => deleteTask(task.id)}
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