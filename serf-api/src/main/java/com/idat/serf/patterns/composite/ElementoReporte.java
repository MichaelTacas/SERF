package com.idat.serf.patterns.composite;

public class ElementoReporte
        implements ComponenteReporte {

    private final String titulo;
    private final String contenido;

    public ElementoReporte(
            String titulo,
            String contenido
    ) {
        this.titulo =
                titulo == null
                        ? ""
                        : titulo.trim();

        this.contenido =
                contenido == null
                        ? ""
                        : contenido.trim();
    }

    @Override
    public String generarContenido() {

        if (titulo.isBlank()) {
            return contenido;
        }

        if (contenido.isBlank()) {
            return titulo;
        }

        return titulo
                + ": "
                + contenido;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getContenido() {
        return contenido;
    }
}