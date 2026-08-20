package com.proycamila.controller;

import com.proycamila.dto.ReservaRequest;
import com.proycamila.dto.ReservaResponse;
import com.proycamila.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {
    private final ReservaService service;
    public ReservaController(ReservaService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<ReservaResponse> crear(@Valid @RequestBody ReservaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }
    @GetMapping public List<ReservaResponse> listar() { return service.listar(); }
    @GetMapping("/fecha") public List<ReservaResponse> porFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return service.buscarPorFecha(fecha);
    }
    @GetMapping("/telefono") public List<ReservaResponse> porTelefono(@RequestParam String telefono) {
        return service.buscarPorTelefono(telefono);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}
