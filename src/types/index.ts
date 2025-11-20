// src/types/index.ts

// Define a estrutura de uma Tarefa no nosso sistema
export interface Task {
  id: string;           // ID único do Firestore
  title: string;        // O texto da tarefa
  completed: boolean;   // Se está feita ou não
  userId: string;       // O ID do dono da tarefa (Segurança)
  createdAt: number;    // Data de criação (timestamp)
}