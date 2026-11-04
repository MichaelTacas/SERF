package com.idat.serf.service;

public interface ReporteService {

    String generarAutomatico(
            String pais,
            Long clienteId,
            String periodo,
            String responsable
    );
}