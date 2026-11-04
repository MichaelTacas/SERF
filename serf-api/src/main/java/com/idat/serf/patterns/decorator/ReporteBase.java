package com.idat.serf.patterns.decorator;

import java.util.Objects;

public class ReporteBase
        implements ReporteExportable {

    private final String contenido;

    public ReporteBase(
            String contenido
    ) {
        this.contenido = Objects.requireNonNull(
                contenido,
                "El contenido del reporte no puede ser nulo"
        );
    }

    @Override
    public String generar() {
        return contenido;
    }
}