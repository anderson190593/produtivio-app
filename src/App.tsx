// src/App.tsx

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './firebase/config'; 
import { useAuthStore } from './store/useAuthStore'; 

import './App.css'; 

// Importar nossas páginas e layouts
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import TasksPage from './pages/TasksPage/TasksPage'; // 1. Importar a nova página de Tarefas
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout/AppLayout';
import NotesPage from './pages/NotesPage/NotesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  
  // Verificador de login (sem mudanças)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false); 
    });
    return () => unsubscribe();
  }, [setUser, setIsLoading]); 


  return (
    <div className="App">
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* === ROTAS PROTEGIDAS === */}
        <Route element={<ProtectedRoute />}>
          
          {/* O Esqueleto (AppLayout) contém o menu e o conteúdo */}
          <Route element={<AppLayout />}>
            
            {/* As páginas renderizadas DENTRO do AppLayout */}
            <Route path="/" element={<DashboardPage />} />
            
            {/* 2. Adicionamos a rota de Tarefas aqui */}
            <Route path="/tasks" element={<TasksPage />} />
            
            {/* <Route path="/notes" element={<NotesPage />} /> (Futuro) */}
            <Route path="/notes" element={<NotesPage />} />

            <Route path="/profile" element={<ProfilePage />} />
            
          </Route>
        </Route>
        
        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;