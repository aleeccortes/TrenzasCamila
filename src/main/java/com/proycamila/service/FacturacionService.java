package com.proycamila.service;

import com.proycamila.dto.ReporteFacturacionResponse;
import com.proycamila.exception.BusinessException;
import com.proycamila.model.EstadoPago;
import com.proycamila.model.EstadoReserva;
import com.proycamila.model.Reserva;
import com.proycamila.repository.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FacturacionService {
    private final ReservaRepository reservaRepository;

    public FacturacionService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Transactional(readOnly = true)
    public ReporteFacturacionResponse obtenerReporteMensual(int anio, int mes) {
        if (anio < 2020 || anio > 2100) throw new BusinessException("El año ingresado no es válido");
        if (mes < 1 || mes > 12) throw new BusinessException("El mes debe estar entre 1 y 12");

        YearMonth yearMonth = YearMonth.of(anio, mes);
        LocalDate inicio = yearMonth.atDay(1);
        LocalDate fin = yearMonth.atEndOfMonth();

        List<Reserva> reservasMes = reservaRepository.findByFechaReservaBetweenOrderByFechaReservaAsc(inicio, fin);

        long totalReservas = reservasMes.size();
        long completadas = reservasMes.stream().filter(r -> r.getEstado() == EstadoReserva.COMPLETADA).count();
        long pendientes = reservasMes.stream().filter(r -> r.getEstado() == EstadoReserva.PENDIENTE || r.getEstado() == EstadoReserva.CONFIRMADA).count();
        long canceladas = reservasMes.stream().filter(r -> r.getEstado() == EstadoReserva.CANCELADA).count();

        BigDecimal totalCobrado = reservasMes.stream()
                .filter(r -> r.getEstadoPago() == EstadoPago.PAGADO && r.getEstado() != EstadoReserva.CANCELADA)
                .map(Reserva::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendienteCobro = reservasMes.stream()
                .filter(r -> r.getEstadoPago() == EstadoPago.PENDIENTE && r.getEstado() != EstadoReserva.CANCELADA)
                .map(Reserva::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalEstimadoMes = totalCobrado.add(totalPendienteCobro);

        Map<String, Long> desglosePorServicio = reservasMes.stream()
                .filter(r -> r.getEstado() != EstadoReserva.CANCELADA)
                .collect(Collectors.groupingBy(Reserva::getTipoTrenza, Collectors.counting()));

        return new ReporteFacturacionResponse(
                anio,
                mes,
                totalReservas,
                completadas,
                pendientes,
                canceladas,
                totalCobrado,
                totalPendienteCobro,
                totalEstimadoMes,
                desglosePorServicio
        );
    }
}
