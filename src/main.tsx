// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importar o Roteador

// Importar nossos estilos globais
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Para dropdowns e modais futuros
import './index.css'; // Estilos globais do Vite

import App from './App'; // Nosso componente principal

// O '!' (non-null assertion) é padrão do TS aqui, diz que 'root' não é nulo.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolver (wrap) o <App /> com o <BrowserRouter> */}
    {/* Isso "ativa" o poder de navegação em todo o nosso app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);