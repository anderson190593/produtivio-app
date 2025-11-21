// src/store/useTasksStore.ts
import { create } from 'zustand';
import type { Task } from '../types';

interface TasksState {
  tasks: Task[]; // A lista de tarefas global
  setTasks: (tasks: Task[]) => void; // Ação para atualizar a lista
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [], // Começa vazia
  setTasks: (tasks) => set({ tasks }), // Atualiza o estado
}));