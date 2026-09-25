package com.proycamila.service;

import com.proycamila.dto.ServicioTrenzaRequest;
import com.proycamila.dto.ServicioTrenzaResponse;
import com.proycamila.exception.BusinessException;
import com.proycamila.exception.NotFoundException;
import com.proycamila.model.ServicioTrenza;
import com.proycamila.repository.ServicioTrenzaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ServicioTrenzaService {
    private final ServicioTrenzaRepository repository;

    public ServicioTrenzaService(ServicioTrenzaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ServicioTrenzaResponse> listarServiciosActivos() {
        return repository.findByActivoTrueOrderByNombreAsc()
                .stream()
                .map(ServicioTrenzaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServicioTrenzaResponse> listarTodosLosServicios() {
        return repository.findAllByOrderByNombreAsc()
                .stream()
                .map(ServicioTrenzaResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServicioTrenzaResponse buscarPorId(Long id) {
        if (id == null || id <= 0) throw new BusinessException("El identificador del servicio no es válido");
        ServicioTrenza servicio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servicio de trenza no encontrado"));
        return ServicioTrenzaResponse.desde(servicio);
    }

    @Transactional
    public ServicioTrenzaResponse crearServicio(ServicioTrenzaRequest request) {
        if (request == null) throw new BusinessException("Los datos del servicio son obligatorios");
        String nombre = request.nombre().trim();
        if (repository.existsByNombreIgnoreCase(nombre)) {
            throw new BusinessException("Ya existe un servicio de trenza registrado con ese nombre");
        }
        ServicioTrenza nuevo = new ServicioTrenza(
                nombre,
                request.descripcion() != null ? request.descripcion().trim() : "",
                request.precio(),
                request.imagenUrl() != null ? request.imagenUrl().trim() : "",
                request.duracionMinutos()
        );
        return ServicioTrenzaResponse.desde(repository.save(nuevo));
    }

    @Transactional
    public ServicioTrenzaResponse actualizarServicio(Long id, ServicioTrenzaRequest request) {
        if (id == null || id <= 0) throw new BusinessException("El identificador no es válido");
        ServicioTrenza servicio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servicio de trenza no encontrado"));

        String nombre = request.nombre().trim();
        if (!servicio.getNombre().equalsIgnoreCase(nombre) && repository.existsByNombreIgnoreCase(nombre)) {
            throw new BusinessException("Ya existe otro servicio registrado con ese nombre");
        }

        servicio.setNombre(nombre);
        servicio.setDescripcion(request.descripcion() != null ? request.descripcion().trim() : "");
        servicio.setPrecio(request.precio());
        servicio.setImagenUrl(request.imagenUrl() != null ? request.imagenUrl().trim() : "");
        if (request.duracionMinutos() != null) {
            servicio.setDuracionMinutos(request.duracionMinutos());
        }

        return ServicioTrenzaResponse.desde(servicio);
    }

    @Transactional
    public void desactivarServicio(Long id) {
        if (id == null || id <= 0) throw new BusinessException("El identificador no es válido");
        ServicioTrenza servicio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servicio de trenza no encontrado"));
        servicio.setActivo(false);
    }

    @Transactional
    public void activarServicio(Long id) {
        if (id == null || id <= 0) throw new BusinessException("El identificador no es válido");
        ServicioTrenza servicio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servicio de trenza no encontrado"));
        servicio.setActivo(true);
    }
}
