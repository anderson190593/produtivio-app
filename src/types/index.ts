// src/types/index.ts

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  // Substituímos o boolean 'completed' por um status mais robusto
  status: TaskStatus; 
  // O campo 'completed' antigo pode ser mantido para compatibilidade ou removido. 
  // Vamos manter compatibilidade lógica transformando 'completed' em getter se necessário, 
  // mas por enquanto vamos usar 'status'.
  completed?: boolean; // Mantido opcional para não quebrar código antigo imediatamente
  
  priority: Priority; // Novo!
  category?: string;  // Novo! (Ex: 'Frontend', 'Marketing')
  
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