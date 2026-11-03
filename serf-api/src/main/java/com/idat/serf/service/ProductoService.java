package com.idat.serf.service;

import com.idat.serf.model.Producto;

import java.util.List;

public interface ProductoService {

    Producto crear(Producto producto);

    List<Producto> listar();

    Producto buscarPorId(Long id);

    List<Producto> listarPorFilial(Long filialId);

    Producto actualizar(Long id, Producto producto);

    void eliminar(Long id);
}