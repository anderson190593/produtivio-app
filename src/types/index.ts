// src/types/index.ts

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: number;
}

// --- ADICIONE ISSO ---
export interface Note {
  id: string;
  title: string;    // Título opcional ou assunto
  content: string;  // O corpo da nota
  isPinned: boolean; // Se está fixada no topo
  userId: string;
  createdAt: number;
}