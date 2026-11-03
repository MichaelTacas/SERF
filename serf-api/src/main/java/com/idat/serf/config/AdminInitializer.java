package com.idat.serf.config;

import com.idat.serf.model.RolUsuario;
import com.idat.serf.model.Usuario;
import com.idat.serf.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger =
            LoggerFactory.getLogger(AdminInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@grzasociados.com}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    public AdminInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (adminPassword == null || adminPassword.isBlank()) {

            logger.warn(
                    "ADMIN_PASSWORD no configurada. "
                            + "No se creará el administrador inicial."
            );

            return;
        }

        String email = adminEmail
                .trim()
                .toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {

            logger.info(
                    "El administrador inicial ya existe: {}",
                    email
            );

            return;
        }

        Usuario usuario = new Usuario();

        usuario.setEmail(email);

        usuario.setPasswordHash(
                passwordEncoder.encode(adminPassword)
        );

        usuario.setRol(
                RolUsuario.ADMINISTRADOR
        );

        usuario.setActivo(true);

        usuarioRepository.save(usuario);

        logger.info(
                "Administrador inicial creado correctamente: {}",
                email
        );
    }
}