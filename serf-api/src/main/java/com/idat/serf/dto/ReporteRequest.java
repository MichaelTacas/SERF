package com.idat.serf.dto;

import jakarta.validation.constraints.NotBlank;

public class ReporteRequest {

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @NotBlank(message = "Los ingresos son obligatorios")
    private String ingresos;

    @NotBlank(message = "Los gastos son obligatorios")
    private String gastos;

    @NotBlank(message = "El responsable es obligatorio")
    private String responsable;

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getIngresos() {
        return ingresos;
    }

    public void setIngresos(String ingresos) {
        this.ingresos = ingresos;
    }

    public String getGastos() {
        return gastos;
    }

    public void setGastos(String gastos) {
        this.gastos = gastos;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }
}