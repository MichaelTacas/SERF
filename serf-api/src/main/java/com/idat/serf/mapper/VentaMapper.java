package com.idat.serf.mapper;

import com.idat.serf.dto.VentaRequest;
import com.idat.serf.dto.VentaResponse;
import com.idat.serf.model.Cliente;
import com.idat.serf.model.Producto;
import com.idat.serf.model.Usuario;
import com.idat.serf.model.Venta;
import org.springframework.stereotype.Component;

@Component
public class VentaMapper {

    public Venta toEntity(
            VentaRequest request,
            Producto producto,
            Cliente cliente,
            Usuario vendedor
    ) {

        Venta venta = new Venta();

        venta.setNumeroFactura(request.getNumeroFactura());
        venta.setFechaVenta(request.getFechaVenta());
        venta.setProducto(producto);
        venta.setCantidad(request.getCantidad());
        venta.setPrecioUnitario(request.getPrecioUnitario());
        venta.setCliente(cliente);
        venta.setVendedor(vendedor);
        venta.setMetodoPago(request.getMetodoPago());

        if (producto != null) {
            venta.setFilial(producto.getFilial());
        }

        return venta;
    }

    public VentaResponse toResponse(Venta venta) {

        VentaResponse response = new VentaResponse();

        response.setId(venta.getId());
        response.setNumeroFactura(venta.getNumeroFactura());
        response.setFechaVenta(venta.getFechaVenta());
        response.setCantidad(venta.getCantidad());
        response.setPrecioUnitario(venta.getPrecioUnitario());
        response.setTotal(venta.calcularTotal());
        response.setMetodoPago(venta.getMetodoPago());

        if (venta.getProducto() != null) {
            response.setProductoId(
                    venta.getProducto().getId()
            );

            response.setProductoNombre(
                    venta.getProducto().getNombre()
            );
        }

        if (venta.getCliente() != null) {
            response.setClienteId(
                    venta.getCliente().getId()
            );

            response.setClienteNombre(
                    venta.getCliente().getNombre()
            );
        }

        if (venta.getVendedor() != null) {
            response.setVendedorId(
                    venta.getVendedor().getId()
            );

            response.setVendedorEmail(
                    venta.getVendedor().getEmail()
            );
        }

        if (venta.getFilial() != null) {
            response.setFilialId(
                    venta.getFilial().getId()
            );

            response.setFilialNombre(
                    venta.getFilial().getNombre()
            );
        }

        return response;
    }
}