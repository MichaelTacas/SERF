package com.idat.serf.repository;

import com.idat.serf.model.Filial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface FilialRepository extends JpaRepository<Filial, Long> {

    Optional<Filial> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    List<Filial> findByPaisIgnoreCase(String pais);
}