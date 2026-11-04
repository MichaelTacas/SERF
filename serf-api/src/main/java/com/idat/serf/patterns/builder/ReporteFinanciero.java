package com.idat.serf.patterns.builder;

import java.util.ArrayList;
import java.util.List;

public class ReporteFinanciero {

    private String titulo;
    private String encabezado;
    private final List<String> secciones;
    private String conclusion;

    public ReporteFinanciero() {
        this.secciones = new ArrayList<>();
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getEncabezado() {
        return encabezado;
    }

    public void setEncabezado(String encabezado) {
        this.encabezado = encabezado;
    }

    public List<String> getSecciones() {
        return List.copyOf(secciones);
    }

    public void agregarSeccion(String seccion) {

        if (seccion == null || seccion.isBlank()) {
            return;
        }

        this.secciones.add(seccion);
    }

    public String getConclusion() {
        return conclusion;
    }

    public void setConclusion(String conclusion) {
        this.conclusion = conclusion;
    }
}