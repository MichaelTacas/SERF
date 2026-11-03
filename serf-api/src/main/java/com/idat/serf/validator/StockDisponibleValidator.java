package com.idat.serf.validator;

import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class StockDisponibleValidator {

    public void validar(
            Producto producto,
            int cantidad
    ) {

        if (cantidad <= 0) {
            throw new ReglaNegocioException(
                    "La cantidad debe ser mayor a cero"
            );
        }

        if (producto.getStock() < cantidad) {
            throw new ReglaNegocioException(
                    "Stock insuficiente. Disponible: "
                            + producto.getStock()
            );
        }
    }
}