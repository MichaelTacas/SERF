package com.idat.serf.controller;

import com.idat.serf.dto.ReporteAutomaticoRequest;
import com.idat.serf.dto.ReporteRequest;
import com.idat.serf.patterns.facade.ReporteFacade;
import com.idat.serf.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteFacade reporteFacade;
    private final ReporteService reporteService;

    public ReporteController(
            ReporteFacade reporteFacade,
            ReporteService reporteService
    ) {
        this.reporteFacade = reporteFacade;
        this.reporteService = reporteService;
    }

    @PostMapping(
            value = "/mensual",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<String> generarMensual(
            @Valid @RequestBody ReporteRequest request,
            Authentication authentication
    ) {

        String responsable = authentication.getName();

        String contenido =
                reporteFacade.generarReporteMensual(
                        request.getPais(),
                        request.getIngresos(),
                        request.getGastos(),
                        responsable
                );

        return ResponseEntity.ok(contenido);
    }

    @PostMapping(
            value = "/mensual/automatico",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<String> generarMensualAutomatico(
            @Valid @RequestBody ReporteAutomaticoRequest request,
            Authentication authentication
    ) {

        String responsable = authentication.getName();

        String contenido =
                reporteService.generarMensualAutomatico(
                        request.getPais(),
                        responsable
                );

        return ResponseEntity.ok(contenido);
    }
}