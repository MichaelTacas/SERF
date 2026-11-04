package com.idat.serf.patterns.prototype;

import com.idat.serf.model.TipoReporte;

import java.util.ArrayList;
import java.util.List;

public class PlantillaReporte {

    private String titulo;
    private String pais;
    private TipoReporte tipoReporte;
    private List<String> seccionesBase;

    // Constructor principal
    public PlantillaReporte(
            String titulo,
            String pais,
            TipoReporte tipoReporte
    ) {
        this.titulo = titulo;
        this.pais = pais;
        this.tipoReporte = tipoReporte;
        this.seccionesBase = new ArrayList<>();
    }

    // Constructor de copia - Patrón Prototype
    private PlantillaReporte(PlantillaReporte original) {
        this.titulo = original.titulo;
        this.pais = original.pais;
        this.tipoReporte = original.tipoReporte;
        this.seccionesBase = new ArrayList<>(original.seccionesBase);
    }

    // Método para clonar la plantilla
    public PlantillaReporte clonar() {
        return new PlantillaReporte(this);
    }

    // =====================================================
    // PLANTILLAS BASE
    // =====================================================

    // 1. Reporte mensual de ingresos
    public static PlantillaReporte crearPlantillaMensualIngresos(String pais) {

        PlantillaReporte plantilla = new PlantillaReporte(
                "Reporte mensual de ingresos",
                pais,
                TipoReporte.FINANCIERO
        );

        plantilla.agregarSeccionBase("Resumen mensual");
        plantilla.agregarSeccionBase("Ingresos por ventas");
        plantilla.agregarSeccionBase("Totales del mes");

        return plantilla;
    }

    // 2. Reporte trimestral de gastos e ingresos
    public static PlantillaReporte crearPlantillaTrimestral(String pais) {

        PlantillaReporte plantilla = new PlantillaReporte(
                "Reporte trimestral de gastos e ingresos",
                pais,
                TipoReporte.FINANCIERO
        );

        plantilla.agregarSeccionBase("Resumen trimestral");
        plantilla.agregarSeccionBase("Ingresos del trimestre");
        plantilla.agregarSeccionBase("Gastos del trimestre");
        plantilla.agregarSeccionBase("Balance trimestral");

        return plantilla;
    }

    // 3. Reporte anual consolidado
    public static PlantillaReporte crearPlantillaAnualConsolidado(String pais) {

        PlantillaReporte plantilla = new PlantillaReporte(
                "Reporte anual consolidado",
                pais,
                TipoReporte.FINANCIERO
        );

        plantilla.agregarSeccionBase("Resumen anual");
        plantilla.agregarSeccionBase("Ingresos anuales");
        plantilla.agregarSeccionBase("Gastos anuales");
        plantilla.agregarSeccionBase("Resultado consolidado");

        return plantilla;
    }

    // =====================================================
    // MÉTODOS
    // =====================================================

    public void agregarSeccionBase(String seccion) {
        seccionesBase.add(seccion);
    }

    // =====================================================
    // GETTERS Y SETTERS
    // =====================================================

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public TipoReporte getTipoReporte() {
        return tipoReporte;
    }

    public void setTipoReporte(TipoReporte tipoReporte) {
        this.tipoReporte = tipoReporte;
    }

    public List<String> getSeccionesBase() {
        return new ArrayList<>(seccionesBase);
    }
}