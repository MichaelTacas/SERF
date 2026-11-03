package com.idat.serf.service;

import com.idat.serf.model.Venta;

import java.util.List;

public interface VentaService {

    Venta registrar(Venta venta);

    List<Venta> listar();

    Venta buscarPorId(Long id);

    List<Venta> listarPorFilial(Long filialId);
}