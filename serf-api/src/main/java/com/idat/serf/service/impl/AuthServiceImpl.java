package com.idat.serf.service.impl;

import com.idat.serf.dto.AuthResponse;
import com.idat.serf.dto.LoginRequest;
import com.idat.serf.exception.AutenticacionException;
import com.idat.serf.model.Usuario;
import com.idat.serf.repository.UsuarioRepository;
import com.idat.serf.security.JwtService;
import com.idat.serf.service.AuthService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        String email = request
                .email()
                .trim()
                .toLowerCase(Locale.ROOT);

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            request.password()
                    )
            );

        } catch (AuthenticationException exception) {

            throw new AutenticacionException(
                    "Correo o contraseña incorrectos"
            );
        }

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new AutenticacionException(
                                "Usuario no encontrado"
                        )
                );

        String token =
                jwtService.generarToken(usuario);

        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}