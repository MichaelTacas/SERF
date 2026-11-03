package com.idat.serf.service.impl;

import com.idat.serf.exception.RecursoNoEncontradoException;
import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Producto;
import com.idat.serf.model.Venta;
import com.idat.serf.repository.ProductoRepository;
import com.idat.serf.repository.VentaRepository;
import com.idat.serf.service.VentaService;
import com.idat.serf.validator.StockDisponibleValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final StockDisponibleValidator stockDisponibleValidator;

    public VentaServiceImpl(
            VentaRepository ventaRepository,
            ProductoRepository productoRepository,
            StockDisponibleValidator stockDisponibleValidator
    ) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.stockDisponibleValidator = stockDisponibleValidator;
    }

    @Override
    @Transactional
    public Venta registrar(Venta venta) {

        if (ventaRepository.existsByNumeroFactura(
                venta.getNumeroFactura()
        )) {
            throw new ReglaNegocioException(
                    "Ya existe una venta con la factura: "
                            + venta.getNumeroFactura()
            );
        }

        if (venta.getProducto() == null
                || venta.getProducto().getId() == null) {

            throw new ReglaNegocioException(
                    "Debe indicar un producto válido"
            );
        }

        Producto producto = productoRepository
                .findById(venta.getProducto().getId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Producto no encontrado"
                        )
                );

        stockDisponibleValidator.validar(
                producto,
                venta.getCantidad()
        );

        producto.setStock(
                producto.getStock() - venta.getCantidad()
        );

        productoRepository.save(producto);

        venta.setProducto(producto);

        if (venta.getFilial() == null) {
            venta.setFilial(producto.getFilial());
        }

        return ventaRepository.save(venta);
    }

    @Override
    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    @Override
    public Venta buscarPorId(Long id) {

        return ventaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Venta no encontrada con ID: " + id
                        )
                );
    }

    @Override
    public List<Venta> listarPorFilial(Long filialId) {
        return ventaRepository.findByFilialId(filialId);
    }
}