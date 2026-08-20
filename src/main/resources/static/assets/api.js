let csrf = null;
const localDevelopmentHosts = ['localhost', '127.0.0.1'];
const localFrontendPorts = ['5500', '63342'];
const backendOrigin = localDevelopmentHosts.includes(location.hostname) && localFrontendPorts.includes(location.port)
  ? 'http://localhost:8081'
  : '';

async function getCsrf() {
  const response = await fetch(`${backendOrigin}/api/auth/csrf`, { credentials: 'include' });
  if (!response.ok) throw new Error('No se pudo iniciar una sesion segura');
  csrf = await response.json();
  return csrf;
}

async function api(url, options = {}) {
  if (!csrf) await getCsrf();
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers.set(csrf.headerName, csrf.token);
  if (options.body && !(options.body instanceof URLSearchParams)) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${backendOrigin}${url}`, { ...options, headers, credentials: 'include' });
  if (response.status === 401 && location.pathname.endsWith('/admin.html')) location.replace('login.html');
  if (!response.ok) {
    let payload = {};
    try { payload = await response.json(); } catch (_) { /* Respuesta sin JSON. */ }
    const fieldMessage = payload.fields ? Object.values(payload.fields)[0] : null;
    throw new Error(fieldMessage || payload.message || `Solicitud rechazada (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

function setStatus(element, message, type = '') {
  element.textContent = message;
  element.className = `status ${type}`.trim();
}
