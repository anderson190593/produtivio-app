// src/hooks/useTasks.ts

import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';
// CORREÇÃO 1: Adicionado 'type' para satisfazer o TypeScript
import type { Task } from '../types'; 

// CORREÇÃO 2: Movido para fora do hook para evitar o loop/aviso do ESLint
const tasksCollectionRef = collection(db, 'tasks');

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // 1. BUSCAR TAREFAS (READ)
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setLoadingTasks(true);
    try {
      const q = query(tasksCollectionRef, where("userId", "==", user.uid));
      const data = await getDocs(q);
      
      const formattedTasks = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Task[];

      // Ordenação manual por data (as mais novas primeiro)
      formattedTasks.sort((a, b) => b.createdAt - a.createdAt);

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoadingTasks(false);
    }
  }, [user]); // Agora o array de dependências está correto e estável

  // 2. ADICIONAR TAREFA (CREATE)
  const addTask = async (title: string) => {
    if (!user || !title.trim()) return;

    try {
      const newTask = {
        title: title,
        completed: false,
        userId: user.uid,
        createdAt: Date.now(),
      };

      await addDoc(tasksCollectionRef, newTask);
      await fetchTasks(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  // 3. DELETAR TAREFA (DELETE)
  const deleteTask = async (id: string) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // 4. MARCAR COMO FEITA (UPDATE)
  const toggleTaskCompletion = async (id: string, currentStatus: boolean) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { completed: !currentStatus });
      
      setTasks((prev) => 
        prev.map((task) => 
          task.id === id ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  return { 
    tasks, 
    loadingTasks, 
    fetchTasks, 
    addTask, 
    deleteTask, 
    toggleTaskCompletion 
  };
};