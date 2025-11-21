// src/components/AppLayout/AppLayout.tsx

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useTasks } from '../../hooks/useTasks'; // Importa o hook de tarefas
import { useNotes } from '../../hooks/useNotes'; // Importa o hook de notas
import './AppLayout.css';

const AppLayout = () => {
  // Pegamos as funções de busca (Fetch)
  const { fetchTasks } = useTasks();
  const { fetchNotes } = useNotes();

  // useEffect para carregar tudo assim que o Layout montar (Login realizado)
  useEffect(() => {
    const syncData = async () => {
      // Dispara as buscas em paralelo para ser mais rápido
      await Promise.all([
        fetchTasks(),
        fetchNotes()
      ]);
    };

    syncData();
  }, [fetchTasks, fetchNotes]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;