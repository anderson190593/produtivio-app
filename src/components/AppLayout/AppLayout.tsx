// src/components/AppLayout/AppLayout.tsx

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useTasks } from '../../hooks/useTasks';
import { useNotes } from '../../hooks/useNotes';
import { useUIStore } from '../../store/useUIStore'; // Importar o store
import './AppLayout.css';

const AppLayout = () => {
  const { fetchTasks } = useTasks();
  const { fetchNotes } = useNotes();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar); // Ação de abrir

  useEffect(() => {
    const syncData = async () => {
      await Promise.all([fetchTasks(), fetchNotes()]);
    };
    syncData();
  }, [fetchTasks, fetchNotes]);

  return (
    <div className="app-layout">
      <Sidebar />
      
      <main className="app-main-content">
        {/* Header Mobile (Só aparece em telas pequenas) */}
        <header className="mobile-header d-md-none mb-4">
          <button 
            className="btn btn-icon text-white p-0" 
            onClick={toggleSidebar}
            aria-label="Abrir menu"
          >
            <i className="bi bi-list" style={{ fontSize: '2rem' }}></i>
          </button>
          <span className="h5 mb-0 fw-bold ms-3">Produtiv.io</span>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;