package com.idat.serf.service.impl;

import com.idat.serf.exception.RecursoNoEncontradoException;
import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Filial;
import com.idat.serf.repository.FilialRepository;
import com.idat.serf.service.FilialService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilialServiceImpl implements FilialService {

    private final FilialRepository filialRepository;

    public FilialServiceImpl(FilialRepository filialRepository) {
        this.filialRepository = filialRepository;
    }

    @Override
    public Filial crear(Filial filial) {

        if (filialRepository.existsByCodigo(filial.getCodigo())) {
            throw new ReglaNegocioException(
                    "Ya existe una filial con el código: " + filial.getCodigo()
            );
        }

        return filialRepository.save(filial);
    }

    @Override
    public List<Filial> listar() {
        return filialRepository.findAll();
    }

    @Override
    public Filial buscarPorId(Long id) {
        return filialRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Filial no encontrada con ID: " + id
                        )
                );
    }

    @Override
    public Filial actualizar(Long id, Filial filial) {

        Filial existente = buscarPorId(id);

        filialRepository.findByCodigo(filial.getCodigo())
                .filter(f -> !f.getId().equals(id))
                .ifPresent(f -> {
                    throw new ReglaNegocioException(
                            "Ya existe otra filial con el código: "
                                    + filial.getCodigo()
                    );
                });

        existente.setCodigo(filial.getCodigo());
        existente.setNombre(filial.getNombre());
        existente.setPais(filial.getPais());
        existente.setCiudad(filial.getCiudad());
        existente.setActiva(filial.isActiva());

        return filialRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        Filial filial = buscarPorId(id);
        filialRepository.delete(filial);
    }
}