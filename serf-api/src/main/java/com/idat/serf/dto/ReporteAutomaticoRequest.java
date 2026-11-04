package com.idat.serf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReporteAutomaticoRequest {

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    @NotBlank(message = "El periodo es obligatorio")
    private String periodo;

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }
}