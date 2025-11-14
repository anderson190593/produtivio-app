// src/pages/DashboardPage/DashboardPage.tsx

import './DashboardPage.css'; // Importa os estilos

const DashboardPage = () => {
  
  // REMOVEMOS:
  // - useAuth()
  // - useAuthStore()
  // - handleLogout()
  // - isLoading

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <h1 className="display-4">Bem-vindo ao Produtiv.io</h1>
        <p className="lead">Sua página principal de produtividade.</p>
        <hr className="my-4" />
        
        {/* REMOVEMOS: O botão de "Sair" */}
        
        <p>Este é o seu painel. Em breve, você verá suas tarefas e notas aqui.</p>
      </div>
    </div>
  );
};

export default DashboardPage;