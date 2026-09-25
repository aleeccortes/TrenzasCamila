package com.proycamila.controller;

import com.proycamila.dto.ServicioTrenzaRequest;
import com.proycamila.dto.ServicioTrenzaResponse;
import com.proycamila.service.ServicioTrenzaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioTrenzaController {
    private final ServicioTrenzaService servicio;

    public ServicioTrenzaController(ServicioTrenzaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<ServicioTrenzaResponse> listarServiciosActivos() {
        return servicio.listarServiciosActivos();
    }

    @GetMapping("/admin")
    public List<ServicioTrenzaResponse> listarTodosLosServicios() {
        return servicio.listarTodosLosServicios();
    }

    @GetMapping("/{id}")
    public ServicioTrenzaResponse buscarPorId(@PathVariable Long id) {
        return servicio.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServicioTrenzaResponse crearServicio(@Valid @RequestBody ServicioTrenzaRequest request) {
        return servicio.crearServicio(request);
    }

    @PutMapping("/{id}")
    public ServicioTrenzaResponse actualizarServicio(@PathVariable Long id, @Valid @RequestBody ServicioTrenzaRequest request) {
        return servicio.actualizarServicio(id, request);
    }

    @PutMapping("/{id}/desactivar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivarServicio(@PathVariable Long id) {
        servicio.desactivarServicio(id);
    }

    @PutMapping("/{id}/activar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activarServicio(@PathVariable Long id) {
        servicio.activarServicio(id);
    }
}
