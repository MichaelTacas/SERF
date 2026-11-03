package com.idat.serf.patterns.builder;

public interface ReporteBuilder {

    ReporteBuilder titulo(String titulo);

    ReporteBuilder encabezado(String encabezado);

    ReporteBuilder agregarSeccion(
            String titulo,
            String contenido
    );

    ReporteBuilder conclusion(String conclusion);

    ReporteFinanciero construir();
}