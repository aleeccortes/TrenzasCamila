package com.proycamila.model;

import jakarta.persistence.*;
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
    @Column(nullable = false, length = 80) private String nombre;
    @Column(nullable = false, length = 25) private String telefono;
    @Column(name = "fecha_reserva", nullable = false) private LocalDate fechaReserva;
    @Column(nullable = false, length = 120) private String tipoTrenza;
    @Column(name = "creada_en", nullable = false, updatable = false) private LocalDateTime creadaEn;

    protected Reserva() {}

    public Reserva(String nombre, String telefono, LocalDate fechaReserva, String tipoTrenza) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.fechaReserva = fechaReserva;
        this.tipoTrenza = tipoTrenza;
        this.creadaEn = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTelefono() { return telefono; }
    public LocalDate getFechaReserva() { return fechaReserva; }
    public String getTipoTrenza() { return tipoTrenza; }
    public LocalDateTime getCreadaEn() { return creadaEn; }
}
