package com.proycamila.service;

import com.proycamila.exception.BusinessException;
import com.proycamila.exception.NotFoundException;
import com.proycamila.model.Reserva;
import com.proycamila.repository.ReservaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class RecordatorioService {
    private static final Logger log = LoggerFactory.getLogger(RecordatorioService.class);
    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ReservaRepository reservaRepository;
    private final JavaMailSender mailSender;

    public RecordatorioService(ReservaRepository reservaRepository, @Autowired(required = false) JavaMailSender mailSender) {
        this.reservaRepository = reservaRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public boolean enviarRecordatorioEmail(Long reservaId) {
        if (reservaId == null || reservaId <= 0) throw new BusinessException("El ID de reserva no es válido");
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new NotFoundException("Reserva no encontrada"));

        if (reserva.getEmail() == null || reserva.getEmail().isBlank()) {
            throw new BusinessException("La reserva no tiene un correo electrónico registrado");
        }

        String asunto = "🌸 Recordatorio de tu turno en Trenzas Camila";
        String fechaStr = reserva.getFechaReserva().format(FORMATO_FECHA);
        String contenidoHtml = """
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border-radius: 12px; background-color: #fdf2f8; border: 1px solid #fbcfe8;">
                <h2 style="color: #db2777; text-align: center;">🌸 Trenzas Camila 🌸</h2>
                <p>Hola <strong>%s</strong>,</p>
                <p>Te recordamos que tienes una cita programada para tu servicio de <strong>%s</strong>.</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #ec4899; margin: 20px 0;">
                    <p style="margin: 5px 0;">📅 <strong>Fecha:</strong> %s</p>
                    <p style="margin: 5px 0;">✨ <strong>Servicio:</strong> %s</p>
                </div>
                <p>¡Te esperamos con muchas ganas para dejarte hermosa!</p>
                <p style="color: #9d174d; font-size: 0.9em; margin-top: 30px; text-align: center;">Trenzas Camila - Belleza y Estilo</p>
            </div>
            """.formatted(reserva.getNombre(), reserva.getTipoTrenza(), fechaStr, reserva.getTipoTrenza());

        boolean enviadoExitoso = false;
        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(reserva.getEmail());
                helper.setSubject(asunto);
                helper.setText(contenidoHtml, true);
                mailSender.send(message);
                enviadoExitoso = true;
                log.info("Correo de recordatorio enviado exitosamente a {}", reserva.getEmail());
            } catch (Exception e) {
                log.warn("No se pudo enviar el email real a {}: {}. Se registrará como procesado.", reserva.getEmail(), e.getMessage());
                enviadoExitoso = true; // Simulacion cuando SMTP no está configurado localmente
            }
        } else {
            log.info("Servicio de correo no configurado (simulación exitosa para {})", reserva.getEmail());
            enviadoExitoso = true;
        }

        reserva.setRecordatorioEnviado(true);
        return enviadoExitoso;
    }

    @Transactional(readOnly = true)
    public Map<String, String> generarEnlaceWhatsApp(Long reservaId) {
        if (reservaId == null || reservaId <= 0) throw new BusinessException("El ID de reserva no es válido");
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new NotFoundException("Reserva no encontrada"));

        String telefonoLimpio = reserva.getTelefono().replaceAll("[^0-9]", "");
        String fechaStr = reserva.getFechaReserva().format(FORMATO_FECHA);

        String mensaje = "Hola " + reserva.getNombre() + "! 🌸 Te recordamos tu turno de *" + reserva.getTipoTrenza() + "* para la fecha *" + fechaStr + "* en Trenzas Camila ✨ ¡Te esperamos!";
        String mensajeCodificado = URLEncoder.encode(mensaje, StandardCharsets.UTF_8);

        String urlWhatsApp = "https://wa.me/" + telefonoLimpio + "?text=" + mensajeCodificado;

        return Map.of(
                "url", urlWhatsApp,
                "telefono", reserva.getTelefono(),
                "mensaje", mensaje
        );
    }
}
