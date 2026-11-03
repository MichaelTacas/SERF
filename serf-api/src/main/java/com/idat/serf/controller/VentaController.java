package com.idat.serf.controller;

import com.idat.serf.dto.VentaRequest;
import com.idat.serf.dto.VentaResponse;
import com.idat.serf.mapper.VentaMapper;
import com.idat.serf.model.Cliente;
import com.idat.serf.model.Producto;
import com.idat.serf.model.Usuario;
import com.idat.serf.model.Venta;
import com.idat.serf.service.ClienteService;
import com.idat.serf.service.ProductoService;
import com.idat.serf.service.UsuarioService;
import com.idat.serf.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;
    private final ProductoService productoService;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;
    private final VentaMapper ventaMapper;

    public VentaController(
            VentaService ventaService,
            ProductoService productoService,
            ClienteService clienteService,
            UsuarioService usuarioService,
            VentaMapper ventaMapper
    ) {
        this.ventaService = ventaService;
        this.productoService = productoService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
        this.ventaMapper = ventaMapper;
    }

    @PostMapping
    public ResponseEntity<VentaResponse> registrar(
            @Valid @RequestBody VentaRequest request
    ) {

        Producto producto =
                productoService.buscarPorId(request.getProductoId());

        Cliente cliente =
                clienteService.buscarPorId(request.getClienteId());

        Usuario vendedor =
                usuarioService.buscarPorId(request.getVendedorId());

        Venta venta = ventaMapper.toEntity(
                request,
                producto,
                cliente,
                vendedor
        );

        Venta registrada =
                ventaService.registrar(venta);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ventaMapper.toResponse(registrada));
    }

    @GetMapping
    public ResponseEntity<List<VentaResponse>> listar() {

        List<VentaResponse> ventas =
                ventaService.listar()
                        .stream()
                        .map(ventaMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponse> buscarPorId(
            @PathVariable Long id
    ) {

        Venta venta =
                ventaService.buscarPorId(id);

        return ResponseEntity.ok(
                ventaMapper.toResponse(venta)
        );
    }

    @GetMapping("/filial/{filialId}")
    public ResponseEntity<List<VentaResponse>> listarPorFilial(
            @PathVariable Long filialId
    ) {

        List<VentaResponse> ventas =
                ventaService.listarPorFilial(filialId)
                        .stream()
                        .map(ventaMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(ventas);
    }
}