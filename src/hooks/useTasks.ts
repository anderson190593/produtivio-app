// src/hooks/useTasks.ts

import { useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../store/useAuthStore";
import { useTasksStore } from "../store/useTasksStore";
import type { Task, Priority, TaskStatus } from "../types"; // Importar novos tipos

const tasksCollectionRef = collection(db, "tasks");

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);
  const {
    tasks,
    isLoadingTasks,
    setTasks,
    setIsLoadingTasks,
    addTaskToStore,
    removeTaskFromStore,
    toggleTaskInStore, // Esse precisaremos ajustar ou criar um updateTaskStatusInStore
  } = useTasksStore(); // Assumindo que você expôs o state e as actions assim

  // 1. BUSCAR (Leitura adaptada para garantir que tarefas antigas tenham campos novos)
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoadingTasks(true);
    try {
      const q = query(tasksCollectionRef, where("userId", "==", user.uid));
      const data = await getDocs(q);

      const formattedTasks = data.docs.map((doc) => {
        const d = doc.data();
        // Migração em tempo real: se não tiver prioridade, define como 'medium'
        return {
          ...d,
          id: doc.id,
          status: d.status || (d.completed ? 'done' : 'todo'),
          priority: d.priority || 'medium'
        };
      }) as Task[];

      // Ordena por Prioridade (High primeiro) e depois por Data
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      formattedTasks.sort((a, b) => {
        const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (pDiff !== 0) return pDiff;
        return b.createdAt - a.createdAt;
      });

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [user, setTasks, setIsLoadingTasks]);

  // 2. ADICIONAR (Agora aceita Prioridade)
  const addTask = async (title: string, priority: Priority = 'medium') => {
    if (!user || !title.trim()) return;

    const tempListId = Date.now().toString();
    
    const newTaskObj: Task = {
      id: tempListId,
      title: title,
      status: 'todo', // Padrão
      completed: false, // Mantém compatibilidade
      priority: priority,
      userId: user.uid,
      createdAt: Date.now(),
    };

    addTaskToStore(newTaskObj);

    try {
      // Cria o objeto para o Firestore sem o ID
      const { id, ...docData } = newTaskObj;
      await addDoc(tasksCollectionRef, docData);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      fetchTasks();
    }
  };

  // 3. DELETAR
  const deleteTask = async (id: string) => {
    removeTaskFromStore(id);
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
      fetchTasks();
    }
  };

  // 4. ALTERAR STATUS (Novo método mais poderoso que o toggle)
  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    // Atualize o store localmente aqui se tiver a action específica, 
    // ou use o toggleTaskInStore de forma adaptada se for apenas visual
    // Por simplicidade, vamos confiar no fetchTasks no catch ou sucesso
    
    // Atualização Otimista manual no array local (opcional, mas recomendada)
    // ...

    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { 
        status: newStatus,
        completed: newStatus === 'done' 
      });
      fetchTasks(); // Recarrega para reordenar se necessário
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return {
    tasks,
    loadingTasks,
    fetchTasks,
    addTask,
    deleteTask,
    updateTaskStatus, // Exportamos a nova função
  };
};