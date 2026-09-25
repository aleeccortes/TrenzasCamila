package com.proycamila.controller;

import com.proycamila.dto.ReporteFacturacionResponse;
import com.proycamila.service.FacturacionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/facturacion")
public class FacturacionController {
    private final FacturacionService facturacionService;

    public FacturacionController(FacturacionService facturacionService) {
        this.facturacionService = facturacionService;
    }

    @GetMapping("/mensual")
    public ReporteFacturacionResponse obtenerFacturacionMensual(
            @RequestParam(required = false) Integer anio,
            @RequestParam(required = false) Integer mes) {
        LocalDate hoy = LocalDate.now();
        int anioConsulta = (anio != null) ? anio : hoy.getYear();
        int mesConsulta = (mes != null) ? mes : hoy.getMonthValue();
        return facturacionService.obtenerReporteMensual(anioConsulta, mesConsulta);
    }
}
