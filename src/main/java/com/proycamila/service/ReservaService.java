package com.proycamila.service;

import com.proycamila.dto.ReservaRequest;
import com.proycamila.dto.ReservaResponse;
import com.proycamila.exception.BusinessException;
import com.proycamila.exception.NotFoundException;
import com.proycamila.model.Reserva;
import com.proycamila.repository.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservaService {
    private final ReservaRepository repository;
    private final Clock clock = Clock.systemDefaultZone();

    public ReservaService(ReservaRepository repository) { this.repository = repository; }

    @Transactional
    public ReservaResponse crear(ReservaRequest request) {
        if (request == null) throw new BusinessException("Los datos de la reserva son obligatorios");
        String nombre = limpiarEspacios(request.nombre());
        String telefono = normalizarTelefono(request.telefono());
        String tipoTrenza = limpiarEspacios(request.tipoTrenza());
        LocalDate hoy = LocalDate.now(clock);

        if (nombre.length() < 2 || nombre.length() > 80 || !nombre.matches("^[\\p{L} .'-]+$")) {
            throw new BusinessException("El nombre debe tener entre 2 y 80 caracteres validos");
        }
        if (tipoTrenza.length() < 3 || tipoTrenza.length() > 120) {
            throw new BusinessException("El tipo de trenza debe tener entre 3 y 120 caracteres");
        }
        if (request.fechaReserva() == null || request.fechaReserva().isBefore(hoy)) {
            throw new BusinessException("La fecha no puede estar vacia ni en el pasado");
        }
        if (request.fechaReserva().isAfter(hoy.plusYears(1))) {
            throw new BusinessException("La reserva no puede programarse con mas de un anio de anticipacion");
        }
        if (repository.existsByTelefonoAndFechaReserva(telefono, request.fechaReserva())) {
            throw new BusinessException("Ya existe una reserva para ese telefono en la fecha indicada");
        }
        return ReservaResponse.from(repository.save(new Reserva(nombre, telefono, request.fechaReserva(), tipoTrenza)));
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> listar() {
        return repository.findAllByOrderByCreadaEnDesc().stream().map(ReservaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> buscarPorFecha(LocalDate fecha) {
        if (fecha == null) throw new BusinessException("La fecha es obligatoria");
        return repository.findByFechaReservaOrderByCreadaEnDesc(fecha).stream().map(ReservaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ReservaResponse> buscarPorTelefono(String telefono) {
        String normalizado = normalizarBusquedaTelefono(telefono);
        return repository.findByTelefonoContainingOrderByCreadaEnDesc(normalizado).stream().map(ReservaResponse::from).toList();
    }

    @Transactional
    public void eliminar(Long id) {
        if (id == null || id <= 0) throw new BusinessException("El identificador no es valido");
        Reserva reserva = repository.findById(id).orElseThrow(() -> new NotFoundException("Reserva no encontrada"));
        repository.delete(reserva);
    }

    private String limpiarEspacios(String valor) {
        return valor == null ? "" : valor.trim().replaceAll("\\s+", " ");
    }

    private String normalizarTelefono(String valor) {
        if (valor == null) return "";
        String normalizado = valor.trim().replaceAll("[\\s()-]", "");
        if (!normalizado.matches("\\+?\\d{8,15}")) {
            throw new BusinessException("El telefono debe contener entre 8 y 15 digitos");
        }
        return normalizado;
    }

    private String normalizarBusquedaTelefono(String valor) {
        if (valor == null) throw new BusinessException("El telefono es obligatorio");
        String normalizado = valor.trim().replaceAll("[\\s()+-]", "");
        if (!normalizado.matches("\\d{4,15}")) {
            throw new BusinessException("Ingresa entre 4 y 15 digitos para buscar");
        }
        return normalizado;
    }
}
