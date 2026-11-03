package com.idat.serf.patterns.composite;

public class ElementoReporte implements ComponenteReporte {

    private final String titulo;
    private final String contenido;

    public ElementoReporte(
            String titulo,
            String contenido
    ) {
        this.titulo = titulo;
        this.contenido = contenido;
    }

    @Override
    public String generarContenido() {
        return titulo + ": " + contenido;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getContenido() {
        return contenido;
    }
}