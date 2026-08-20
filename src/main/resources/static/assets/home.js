const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('#booking-status');
const dateInput = bookingForm.elements.fechaReserva;
const today = new Date();
dateInput.min = today.toISOString().slice(0, 10);
const maxDate = new Date(today); maxDate.setFullYear(maxDate.getFullYear() + 1);
dateInput.max = maxDate.toISOString().slice(0, 10);

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const button = bookingForm.querySelector('button'); button.disabled = true;
  setStatus(bookingStatus, 'Enviando...');
  try {
    const values = Object.fromEntries(new FormData(bookingForm));
    await api('/api/reservas', { method: 'POST', body: JSON.stringify(values) });
    bookingForm.reset(); dateInput.min = today.toISOString().slice(0, 10);
    setStatus(bookingStatus, 'Solicitud recibida. Te contactaremos pronto.', 'success');
  } catch (error) { setStatus(bookingStatus, error.message, 'error'); }
  finally { button.disabled = false; }
});
