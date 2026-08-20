const table = document.querySelector('#reservations-table');
const tbody = table.querySelector('tbody');
const loading = document.querySelector('#loading');
const empty = document.querySelector('#empty');
const newDialog = document.querySelector('#new-dialog');
const passwordDialog = document.querySelector('#password-dialog');
const deleteDialog = document.querySelector('#delete-dialog');
const toast = document.querySelector('#toast');
let pendingDelete = null;

function textCell(row, value) {
  const cell = row.insertCell();
  cell.textContent = value ?? '';
  return cell;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' })
    .format(new Date(`${value}T00:00:00Z`));
}

function notify(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast visible ${type}`;
  window.clearTimeout(notify.timeout);
  notify.timeout = window.setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function updateSummary(reservations) {
  const today = new Date().toISOString().slice(0, 10);
  document.querySelector('#reservation-count').textContent = reservations.length;
  document.querySelector('#upcoming-count').textContent = reservations.filter((item) => item.fechaReserva >= today).length;
}

function render(reservations, updateCounters = true) {
  tbody.replaceChildren();
  loading.classList.add('hidden');
  table.classList.toggle('hidden', reservations.length === 0);
  empty.classList.toggle('hidden', reservations.length !== 0);
  if (updateCounters) updateSummary(reservations);

  reservations.forEach((reservation) => {
    const row = tbody.insertRow();
    const nameCell = textCell(row, reservation.nombre);
    nameCell.dataset.label = 'Cliente';
    nameCell.className = 'client-cell';
    const phoneCell = textCell(row, reservation.telefono); phoneCell.dataset.label = 'Contacto';
    const dateCell = textCell(row, formatDate(reservation.fechaReserva)); dateCell.dataset.label = 'Fecha';
    const styleCell = textCell(row, reservation.tipoTrenza); styleCell.dataset.label = 'Estilo';
    const action = row.insertCell(); action.className = 'action-cell';
    const button = document.createElement('button');
    button.className = 'delete-button';
    button.type = 'button';
    button.textContent = 'Eliminar';
    button.addEventListener('click', () => openDelete(reservation));
    action.append(button);
  });
}

async function load(url = '/api/reservas', updateCounters = true) {
  loading.textContent = 'Cargando reservas...';
  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  table.classList.add('hidden');
  try { render(await api(url), updateCounters); }
  catch (error) { loading.textContent = error.message; }
}

function openDelete(reservation) {
  pendingDelete = reservation;
  document.querySelector('#delete-name').textContent = reservation.nombre;
  document.querySelector('#delete-date').textContent = formatDate(reservation.fechaReserva);
  deleteDialog.showModal();
}

async function removeReservation() {
  if (!pendingDelete) return;
  const button = document.querySelector('#confirm-delete');
  button.disabled = true;
  try {
    await api(`/api/reservas/${pendingDelete.id}`, { method: 'DELETE' });
    deleteDialog.close();
    notify('Reserva eliminada correctamente.');
    pendingDelete = null;
    await load();
  } catch (error) { notify(error.message, 'error'); }
  finally { button.disabled = false; }
}

document.querySelector('#filter').addEventListener('click', () => {
  const date = document.querySelector('#filter-date').value;
  const phone = document.querySelector('#filter-phone').value.trim();
  if (date) load(`/api/reservas/fecha?fecha=${encodeURIComponent(date)}`, false);
  else if (phone) load(`/api/reservas/telefono?telefono=${encodeURIComponent(phone)}`, false);
  else load();
});

document.querySelector('#clear-filter').addEventListener('click', () => {
  document.querySelector('#filter-date').value = '';
  document.querySelector('#filter-phone').value = '';
  load();
});

document.querySelector('#open-new').addEventListener('click', () => newDialog.showModal());
document.querySelector('#open-password').addEventListener('click', () => passwordDialog.showModal());
document.querySelector('#confirm-delete').addEventListener('click', removeReservation);
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector(`#${button.dataset.close}`).close();
}));

[newDialog, passwordDialog, deleteDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const newForm = document.querySelector('#new-form');
const reservationDate = newForm.elements.fechaReserva;
reservationDate.min = new Date().toISOString().slice(0, 10);

newForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!newForm.reportValidity()) return;
  const button = newForm.querySelector('[type="submit"]');
  button.disabled = true;
  setStatus(document.querySelector('#new-status'), 'Guardando...');
  try {
    await api('/api/reservas', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(newForm))) });
    newForm.reset();
    setStatus(document.querySelector('#new-status'), '');
    newDialog.close();
    notify('Reserva creada correctamente.');
    await load();
  } catch (error) { setStatus(document.querySelector('#new-status'), error.message, 'error'); }
  finally { button.disabled = false; }
});

const passwordForm = document.querySelector('#password-form');
const newPassword = passwordForm.elements.nueva;

function passwordChecks(value) {
  return {
    length: value.length >= 10,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };
}

newPassword.addEventListener('input', () => {
  const checks = passwordChecks(newPassword.value);
  const score = Object.values(checks).filter(Boolean).length;
  document.querySelectorAll('.password-rules li').forEach((rule) => rule.classList.toggle('valid', checks[rule.dataset.rule]));
  document.querySelector('#strength-bar').style.width = `${score * 20}%`;
  document.querySelector('#strength-bar').dataset.score = score;
  document.querySelector('#strength-label').textContent = score < 3 ? 'Contraseña débil' : score < 5 ? 'Casi lista' : 'Contraseña segura';
});

document.querySelectorAll('.show-password').forEach((button) => button.addEventListener('click', () => {
  const input = button.previousElementSibling;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.textContent = show ? 'Ocultar' : 'Ver';
  button.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
}));

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!passwordForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(passwordForm));
  const complete = Object.values(passwordChecks(values.nueva)).every(Boolean);
  if (!complete) {
    setStatus(document.querySelector('#password-status'), 'La nueva contraseña todavía no cumple todos los requisitos.', 'error');
    return;
  }
  if (values.nueva !== values.confirmacion) {
    setStatus(document.querySelector('#password-status'), 'Las nuevas contraseñas no coinciden.', 'error');
    return;
  }
  const button = passwordForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    await api('/api/auth/password', { method: 'PUT', body: JSON.stringify({ actual: values.actual, nueva: values.nueva }) });
    passwordForm.reset();
    newPassword.dispatchEvent(new Event('input'));
    setStatus(document.querySelector('#password-status'), '');
    passwordDialog.close();
    notify('Contraseña actualizada correctamente.');
  } catch (error) { setStatus(document.querySelector('#password-status'), error.message, 'error'); }
  finally { button.disabled = false; }
});

document.querySelector('#logout').addEventListener('click', async () => {
  try { await api('/logout', { method: 'POST' }); }
  finally { location.replace('login.html'); }
});

(async () => {
  try {
    const me = await api('/api/auth/me');
    document.querySelector('#admin-name').textContent = me.username;
    await load();
  } catch (_) { location.replace('login.html'); }
})();
