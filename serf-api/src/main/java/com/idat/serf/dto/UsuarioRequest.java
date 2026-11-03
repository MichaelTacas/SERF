package com.idat.serf.dto;

import com.idat.serf.model.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(
                min = 8,
                max = 64,
                message = "La contraseña debe tener entre 8 y 64 caracteres"
        )
        String password,

        @NotNull(message = "El rol es obligatorio")
        RolUsuario rol

) {
}