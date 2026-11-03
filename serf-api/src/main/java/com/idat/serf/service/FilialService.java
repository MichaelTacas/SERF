package com.idat.serf.service;

import com.idat.serf.model.Filial;

import java.util.List;

public interface FilialService {

    Filial crear(Filial filial);

    List<Filial> listar();

    Filial buscarPorId(Long id);

    Filial actualizar(Long id, Filial filial);

    void eliminar(Long id);
}