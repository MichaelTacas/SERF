package com.idat.serf.service;

import com.idat.serf.model.Cliente;

import java.util.List;

public interface ClienteService {

    Cliente registrar(Cliente cliente);

    List<Cliente> listar();

    Cliente buscarPorId(Long id);

    Cliente actualizar(Long id, Cliente cliente);

    void eliminar(Long id);
}