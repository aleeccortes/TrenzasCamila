const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const button = loginForm.querySelector('button'); button.disabled = true;
  try {
    const form = new URLSearchParams(new FormData(loginForm));
    await api('/login', { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    location.replace('admin.html');
  } catch (error) { setStatus(loginStatus, error.message, 'error'); button.disabled = false; }
});
