import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppProviders } from './providers';
import { Home } from './pages/Home';
import { Apps } from './pages/Apps';
import { App1 } from './pages/App1';
import { HorasView } from './pages/App1/views/HorasView';
import { ClientesView } from './pages/App1/views/ClientesView';

function KeyboardShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'Digit1') {
        e.preventDefault();
        navigate('/app1');
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
        <Route path="/apps" element={<Apps />} />
        <Route path="/app1" element={<App1 />}>
          <Route index element={<Navigate to="horas" replace />} />
          <Route path="horas" element={<HorasView />} />
          <Route path="clientes" element={<ClientesView />} />
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
