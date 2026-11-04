package com.idat.serf.mapper;

import com.idat.serf.dto.ProductoRequest;
import com.idat.serf.dto.ProductoResponse;
import com.idat.serf.model.Filial;
import com.idat.serf.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public Producto toEntity(
            ProductoRequest request,
            Filial filial
    ) {

        Producto producto = new Producto();

        producto.setCodigo(request.getCodigo());
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setCategoria(request.getCategoria());
        producto.setCostoImportacion(request.getCostoImportacion());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setProveedor(request.getProveedor());
        producto.setFechaImportacion(request.getFechaImportacion());
        producto.setStock(request.getStock());
        producto.setFilial(filial);

        return producto;
    }

    public void actualizarEntidad(
            ProductoRequest request,
            Producto producto,
            Filial filial
    ) {

        producto.setCodigo(request.getCodigo());
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setCategoria(request.getCategoria());
        producto.setCostoImportacion(request.getCostoImportacion());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setProveedor(request.getProveedor());
        producto.setFechaImportacion(request.getFechaImportacion());
        producto.setStock(request.getStock());
        producto.setFilial(filial);
    }

    public ProductoResponse toResponse(Producto producto) {

        ProductoResponse response = new ProductoResponse();

        response.setId(producto.getId());
        response.setCodigo(producto.getCodigo());
        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setCategoria(producto.getCategoria());
        response.setCostoImportacion(producto.getCostoImportacion());
        response.setCostoImportacionEur(producto.getCostoImportacionEur());
        response.setPrecioVenta(producto.getPrecioVenta());
        response.setProveedor(producto.getProveedor());
        response.setFechaImportacion(producto.getFechaImportacion());
        response.setStock(producto.getStock());

        if (producto.getFilial() != null) {
            response.setFilialId(producto.getFilial().getId());
            response.setFilialNombre(
                    producto.getFilial().getNombre()
            );
        }

        return response;
    }
}