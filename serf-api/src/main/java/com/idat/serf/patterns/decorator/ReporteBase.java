package com.idat.serf.patterns.decorator;

public class ReporteBase implements ReporteExportable {

    private final String contenido;

    public ReporteBase(String contenido) {
        this.contenido = contenido;
    }

    @Override
    public String generar() {
        return contenido;
    }
}