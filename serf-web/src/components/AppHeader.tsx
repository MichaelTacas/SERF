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
            : 'Técnico';

    return (
        <header className="app-header">

            <div className="app-header-brand">
                <h1>Sistema de Soporte Técnico</h1>
                <p>GRZ & Asociados</p>
            </div>

            <div className="app-header-user">

                <div className="app-user-info">
          <span className="app-user-email">
            {usuario?.email}
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