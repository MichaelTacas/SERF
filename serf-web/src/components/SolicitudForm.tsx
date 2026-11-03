import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Cliente } from "../interfaces/Cliente";
import type { Tecnico } from "../interfaces/Tecnico";
import type { SolicitudRequest } from "../interfaces/SolicitudRequest";

import { clienteService } from "../services/clienteService";
import { tecnicoService } from "../services/tecnicoService";

interface SolicitudFormProps {
    onRegistrar: (solicitud: SolicitudRequest) => Promise<void>;
}

function SolicitudForm({ onRegistrar }: SolicitudFormProps) {

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [prioridad, setPrioridad] =
        useState<"BAJA" | "MEDIA" | "ALTA">("MEDIA");

    const [clienteId, setClienteId] = useState<number>(0);
    const [tecnicoId, setTecnicoId] = useState<number | null>(null);

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const [clientesData, tecnicosData] =
                    await Promise.all([
                        clienteService.listar(),
                        tecnicoService.listarDisponibles()
                    ]);

                setClientes(clientesData);
                setTecnicos(tecnicosData);

            } catch {
                setMensaje(
                    "No se pudieron cargar los clientes o técnicos"
                );
            }
        };

        cargarDatos();

    }, []);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (clienteId === 0) {
            setMensaje("Debe seleccionar un cliente");
            return;
        }

        const nuevaSolicitud: SolicitudRequest = {
            titulo,
            descripcion,
            prioridad,
            clienteId,
            tecnicoId
        };

        try {

            setEnviando(true);
            setMensaje("");

            await onRegistrar(nuevaSolicitud);

            setTitulo("");
            setDescripcion("");
            setPrioridad("MEDIA");
            setClienteId(0);
            setTecnicoId(null);

            setMensaje("Solicitud registrada correctamente");

        } catch (error) {

            if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje("No se pudo registrar la solicitud");
            }

        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="form-card">

            <div className="form-header">
                <div>
                    <h2>Registrar nueva solicitud</h2>

                    <p>
                        Complete los datos para generar una nueva solicitud de soporte.
                    </p>
                </div>
            </div>

            <form
                className="solicitud-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label htmlFor="titulo">
                        Título
                    </label>

                    <input
                        id="titulo"
                        type="text"
                        value={titulo}
                        onChange={(event) =>
                            setTitulo(event.target.value)
                        }
                        placeholder="Ej. Problema con impresora"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prioridad">
                        Prioridad
                    </label>

                    <select
                        id="prioridad"
                        value={prioridad}
                        onChange={(event) =>
                            setPrioridad(
                                event.target.value as
                                    "BAJA" | "MEDIA" | "ALTA"
                            )
                        }
                    >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                    </select>
                </div>

                <div className="form-group form-group-full">
                    <label htmlFor="descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(event) =>
                            setDescripcion(event.target.value)
                        }
                        placeholder="Describe detalladamente el problema presentado..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cliente">
                        Cliente
                    </label>

                    <select
                        id="cliente"
                        value={clienteId}
                        onChange={(event) =>
                            setClienteId(Number(event.target.value))
                        }
                        required
                    >

                        <option value={0}>
                            Seleccione un cliente
                        </option>

                        {clientes.map((cliente) => (
                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.nombre} - {cliente.empresa}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tecnico">
                        Técnico
                    </label>

                    <select
                        id="tecnico"
                        value={tecnicoId ?? ""}
                        onChange={(event) => {

                            const valor = event.target.value;

                            setTecnicoId(
                                valor === ""
                                    ? null
                                    : Number(valor)
                            );
                        }}
                    >

                        <option value="">
                            Sin asignar
                        </option>

                        {tecnicos.map((tecnico) => (
                            <option
                                key={tecnico.id}
                                value={tecnico.id}
                            >
                                {tecnico.nombre} - {tecnico.especialidad}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="form-actions">

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={enviando}
                    >
                        {enviando
                            ? "Registrando..."
                            : "Registrar solicitud"}
                    </button>

                </div>

                {mensaje && (
                    <p className="mensaje">
                        {mensaje}
                    </p>
                )}

            </form>

        </section>
    );
}

export default SolicitudForm;