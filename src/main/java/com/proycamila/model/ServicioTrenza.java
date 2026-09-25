package com.proycamila.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios_trenza")
public class ServicioTrenza {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "duracion_minutos", nullable = false)
    private Integer duracionMinutos = 120;

    @Column(nullable = false)
    private Boolean activo = true;

    protected ServicioTrenza() {}

    public ServicioTrenza(String nombre, String descripcion, BigDecimal precio, String imagenUrl, Integer duracionMinutos) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.duracionMinutos = duracionMinutos != null ? duracionMinutos : 120;
        this.activo = true;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public String getImagenUrl() { return imagenUrl; }
    public Integer getDuracionMinutos() { return duracionMinutos; }
    public Boolean getActivo() { return activo; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public void setDuracionMinutos(Integer duracionMinutos) { this.duracionMinutos = duracionMinutos; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
