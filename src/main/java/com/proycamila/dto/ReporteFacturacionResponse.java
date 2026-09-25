package com.proycamila.dto;

import java.math.BigDecimal;
import java.util.Map;

public record ReporteFacturacionResponse(
    int anio,
    int mes,
    long totalReservas,
    long reservasCompletadas,
    long reservasPendientes,
    long reservasCanceladas,
    BigDecimal totalFacturadoCobrado,
    BigDecimal totalPendienteCobro,
    BigDecimal totalEstimadoMes,
    Map<String, Long> desglosePorServicio
) {}
