package com.proycamila.repository;

import com.proycamila.model.ServicioTrenza;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioTrenzaRepository extends JpaRepository<ServicioTrenza, Long> {
    List<ServicioTrenza> findByActivoTrueOrderByNombreAsc();
    List<ServicioTrenza> findAllByOrderByNombreAsc();
    boolean existsByNombreIgnoreCase(String nombre);
}
