package com.idat.serf.repository;

import com.idat.serf.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VentaRepository
        extends JpaRepository<Venta, Long> {

    Optional<Venta> findByNumeroFactura(
            String numeroFactura
    );

    boolean existsByNumeroFactura(
            String numeroFactura
    );

    List<Venta> findByFilialId(
            Long filialId
    );

    List<Venta> findByFilialIdAndClienteId(
            Long filialId,
            Long clienteId
    );

    boolean existsByClienteId(
            Long clienteId
    );
}