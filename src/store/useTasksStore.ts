// src/store/useTasksStore.ts
import { create } from 'zustand';
import type { Task } from '../types';

interface TasksState {
  tasks: Task[];
  isLoadingTasks: boolean; // Novo estado global
  setTasks: (tasks: Task[]) => void;
  setIsLoadingTasks: (loading: boolean) => void; // Nova ação
  addTaskToStore: (task: Task) => void; // Otimização visual
  removeTaskFromStore: (id: string) => void;
  toggleTaskInStore: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoadingTasks: false,
  
  setTasks: (tasks) => set({ tasks }),
  setIsLoadingTasks: (loading) => set({ isLoadingTasks: loading }),
  
  // Atualizações otimistas (atualiza a tela antes do banco responder)
  addTaskToStore: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  removeTaskFromStore: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  toggleTaskInStore: (id) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
}));