package com.idat.serf.dto;

import com.idat.serf.model.Moneda;

public class FilialResponse {

    private Long id;
    private String codigo;
    private String nombre;
    private String pais;
    private String ciudad;
    private Moneda monedaLocal;
    private boolean activa;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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