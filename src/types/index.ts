// src/types/index.ts

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus; 
  completed?: boolean; // Mantido para compatibilidade
  priority: Priority;
  category?: string;
  userId: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  userId: string;
  createdAt: number;
}