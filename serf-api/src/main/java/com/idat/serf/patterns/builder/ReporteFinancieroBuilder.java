package com.idat.serf.patterns.builder;

public class ReporteFinancieroBuilder
        implements ReporteBuilder {

    private ReporteFinanciero reporte;

    public ReporteFinancieroBuilder() {
        reiniciar();
    }

    private void reiniciar() {
        this.reporte = new ReporteFinanciero();
    }

    @Override
    public ReporteBuilder titulo(String titulo) {
        reporte.setTitulo(titulo);
        return this;
    }

    @Override
    public ReporteBuilder encabezado(String encabezado) {
        reporte.setEncabezado(encabezado);
        return this;
    }

    @Override
    public ReporteBuilder agregarSeccion(
            String titulo,
            String contenido
    ) {

        reporte.agregarSeccion(
                titulo + ": " + contenido
        );

        return this;
    }

    @Override
    public ReporteBuilder conclusion(String conclusion) {
        reporte.setConclusion(conclusion);
        return this;
    }

    @Override
    public ReporteFinanciero construir() {

        ReporteFinanciero resultado = reporte;

        reiniciar();

        return resultado;
    }
}