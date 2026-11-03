package com.idat.serf.dto;

import com.idat.serf.model.CategoriaProducto;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductoRequest {

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private CategoriaProducto categoria;

    @NotNull(message = "El costo de importación es obligatorio")
    @DecimalMin(value = "0.0")
    private BigDecimal costoImportacion;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.0")
    private BigDecimal precioVenta;

    @NotBlank(message = "El proveedor es obligatorio")
    private String proveedor;

    @NotNull(message = "La fecha de importación es obligatoria")
    private LocalDate fechaImportacion;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private int stock;

    @NotNull(message = "La filial es obligatoria")
    private Long filialId;

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
}