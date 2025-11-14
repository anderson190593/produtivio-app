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
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout/AppLayout'; // 1. Importar o nosso novo Layout

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
        {/* O usuário pode ver estas páginas sem estar logado */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* === ROTAS PROTEGIDAS === */}
        {/* 2. O "Segurança" (ProtectedRoute) envolve o "Esqueleto" (AppLayout) */}
        <Route element={<ProtectedRoute />}>
          
          {/* 3. O Esqueleto (AppLayout) agora "contém" todas as nossas páginas de app */}
          {/* O AppLayout mostra a Sidebar e o <Outlet/> */}
          <Route element={<AppLayout />}>
            
            {/* 4. Estas páginas serão renderizadas dentro do <Outlet/> do AppLayout */}
            <Route path="/" element={<DashboardPage />} />
            {/* <Route path="/tasks" element={<TasksPage />} /> */}
            {/* <Route path="/notes" element={<NotesPage />} /> */}
            
          </Route>
        </Route>
        
        {/* Rota 404 (qualquer outra coisa) */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;