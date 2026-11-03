import { authService } from '../services/authService';
import '../styles/DashboardPage.css';

interface DashboardPageProps {
    onNavigate: (
        modulo:
            | 'clientes'
            | 'filiales'
            | 'productos'
            | 'ventas'
            | 'reportes'
            | 'usuarios'
    ) => void;
}

export function DashboardPage({
                                  onNavigate,
                              }: DashboardPageProps) {

    const modulos = [
        {
            id: 'clientes',
            titulo: 'Clientes',
            descripcion:
                'Gestiona la información de los clientes registrados.',
            etiqueta: 'Gestión',
        },
        {
            id: 'filiales',
            titulo: 'Filiales',
            descripcion:
                'Administra las sedes y filiales de FinanCorp.',
            etiqueta: 'Organización',
        },
        {
            id: 'productos',
            titulo: 'Productos',
            descripcion:
                'Consulta productos, precios y disponibilidad de inventario.',
            etiqueta: 'Inventario',
        },
        {
            id: 'ventas',
            titulo: 'Ventas',
            descripcion:
                'Gestiona y consulta las operaciones comerciales registradas.',
            etiqueta: 'Operaciones',
        },
        {
            id: 'reportes',
            titulo: 'Reportes',
            descripcion:
                'Genera reportes financieros manuales y automáticos.',
            etiqueta: 'Finanzas',
        },
        {
            id: 'usuarios',
            titulo: 'Usuarios',
            descripcion:
                'Administra los usuarios y roles que tienen acceso al sistema.',
            etiqueta: 'Seguridad',
        },
    ] as const;

    const esAdministrador =
        authService.esAdministrador();

    const modulosVisibles =
        esAdministrador
            ? modulos
            : modulos.filter(
                (modulo) =>
                    [
                        'clientes',
                        'productos',
                        'ventas',
                    ].includes(modulo.id)
            );

    return (
        <main className="dashboard-page">

            <section className="dashboard-hero">

                <div>

          <span className="dashboard-eyebrow">
            SERF
          </span>

                    <h2>
                        Panel principal
                    </h2>

                    <p>
                        Gestiona la información empresarial y accede
                        a los principales módulos del Sistema Empresarial
                        de Gestión de Reportes Financieros.
                    </p>

                </div>

                <div className="dashboard-summary">

          <span className="summary-number">
            {modulosVisibles.length}
          </span>

                    <span className="summary-label">
            módulos disponibles
          </span>

                </div>

            </section>

            <section className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <h3>
                            Módulos del sistema
                        </h3>

                        <p>
                            Selecciona el área que deseas gestionar.
                        </p>

                    </div>

                </div>

                <div className="dashboard-grid">

                    {modulosVisibles.map(
                        (modulo) => (

                            <article
                                key={modulo.id}
                                className="dashboard-card"
                                onClick={() =>
                                    onNavigate(modulo.id)
                                }
                            >

                                <div className="dashboard-card-top">

                  <span className="dashboard-card-tag">
                    {modulo.etiqueta}
                  </span>

                                </div>

                                <div className="dashboard-card-content">

                                    <h4>
                                        {modulo.titulo}
                                    </h4>

                                    <p>
                                        {modulo.descripcion}
                                    </p>

                                </div>

                                <div className="dashboard-card-footer">

                  <span>
                    Ingresar al módulo →
                  </span>

                                </div>

                            </article>

                        )
                    )}

                </div>

            </section>

        </main>
    );
}