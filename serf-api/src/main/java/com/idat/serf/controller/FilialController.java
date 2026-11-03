package com.idat.serf.controller;

import com.idat.serf.dto.FilialRequest;
import com.idat.serf.dto.FilialResponse;
import com.idat.serf.mapper.FilialMapper;
import com.idat.serf.model.Filial;
import com.idat.serf.service.FilialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filiales")
public class FilialController {

    private final FilialService filialService;
    private final FilialMapper filialMapper;

    public FilialController(
            FilialService filialService,
            FilialMapper filialMapper
    ) {
        this.filialService = filialService;
        this.filialMapper = filialMapper;
    }

    @PostMapping
    public ResponseEntity<FilialResponse> crear(
            @Valid @RequestBody FilialRequest request
    ) {

        Filial filial = filialMapper.toEntity(request);

        Filial creada = filialService.crear(filial);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(filialMapper.toResponse(creada));
    }

    @GetMapping
    public ResponseEntity<List<FilialResponse>> listar() {

        List<FilialResponse> filiales = filialService.listar()
                .stream()
                .map(filialMapper::toResponse)
                .toList();

        return ResponseEntity.ok(filiales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FilialResponse> buscarPorId(
            @PathVariable Long id
    ) {

        Filial filial = filialService.buscarPorId(id);

        return ResponseEntity.ok(
                filialMapper.toResponse(filial)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FilialResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody FilialRequest request
    ) {

        Filial filial = filialMapper.toEntity(request);

        Filial actualizada =
                filialService.actualizar(id, filial);

        return ResponseEntity.ok(
                filialMapper.toResponse(actualizada)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id
    ) {

        filialService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}