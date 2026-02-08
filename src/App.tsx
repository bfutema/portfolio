import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppProviders } from './providers';
import { Home } from './pages/Home';
import { App1 } from './pages/App1';
import { HomeView } from './pages/App1/views/HomeView';
import { HorasView } from './pages/App1/views/HorasView';
import { ClientesView } from './pages/App1/views/ClientesView';
import { ContasAPagarView } from './pages/App1/views/ContasAPagarView';
import { LembretesRecorrentesView } from './pages/App1/views/LembretesRecorrentesView';
import { ReceitasAvulsasView } from './pages/App1/views/ReceitasAvulsasView';
import { DespesasAvulsasView } from './pages/App1/views/DespesasAvulsasView';

function KeyboardShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyB') {
        e.preventDefault();
        navigate('/backoffice');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <KeyboardShortcut />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/backoffice" element={<App1 />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeView />} />
          <Route path="horas" element={<HorasView />} />
          <Route path="clientes" element={<ClientesView />} />
          <Route path="contas-a-pagar" element={<ContasAPagarView />} />
          <Route path="lembretes-recorrentes" element={<LembretesRecorrentesView />} />
          <Route path="receitas-avulsas" element={<ReceitasAvulsasView />} />
          <Route path="despesas-avulsas" element={<DespesasAvulsasView />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
