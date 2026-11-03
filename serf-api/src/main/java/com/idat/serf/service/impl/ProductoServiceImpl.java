package com.idat.serf.service.impl;

import com.idat.serf.exception.RecursoNoEncontradoException;
import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Filial;
import com.idat.serf.model.Producto;
import com.idat.serf.repository.FilialRepository;
import com.idat.serf.repository.ProductoRepository;
import com.idat.serf.service.ProductoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final FilialRepository filialRepository;

    public ProductoServiceImpl(
            ProductoRepository productoRepository,
            FilialRepository filialRepository
    ) {
        this.productoRepository = productoRepository;
        this.filialRepository = filialRepository;
    }

    @Override
    public Producto crear(Producto producto) {

        if (productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new ReglaNegocioException(
                    "Ya existe un producto con el código: "
                            + producto.getCodigo()
            );
        }

        Filial filial = obtenerFilial(producto);

        producto.setFilial(filial);

        return productoRepository.save(producto);
    }

    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Override
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Producto no encontrado con ID: " + id
                        )
                );
    }

    @Override
    public List<Producto> listarPorFilial(Long filialId) {

        if (!filialRepository.existsById(filialId)) {
            throw new RecursoNoEncontradoException(
                    "Filial no encontrada con ID: " + filialId
            );
        }

        return productoRepository.findByFilialId(filialId);
    }

    @Override
    public Producto actualizar(Long id, Producto producto) {

        Producto existente = buscarPorId(id);

        productoRepository.findByCodigo(producto.getCodigo())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new ReglaNegocioException(
                            "Ya existe otro producto con el código: "
                                    + producto.getCodigo()
                    );
                });

        Filial filial = obtenerFilial(producto);

        existente.setCodigo(producto.getCodigo());
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setCategoria(producto.getCategoria());
        existente.setCostoImportacion(producto.getCostoImportacion());
        existente.setPrecioVenta(producto.getPrecioVenta());
        existente.setProveedor(producto.getProveedor());
        existente.setFechaImportacion(producto.getFechaImportacion());
        existente.setStock(producto.getStock());
        existente.setFilial(filial);

        return productoRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = buscarPorId(id);
        productoRepository.delete(producto);
    }

    private Filial obtenerFilial(Producto producto) {

        if (producto.getFilial() == null
                || producto.getFilial().getId() == null) {

            throw new ReglaNegocioException(
                    "Debe indicar una filial válida"
            );
        }

        return filialRepository
                .findById(producto.getFilial().getId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Filial no encontrada con ID: "
                                        + producto.getFilial().getId()
                        )
                );
    }
}