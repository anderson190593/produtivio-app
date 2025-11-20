// src/pages/TasksPage/TasksPage.tsx

import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import './TasksPage.css';

const TasksPage = () => {
  // Pegamos todas as funções e estados do nosso hook customizado
  const { tasks, loadingTasks, fetchTasks, addTask, deleteTask, toggleTaskCompletion } = useTasks();
  
  // Estado local apenas para o input de "Nova Tarefa"
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Carrega as tarefas assim que a página abre
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Função chamada quando o usuário envia o formulário
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return; // Não adiciona tarefa vazia
    
    await addTask(newTaskTitle);
    setNewTaskTitle(''); // Limpa o campo após adicionar
  };

  return (
    <div className="tasks-page-wrapper">
      <div className="container">
        <header className="tasks-header mb-4">
          <h1 className="h2">Minhas Tarefas</h1>
          <p className="text-muted">Organize seu dia e aumente sua produtividade.</p>
        </header>

        {/* Formulário de Adicionar */}
        <div className="add-task-card card mb-4 shadow-sm">
          <div className="card-body">
            <form onSubmit={handleAddTask} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="O que precisa ser feito hoje?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-lg px-4" title="Adicionar Tarefa">
                <i className="bi bi-plus-lg"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="tasks-list-container">
          {loadingTasks ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Carregando tarefas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="bi bi-clipboard-check display-4 text-muted"></i>
              <h3 className="h5 mt-3 text-muted">Nenhuma tarefa pendente</h3>
              <p className="text-muted small">Adicione uma tarefa acima para começar.</p>
            </div>
          ) : (
            <ul className="list-group shadow-sm">
              {tasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`list-group-item d-flex align-items-center justify-content-between p-3 task-item ${task.completed ? 'task-completed' : ''}`}
                >
                  <div className="d-flex align-items-center gap-3 task-content">
                    {/* Checkbox customizado */}
                    <div className="form-check">
                      <input
                        className="form-check-input task-checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        id={`task-${task.id}`}
                      />
                    </div>
                    <label htmlFor={`task-${task.id}`} className="task-title mb-0">
                      {task.title}
                    </label>
                  </div>
                  
                  <button 
                    className="btn btn-outline-danger btn-sm btn-delete"
                    onClick={() => deleteTask(task.id)}
                    title="Excluir tarefa"
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