package com.idat.serf.dto;

public class ReporteResponse {

    private String contenido;

    public ReporteResponse() {
    }

    public ReporteResponse(String contenido) {
        this.contenido = contenido;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}