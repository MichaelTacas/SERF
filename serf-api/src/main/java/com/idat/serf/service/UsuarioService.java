package com.idat.serf.service;

import com.idat.serf.dto.UsuarioRequest;
import com.idat.serf.dto.UsuarioResponse;
import com.idat.serf.model.Usuario;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crear(UsuarioRequest request);

    List<UsuarioResponse> listar();

    Usuario buscarPorId(Long id);

}

