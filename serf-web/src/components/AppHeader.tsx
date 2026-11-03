import { authService } from '../services/authService';
import '../styles/AppHeader.css';

interface AppHeaderProps {
    onCerrarSesion: () => void;
}

export function AppHeader({
                              onCerrarSesion,
                          }: AppHeaderProps) {

    const usuario = authService.obtenerUsuario();

    const nombreRol =
        usuario?.rol === 'ADMINISTRADOR'
            ? 'Administrador'
            : usuario?.rol === 'VENDEDOR'
                ? 'Vendedor'
                : 'Sin rol';

    return (
        <header className="app-header">

            <div className="app-header-brand">

                <h1>SERF</h1>

                <p>
                    Sistema Empresarial de Gestión de Reportes Financieros
                </p>

            </div>

            <div className="app-header-user">

                <div className="app-user-info">

          <span className="app-user-email">
            {usuario?.email ?? 'Usuario'}
          </span>

                    <span className="app-user-role">
            {nombreRol}
          </span>

                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={onCerrarSesion}
                >
                    Cerrar sesión
                </button>

            </div>

        </header>
    );
}