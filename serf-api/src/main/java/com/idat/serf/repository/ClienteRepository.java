package com.idat.serf.repository;

import com.idat.serf.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository
        extends JpaRepository<Cliente, Long> {
}