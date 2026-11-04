package com.idat.serf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "filiales")
public class Filial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código de la filial es obligatorio")
    @Size(max = 20)
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @NotBlank(message = "El nombre de la filial es obligatorio")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El país es obligatorio")
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String pais;

    @Size(max = 80)
    @Column(length = 80)
    private String ciudad;

    @NotNull(message = "La moneda local es obligatoria")
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Moneda monedaLocal;

    @Column(nullable = false)
    private boolean activa = true;

    public Filial() {
    }

    public Filial(
            String codigo,
            String nombre,
            String pais,
            String ciudad,
            Moneda monedaLocal
    ) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.pais = pais;
        this.ciudad = ciudad;
        this.monedaLocal = monedaLocal;
        this.activa = true;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public Moneda getMonedaLocal() {
        return monedaLocal;
    }

    public void setMonedaLocal(Moneda monedaLocal) {
        this.monedaLocal = monedaLocal;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }
}