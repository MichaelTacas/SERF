import { useState } from 'react';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientesPage } from './pages/ClientesPage';
import { FilialesPage } from './pages/FilialesPage';
import { ProductosPage } from './pages/ProductosPage';
import { VentasPage } from './pages/VentasPage';
import { ReportesPage } from './pages/ReportesPage';
import { UsuariosPage } from './pages/UsuariosPage';

import { AppHeader } from './components/AppHeader';

import { authService } from './services/authService';

type Vista =
    | 'dashboard'
    | 'clientes'
    | 'filiales'
    | 'productos'
    | 'ventas'
    | 'reportes'
    | 'usuarios';

function App() {

    const [autenticado, setAutenticado] = useState(
        authService.estaAutenticado()
    );

    const [vista, setVista] =
        useState<Vista>('dashboard');

    const manejarLoginExitoso = () => {
        setAutenticado(true);
        setVista('dashboard');
    };

    const manejarCerrarSesion = () => {
        authService.cerrarSesion();
        setAutenticado(false);
        setVista('dashboard');
    };

    if (!autenticado) {
        return (
            <LoginPage
                onLoginExitoso={manejarLoginExitoso}
            />
        );
    }

    const renderizarVista = () => {

        switch (vista) {

            case 'clientes':
                return <ClientesPage />;

            case 'filiales':
                return <FilialesPage />;

            case 'productos':
                return <ProductosPage />;

            case 'ventas':
                return <VentasPage />;

            case 'reportes':
                return <ReportesPage />;

            case 'usuarios':
                return <UsuariosPage />;

            default:
                return (
                    <DashboardPage
                        onNavigate={setVista}
                    />
                );
        }
    };

    return (
        <>

            <AppHeader
                onCerrarSesion={manejarCerrarSesion}
            />

            {vista !== 'dashboard' && (

                <div
                    style={{
                        padding: '20px 40px 0'
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            setVista('dashboard')
                        }
                    >
                        ← Volver al panel principal
                    </button>

                </div>

            )}

            {renderizarVista()}

        </>
    );
}

export default App;