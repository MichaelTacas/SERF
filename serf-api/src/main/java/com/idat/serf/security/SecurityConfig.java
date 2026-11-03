package com.idat.serf.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // LOGIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        ).permitAll()

                        // SWAGGER
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // =====================================
                        // USUARIOS - SOLO ADMINISTRADOR
                        // =====================================
                        .requestMatchers(
                                "/api/usuarios/**"
                        ).hasRole("ADMINISTRADOR")

                        // =====================================
                        // FILIALES - SOLO ADMINISTRADOR
                        // =====================================
                        .requestMatchers(
                                "/api/filiales/**"
                        ).hasRole("ADMINISTRADOR")

                        // =====================================
                        // CLIENTES
                        // =====================================

                        // Administrador y vendedor pueden consultar
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/clientes/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VENDEDOR"
                        )

                        // Administrador y vendedor pueden registrar
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/clientes/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VENDEDOR"
                        )

                        // Administrador y vendedor pueden editar
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/clientes/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VENDEDOR"
                        )

                        // Solo administrador puede eliminar
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/clientes/**"
                        ).hasRole("ADMINISTRADOR")

                        // =====================================
                        // PRODUCTOS
                        // =====================================

                        // Ambos pueden consultar
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/productos/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VENDEDOR"
                        )

                        // Solo administrador modifica inventario
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/productos/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/productos/**"
                        ).hasRole("ADMINISTRADOR")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/productos/**"
                        ).hasRole("ADMINISTRADOR")

                        // =====================================
                        // VENTAS
                        // =====================================

                        // Administrador y vendedor pueden consultar
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/ventas/**"
                        ).hasAnyRole(
                                "ADMINISTRADOR",
                                "VENDEDOR"
                        )

                        // Solo vendedor registra ventas
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/ventas/**"
                        ).hasRole("VENDEDOR")

                        // =====================================
                        // REPORTES - SOLO ADMINISTRADOR
                        // =====================================
                        .requestMatchers(
                                "/api/reportes/**"
                        ).hasRole("ADMINISTRADOR")

                        // Cualquier endpoint API no definido
                        .requestMatchers(
                                "/api/**"
                        ).denyAll()

                        .anyRequest().permitAll()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        jwtAuthenticationConverter
                                )
                        )
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(provider);
    }

    @Bean
    public SecretKey jwtSecretKey(
            @Value("${app.jwt.secret}")
            String secretBase64
    ) {

        byte[] keyBytes;

        try {
            keyBytes = Base64
                    .getDecoder()
                    .decode(secretBase64);

        } catch (IllegalArgumentException exception) {

            throw new IllegalStateException(
                    "JWT_SECRET debe estar codificado en Base64",
                    exception
            );
        }

        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET debe tener como mínimo 32 bytes"
            );
        }

        return new SecretKeySpec(
                keyBytes,
                "HmacSHA256"
        );
    }

    @Bean
    public JwtEncoder jwtEncoder(
            SecretKey secretKey
    ) {

        return NimbusJwtEncoder
                .withSecretKey(secretKey)
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey secretKey,
            @Value("${app.jwt.issuer:serf-api}")
            String issuer
    ) {

        NimbusJwtDecoder decoder =
                NimbusJwtDecoder
                        .withSecretKey(secretKey)
                        .macAlgorithm(MacAlgorithm.HS256)
                        .build();

        decoder.setJwtValidator(
                JwtValidators
                        .createDefaultWithIssuer(issuer)
        );

        return decoder;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter authenticationConverter =
                new JwtAuthenticationConverter();

        authenticationConverter.setJwtGrantedAuthoritiesConverter(
                authoritiesConverter
        );

        return authenticationConverter;
    }
}