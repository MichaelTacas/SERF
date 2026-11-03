package com.idat.serf.controller;

import com.idat.serf.dto.ReporteAutomaticoRequest;
import com.idat.serf.dto.ReporteRequest;
import com.idat.serf.patterns.facade.ReporteFacade;
import com.idat.serf.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @Valid @RequestBody ReporteRequest request
    ) {

        String contenido =
                reporteFacade.generarReporteMensual(
                        request.getPais(),
                        request.getIngresos(),
                        request.getGastos(),
                        request.getResponsable()
                );

        return ResponseEntity.ok(contenido);
    }

    @PostMapping(
            value = "/mensual/automatico",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<String> generarMensualAutomatico(
            @Valid @RequestBody ReporteAutomaticoRequest request
    ) {

        String contenido =
                reporteService.generarMensualAutomatico(
                        request.getPais(),
                        request.getResponsable()
                );

        return ResponseEntity.ok(contenido);
    }
}