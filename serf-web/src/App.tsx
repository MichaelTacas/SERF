import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import SolicitudesPage from './pages/SolicitudesPage';
import { AppHeader } from './components/AppHeader';
import { authService } from './services/authService';

function App() {

  const [autenticado, setAutenticado] = useState(
      authService.estaAutenticado()
  );

  const manejarLoginExitoso = () => {
    setAutenticado(true);
  };

  const manejarCerrarSesion = () => {
    authService.cerrarSesion();
    setAutenticado(false);
  };

  if (!autenticado) {
    return (
        <LoginPage
            onLoginExitoso={manejarLoginExitoso}
        />
    );
  }

  return (
      <>
        <AppHeader
            onCerrarSesion={manejarCerrarSesion}
        />

        <SolicitudesPage />
      </>
  );
}

export default App;