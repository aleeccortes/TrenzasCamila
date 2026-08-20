package com.proycamila.service;

import com.proycamila.dto.ReservaRequest;
import com.proycamila.exception.BusinessException;
import com.proycamila.repository.ReservaRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservaServiceTest {
    @Mock ReservaRepository repository;
    ReservaService service;
    AutoCloseable mocks;

    @BeforeEach void setUp() { mocks = MockitoAnnotations.openMocks(this); service = new ReservaService(repository); }
    @AfterEach void tearDown() throws Exception { mocks.close(); }

    @Test void rechazaTelefonoInvalido() {
        ReservaRequest request = new ReservaRequest("Camila", "abc", LocalDate.now().plusDays(1), "Box braids");
        assertThatThrownBy(() -> service.crear(request)).isInstanceOf(BusinessException.class).hasMessageContaining("telefono");
        verifyNoInteractions(repository);
    }

    @Test void evitaReservaDuplicadaParaTelefonoYFecha() {
        LocalDate fecha = LocalDate.now().plusDays(1);
        when(repository.existsByTelefonoAndFechaReserva("+5492615551111", fecha)).thenReturn(true);
        ReservaRequest request = new ReservaRequest("  Ana   Perez ", "+54 9 261 555-1111", fecha, " Box braids ");
        assertThatThrownBy(() -> service.crear(request)).isInstanceOf(BusinessException.class).hasMessageContaining("Ya existe");
        verify(repository, never()).save(any());
    }

    @Test void rechazaFechasConMasDeUnAnio() {
        ReservaRequest request = new ReservaRequest("Ana Perez", "2615551111", LocalDate.now().plusYears(1).plusDays(1), "Box braids");
        assertThatThrownBy(() -> service.crear(request)).isInstanceOf(BusinessException.class).hasMessageContaining("anticipacion");
    }

    @Test void serviceRechazaNombreAunqueNoPasePorController() {
        ReservaRequest request = new ReservaRequest("<script>", "2615551111", LocalDate.now().plusDays(1), "Box braids");
        assertThatThrownBy(() -> service.crear(request)).isInstanceOf(BusinessException.class).hasMessageContaining("nombre");
    }

    @Test void permiteBuscarPorParteDelTelefono() {
        service.buscarPorTelefono("5551");
        verify(repository).findByTelefonoContainingOrderByCreadaEnDesc("5551");
    }
}
