import { useState, type FormEvent } from 'react';
import { authService } from '../services/authService';
import '../styles/Login.css';

interface LoginPageProps {
    onLoginExitoso: () => void;
}

export function LoginPage({
                              onLoginExitoso,
                          }: LoginPageProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const iniciarSesion = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError('');
        setCargando(true);

        try {

            await authService.login({
                email,
                password,
            });

            onLoginExitoso();

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ocurrió un error al iniciar sesión');
            }

        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="login-page">

            <section className="login-card">

                <div className="login-header">
                    <h1>Soporte Técnico</h1>

                    <p>
                        Ingresa con tu cuenta para acceder al sistema.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={iniciarSesion}
                >

                    <div className="login-field">

                        <label htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="usuario@grzasociados.com"
                            required
                            autoComplete="email"
                        />

                    </div>

                    <div className="login-field">

                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Ingresa tu contraseña"
                            required
                            autoComplete="current-password"
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={cargando}
                    >
                        {cargando
                            ? 'Ingresando...'
                            : 'Iniciar sesión'}
                    </button>

                </form>

            </section>

        </main>
    );
}