// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom'; // 1. Importar 'Navigate'
import './App.css'; 

// Importar nossas páginas
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage'; // 2. Importar a nova página

function App() {
  
  return (
    <div className="App">
      <Routes>
        {/* Rota 1: A página de Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rota 2: A página de Cadastro */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Rota 3: A Rota Principal (/) */}
        {/* Se o usuário visitar a raiz do site, redireciona para /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Adicionaremos mais rotas aqui (Dashboard) depois */}

      </Routes>
    </div>
  );
}

export default App;