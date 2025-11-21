// src/hooks/useTasks.ts

import { useCallback } from "react"; // Removemos useState
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
import { useTasksStore } from "../store/useTasksStore"; // Importar o Store
import type { Task } from "../types";

const tasksCollectionRef = collection(db, "tasks");

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);

  // Usamos o estado GLOBAL agora
  const tasks = useTasksStore((state) => state.tasks);
  const loadingTasks = useTasksStore((state) => state.isLoadingTasks);
  const {
    setTasks,
    setIsLoadingTasks,
    addTaskToStore,
    removeTaskFromStore,
    toggleTaskInStore,
  } = useTasksStore();

  // 1. BUSCAR TAREFAS
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    // Se já temos tarefas carregadas, talvez não precisemos mostrar loading (opcional)
    setIsLoadingTasks(true);

    try {
      const q = query(tasksCollectionRef, where("userId", "==", user.uid));
      const data = await getDocs(q);

      const formattedTasks = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Task[];

      formattedTasks.sort((a, b) => b.createdAt - a.createdAt);

      setTasks(formattedTasks); // Salva no global!
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [user, setTasks, setIsLoadingTasks]);

  // 2. ADICIONAR TAREFA
  const addTask = async (title: string) => {
    if (!user || !title.trim()) return;

    const tempListId = Date.now().toString(); // ID temporário para UI otimista
    const newTaskObj: Task = {
      id: tempListId,
      title: title,
      completed: false,
      userId: user.uid,
      createdAt: Date.now(),
    };

    // UI Otimista: Adiciona na tela IMEDIATAMENTE
    addTaskToStore(newTaskObj);

    try {
      // Remove o ID pois o Firebase cria um
      // 1. Criamos um objeto limpo só com os dados para o Banco (sem o ID temporário)
      const docData = {
        title: newTaskObj.title,
        completed: newTaskObj.completed,
        userId: newTaskObj.userId,
        createdAt: newTaskObj.createdAt,
      };

      // 2. Enviamos para o Firebase
      await addDoc(tasksCollectionRef, docData);

      // Em um cenário real perfeito, atualizaríamos o ID temporário pelo real aqui,
      // mas por enquanto vamos apenas fazer o fetch silencioso para garantir consistência
      fetchTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      // Se der erro, deveríamos remover a tarefa da tela (revert)
      fetchTasks();
    }
  };

  // 3. DELETAR
  const deleteTask = async (id: string) => {
    removeTaskFromStore(id); // UI Otimista (remove na hora)
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      fetchTasks(); // Revert em caso de erro
    }
  };

  // 4. MARCAR COMO FEITA
  const toggleTaskCompletion = async (id: string, currentStatus: boolean) => {
    toggleTaskInStore(id); // UI Otimista
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { completed: !currentStatus });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      fetchTasks(); // Revert
    }
  };

  return {
    tasks,
    loadingTasks,
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
