package com.idat.serf.dto;

import jakarta.validation.constraints.NotBlank;

public class ReporteAutomaticoRequest {

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @NotBlank(message = "El responsable es obligatorio")
    private String responsable;

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }
}