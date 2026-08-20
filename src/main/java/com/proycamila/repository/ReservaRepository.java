package com.proycamila.repository;

import com.proycamila.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByFechaReservaOrderByCreadaEnDesc(LocalDate fecha);
    List<Reserva> findByTelefonoContainingOrderByCreadaEnDesc(String telefono);
    List<Reserva> findAllByOrderByCreadaEnDesc();
    boolean existsByTelefonoAndFechaReserva(String telefono, LocalDate fechaReserva);
}
