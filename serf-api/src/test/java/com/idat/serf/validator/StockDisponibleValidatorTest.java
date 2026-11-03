package com.idat.serf.validator;

import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Producto;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StockDisponibleValidatorTest {

    private final StockDisponibleValidator validator =
            new StockDisponibleValidator();

    @Test
    void debeAceptarCantidadConStockDisponible() {

        Producto producto = new Producto();
        producto.setStock(100);

        assertDoesNotThrow(() ->
                validator.validar(producto, 10)
        );
    }

    @Test
    void debeRechazarCantidadMayorAlStock() {

        Producto producto = new Producto();
        producto.setStock(10);

        ReglaNegocioException exception =
                assertThrows(
                        ReglaNegocioException.class,
                        () -> validator.validar(
                                producto,
                                20
                        )
                );

        assertTrue(
                exception.getMessage()
                        .contains("Stock insuficiente")
        );
    }

    @Test
    void debeRechazarCantidadCero() {

        Producto producto = new Producto();
        producto.setStock(100);

        assertThrows(
                ReglaNegocioException.class,
                () -> validator.validar(
                        producto,
                        0
                )
        );
    }
}