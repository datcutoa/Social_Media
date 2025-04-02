import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Chỉ import BrowserRouter ở đây
import App from './App';
import AdminApp from './AdminApp';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Kiểm tra đường dẫn để hiển thị App hoặc AdminApp
const isAdmin = window.location.pathname.startsWith("/admin");

root.render(
  <React.StrictMode>
    <BrowserRouter> 
      {isAdmin ? <AdminApp /> : <App />}
    </BrowserRouter>
  </React.StrictMode>
);
