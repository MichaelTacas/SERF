package com.idat.serf.patterns.prototype;

import com.idat.serf.model.TipoReporte;

import java.util.ArrayList;
import java.util.List;

public class PlantillaReporte {

    private String titulo;
    private String pais;
    private TipoReporte tipoReporte;
    private List<String> seccionesBase;

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

    private PlantillaReporte(PlantillaReporte original) {
        this.titulo = original.titulo;
        this.pais = original.pais;
        this.tipoReporte = original.tipoReporte;

        this.seccionesBase =
                new ArrayList<>(original.seccionesBase);
    }

    public PlantillaReporte clonar() {
        return new PlantillaReporte(this);
    }

    public void agregarSeccionBase(String seccion) {
        seccionesBase.add(seccion);
    }

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