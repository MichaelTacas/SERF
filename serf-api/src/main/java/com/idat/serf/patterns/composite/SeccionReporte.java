package com.idat.serf.patterns.composite;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SeccionReporte
        implements ComponenteReporte {

    private final String titulo;
    private final List<ComponenteReporte> componentes;

    public SeccionReporte(String titulo) {

        this.titulo =
                titulo == null
                        ? ""
                        : titulo.trim();

        this.componentes =
                new ArrayList<>();
    }

    public void agregar(
            ComponenteReporte componente
    ) {

        componentes.add(
                Objects.requireNonNull(
                        componente,
                        "El componente no puede ser nulo"
                )
        );
    }

    public void eliminar(
            ComponenteReporte componente
    ) {

        componentes.remove(
                componente
        );
    }

    public List<ComponenteReporte> getComponentes() {

        return List.copyOf(
                componentes
        );
    }

    @Override
    public String generarContenido() {

        StringBuilder resultado =
                new StringBuilder();

        /*
         * Solo mostramos el título cuando realmente existe.
         * Esto evita líneas vacías en secciones usadas
         * únicamente como contenedores.
         */
        if (!titulo.isBlank()) {

            resultado
                    .append(titulo)
                    .append("\n");
        }

        for (int i = 0;
             i < componentes.size();
             i++) {

            String contenido =
                    componentes
                            .get(i)
                            .generarContenido();

            if (contenido == null
                    || contenido.isBlank()) {

                continue;
            }

            resultado.append(
                    contenido.trim()
            );

            if (i < componentes.size() - 1) {
                resultado.append("\n");
            }
        }

        return resultado.toString();
    }

    public String getTitulo() {
        return titulo;
    }
}