package com.idat.serf.dto;

import com.idat.serf.model.CategoriaProducto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductoResponse {

    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private CategoriaProducto categoria;
    private BigDecimal costoImportacion;
    private BigDecimal precioVenta;
    private String proveedor;
    private LocalDate fechaImportacion;
    private int stock;

    private Long filialId;
    private String filialNombre;

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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public CategoriaProducto getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaProducto categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getCostoImportacion() {
        return costoImportacion;
    }

    public void setCostoImportacion(BigDecimal costoImportacion) {
        this.costoImportacion = costoImportacion;
    }

    public BigDecimal getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(BigDecimal precioVenta) {
        this.precioVenta = precioVenta;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public LocalDate getFechaImportacion() {
        return fechaImportacion;
    }

    public void setFechaImportacion(LocalDate fechaImportacion) {
        this.fechaImportacion = fechaImportacion;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public Long getFilialId() {
        return filialId;
    }

    public void setFilialId(Long filialId) {
        this.filialId = filialId;
    }

    public String getFilialNombre() {
        return filialNombre;
    }

    public void setFilialNombre(String filialNombre) {
        this.filialNombre = filialNombre;
    }
}