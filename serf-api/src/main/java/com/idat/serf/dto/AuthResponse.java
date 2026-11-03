package com.idat.serf.dto;

import com.idat.serf.model.RolUsuario;

public record AuthResponse(

        String token,
        String tipo,
        long expiraEnSegundos,
        Long usuarioId,
        String email,
        RolUsuario rol

) {
}