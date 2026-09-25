package com.proycamila.controller;

import com.proycamila.service.RecordatorioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recordatorios")
public class RecordatorioController {
    private final RecordatorioService recordatorioService;

    public RecordatorioController(RecordatorioService recordatorioService) {
        this.recordatorioService = recordatorioService;
    }

    @PostMapping("/email/{reservaId}")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> enviarEmail(@PathVariable Long reservaId) {
        boolean enviado = recordatorioService.enviarRecordatorioEmail(reservaId);
        return Map.of("exito", enviado, "mensaje", "Recordatorio de correo electrónico procesado correctamente");
    }

    @GetMapping("/whatsapp/{reservaId}")
    public Map<String, String> obtenerLinkWhatsApp(@PathVariable Long reservaId) {
        return recordatorioService.generarEnlaceWhatsApp(reservaId);
    }
}
