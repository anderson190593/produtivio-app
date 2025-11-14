// src/components/AppLayout/AppLayout.tsx

import { Outlet } from 'react-router-dom'; // O "portal" para nossas páginas
import Sidebar from '../Sidebar/Sidebar'; // A sidebar que criamos
import './AppLayout.css'; // Os estilos do layout

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* Coluna da Esquerda: O Menu */}
      <Sidebar />

      {/* Coluna da Direita: O Conteúdo da Página (Dashboard, Tarefas, etc.) */}
      <main className="app-main-content">
        <Outlet /> {/* O React Router vai injetar a página correta aqui */}
      </main>
    </div>
  );
};

export default AppLayout;