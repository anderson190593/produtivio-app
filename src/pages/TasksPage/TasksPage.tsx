// src/pages/TasksPage/TasksPage.tsx

import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks'; // O hook já está conectado ao Store global!
import './TasksPage.css';

const TasksPage = () => {
  const { tasks, loadingTasks, fetchTasks, addTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Busca inicial
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <div className="tasks-page-wrapper">
      <div className="container-fluid px-0"> {/* px-0 para alinhar com o layout */}
        
        <header className="tasks-header mb-4">
          <h1 className="h2">Log de Tarefas</h1>
          <p className="text-secondary">Gerencie suas prioridades e execute com precisão.</p>
        </header>

        {/* Input Estilizado */}
        <div className="add-task-card mb-4">
          <form onSubmit={handleAddTask} className="d-flex align-items-center w-100">
            <input
              type="text"
              className="form-control flex-grow-1"
              placeholder="Digite o próximo comando..." // Texto mais tech
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary shadow-none">
              <i className="bi bi-plus"></i>
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="tasks-list-container">
          {loadingTasks && tasks.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-secondary">Sincronizando dados...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5 opacity-50">
              <i className="bi bi-terminal display-1 text-secondary"></i>
              <h3 className="h5 mt-3 text-secondary">Sistema ocioso</h3>
              <p className="text-secondary small">Nenhuma tarefa ativa no momento.</p>
            </div>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`list-group-item d-flex align-items-center justify-content-between task-item ${task.completed ? 'task-completed' : ''}`}
                >
                  <div className="d-flex align-items-center gap-3 task-content flex-grow-1" onClick={() => toggleTaskCompletion(task.id, task.completed)}>
                    {/* Checkbox */}
                    <div className="form-check m-0">
                      <input
                        className="form-check-input task-checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}} // O clique é tratado na div pai para facilitar
                        id={`task-${task.id}`}
                      />
                    </div>
                    
                    <div className="d-flex flex-column">
                        <label htmlFor={`task-${task.id}`} className="task-title mb-0 pointer">
                        {task.title}
                        </label>
                        <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                            {new Date(task.createdAt).toLocaleDateString()} • {new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-delete btn-sm ms-2"
                    onClick={(e) => {
                        e.stopPropagation(); // Impede que clique no botão marque a tarefa
                        deleteTask(task.id);
                    }}
                    title="Remover do sistema"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;