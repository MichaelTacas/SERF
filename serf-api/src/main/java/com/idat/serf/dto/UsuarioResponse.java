package com.idat.serf.dto;

import com.idat.serf.model.RolUsuario;

public record UsuarioResponse(
        Long id,
        String email,
        RolUsuario rol,
        boolean activo
) {
}