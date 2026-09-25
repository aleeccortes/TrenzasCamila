package com.proycamila.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas", indexes = {
        @Index(name = "idx_reserva_fecha", columnList = "fecha_reserva"),
        @Index(name = "idx_reserva_telefono", columnList = "telefono")
})
public class Reserva {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 25)
    private String telefono;

    @Column(length = 100)
    private String email;

    @Column(name = "fecha_reserva", nullable = false)
    private LocalDate fechaReserva;

    @Column(name = "tipo_trenza", nullable = false, length = 120)
    private String tipoTrenza;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReserva estado = EstadoReserva.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false, length = 20)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    @Column(name = "recordatorio_enviado", nullable = false)
    private Boolean recordatorioEnviado = false;

    @Column(name = "creada_en", nullable = false, updatable = false)
    private LocalDateTime creadaEn;

    protected Reserva() {}

    public Reserva(String nombre, String telefono, String email, LocalDate fechaReserva, String tipoTrenza, BigDecimal precio) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.fechaReserva = fechaReserva;
        this.tipoTrenza = tipoTrenza;
        this.precio = precio != null ? precio : BigDecimal.ZERO;
        this.estado = EstadoReserva.PENDIENTE;
        this.estadoPago = EstadoPago.PENDIENTE;
        this.recordatorioEnviado = false;
        this.creadaEn = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTelefono() { return telefono; }
    public String getEmail() { return email; }
    public LocalDate getFechaReserva() { return fechaReserva; }
    public String getTipoTrenza() { return tipoTrenza; }
    public BigDecimal getPrecio() { return precio; }
    public EstadoReserva getEstado() { return estado; }
    public EstadoPago getEstadoPago() { return estadoPago; }
    public Boolean getRecordatorioEnviado() { return recordatorioEnviado; }
    public LocalDateTime getCreadaEn() { return creadaEn; }

    public void setEstado(EstadoReserva estado) { this.estado = estado; }
    public void setEstadoPago(EstadoPago estadoPago) { this.estadoPago = estadoPago; }
    public void setRecordatorioEnviado(Boolean recordatorioEnviado) { this.recordatorioEnviado = recordatorioEnviado; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}
