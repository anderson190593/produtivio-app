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
import type { Task, Priority, TaskStatus } from "../types";

const tasksCollectionRef = collection(db, "tasks");

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);
  
  // CORREÇÃO 1: Usamos o nome correto do Store (isLoadingTasks)
  const {
    tasks,
    isLoadingTasks, 
    setTasks,
    setIsLoadingTasks,
    addTaskToStore,
    removeTaskFromStore,
  } = useTasksStore();

  // 1. BUSCAR
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoadingTasks(true);
    try {
      const q = query(tasksCollectionRef, where("userId", "==", user.uid));
      const data = await getDocs(q);

      const formattedTasks = data.docs.map((doc) => {
        const d = doc.data();
        return {
          ...d,
          id: doc.id,
          // Garante compatibilidade
          status: d.status || (d.completed ? 'done' : 'todo'),
          priority: d.priority || 'medium'
        };
      }) as Task[];

      // Ordenação: Alta > Média > Baixa, depois Data
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

  // 2. ADICIONAR
  const addTask = async (title: string, priority: Priority = 'medium') => {
    if (!user || !title.trim()) return;

    const tempListId = Date.now().toString();
    
    const newTaskObj: Task = {
      id: tempListId,
      title: title,
      status: 'todo',
      completed: false,
      priority: priority,
      userId: user.uid,
      createdAt: Date.now(),
    };

    addTaskToStore(newTaskObj);

    try {
      // CORREÇÃO 2: Criamos o objeto manualmente para evitar o erro do 'id'
      const docData = {
        title: newTaskObj.title,
        status: newTaskObj.status,
        completed: newTaskObj.completed,
        priority: newTaskObj.priority,
        userId: newTaskObj.userId,
        createdAt: newTaskObj.createdAt
      };

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

  // 4. ALTERAR STATUS
  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { 
        status: newStatus,
        completed: newStatus === 'done' 
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return {
    tasks,
    loadingTasks: isLoadingTasks, // CORREÇÃO 3: Apelidamos para o nome que o componente espera
    fetchTasks,
    addTask,
    deleteTask,
    updateTaskStatus,
  };
};