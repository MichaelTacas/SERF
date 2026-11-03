package com.idat.serf.controller;

import com.idat.serf.dto.ProductoRequest;
import com.idat.serf.dto.ProductoResponse;
import com.idat.serf.mapper.ProductoMapper;
import com.idat.serf.model.Filial;
import com.idat.serf.model.Producto;
import com.idat.serf.service.FilialService;
import com.idat.serf.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final FilialService filialService;
    private final ProductoMapper productoMapper;

    public ProductoController(
            ProductoService productoService,
            FilialService filialService,
            ProductoMapper productoMapper
    ) {
        this.productoService = productoService;
        this.filialService = filialService;
        this.productoMapper = productoMapper;
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(
            @Valid @RequestBody ProductoRequest request
    ) {

        Filial filial =
                filialService.buscarPorId(request.getFilialId());

        Producto producto =
                productoMapper.toEntity(request, filial);

        Producto creado =
                productoService.crear(producto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productoMapper.toResponse(creado));
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar() {

        List<ProductoResponse> productos =
                productoService.listar()
                        .stream()
                        .map(productoMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> buscarPorId(
            @PathVariable Long id
    ) {

        Producto producto =
                productoService.buscarPorId(id);

        return ResponseEntity.ok(
                productoMapper.toResponse(producto)
        );
    }

    @GetMapping("/filial/{filialId}")
    public ResponseEntity<List<ProductoResponse>> listarPorFilial(
            @PathVariable Long filialId
    ) {

        List<ProductoResponse> productos =
                productoService.listarPorFilial(filialId)
                        .stream()
                        .map(productoMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(productos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request
    ) {

        Filial filial =
                filialService.buscarPorId(request.getFilialId());

        Producto producto =
                productoMapper.toEntity(request, filial);

        Producto actualizado =
                productoService.actualizar(id, producto);

        return ResponseEntity.ok(
                productoMapper.toResponse(actualizado)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id
    ) {

        productoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}