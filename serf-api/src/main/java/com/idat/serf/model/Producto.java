package com.idat.serf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código del producto es obligatorio")
    @Size(max = 30)
    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String nombre;

    @Size(max = 255)
    @Column(length = 255)
    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoriaProducto categoria;

    @NotNull(message = "El costo de importación es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal costoImportacion;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precioVenta;

    @NotBlank(message = "El proveedor es obligatorio")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String proveedor;

    @NotNull(message = "La fecha de importación es obligatoria")
    @Column(nullable = false)
    private LocalDate fechaImportacion;

    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private int stock;

    @NotNull(message = "La filial es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "filial_id", nullable = false)
    private Filial filial;

    public Producto() {
    }

    public Producto(
            String codigo,
            String nombre,
            String descripcion,
            CategoriaProducto categoria,
            BigDecimal costoImportacion,
            BigDecimal precioVenta,
            String proveedor,
            LocalDate fechaImportacion,
            int stock,
            Filial filial
    ) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.costoImportacion = costoImportacion;
        this.precioVenta = precioVenta;
        this.proveedor = proveedor;
        this.fechaImportacion = fechaImportacion;
        this.stock = stock;
        this.filial = filial;
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

    public Filial getFilial() {
        return filial;
    }

    public void setFilial(Filial filial) {
        this.filial = filial;
    }
}