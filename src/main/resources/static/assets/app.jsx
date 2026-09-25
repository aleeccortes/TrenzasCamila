const { useState, useEffect } = React;

// Main App Component
function App() {
    const [route, setRoute] = useState(window.location.hash || '#inicio');
    const [autenticado, setAutenticado] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [csrfToken, setCsrfToken] = useState({ headerName: 'X-XSRF-TOKEN', token: '' });
    const [servicios, setServicios] = useState([]);
    const [loadingServicios, setLoadingServicios] = useState(true);
    const [modalReservaOpen, setModalReservaOpen] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    // Initial load & CSRF check
    useEffect(() => {
        obtenerCsrfToken();
        verificarSesion();
        cargarServiciosPublicos();

        const handleHashChange = () => setRoute(window.location.hash || '#inicio');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const obtenerCsrfToken = async () => {
        try {
            const res = await fetch('/api/auth/csrf');
            if (res.ok) {
                const data = await res.json();
                setCsrfToken(data);
            }
        } catch (e) {
            console.error('Error al obtener token CSRF:', e);
        }
    };

    const verificarSesion = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setAutenticado(true);
                setAdminUsername(data.username);
            } else {
                setAutenticado(false);
            }
        } catch (e) {
            setAutenticado(false);
        }
    };

    const cargarServiciosPublicos = async () => {
        try {
            setLoadingServicios(true);
            const res = await fetch('/api/servicios');
            if (res.ok) {
                const data = await res.json();
                setServicios(data);
            }
        } catch (e) {
            console.error('Error al cargar catálogo de trenzas:', e);
        } finally {
            setLoadingServicios(false);
        }
    };

    const abrirModalReserva = (servicio = null) => {
        setServicioSeleccionado(servicio);
        setModalReservaOpen(true);
    };

    const cerrarModalReserva = () => {
        setModalReservaOpen(false);
        setServicioSeleccionado(null);
    };

    // Render route
    if (route === '#admin-login' || route === '#/admin/login') {
        return (
            <AdminLogin 
                csrfToken={csrfToken} 
                onLoginExitoso={(username) => {
                    setAutenticado(true);
                    setAdminUsername(username);
                    window.location.hash = '#admin-dashboard';
                }}
                onVolverCliente={() => window.location.hash = '#inicio'}
            />
        );
    }

    if (route === '#admin-dashboard' || route === '#/admin/dashboard') {
        if (!autenticado) {
            return (
                <AdminLogin 
                    csrfToken={csrfToken} 
                    onLoginExitoso={(username) => {
                        setAutenticado(true);
                        setAdminUsername(username);
                        window.location.hash = '#admin-dashboard';
                    }}
                    onVolverCliente={() => window.location.hash = '#inicio'}
                />
            );
        }
        return (
            <AdminDashboard 
                adminUsername={adminUsername}
                csrfToken={csrfToken}
                onLogout={() => {
                    setAutenticado(false);
                    setAdminUsername('');
                    window.location.hash = '#inicio';
                }}
            />
        );
    }

    // Client View
    return (
        <div className="min-h-screen flex flex-col bg-rosa-50">
            {/* Header Cliente */}
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-rosa-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rosa-500 to-rosa-300 flex items-center justify-center text-white text-xl shadow-md">
                            🌸
                        </div>
                        <div>
                            <h1 className="font-serif-custom text-xl font-bold text-rosa-900 tracking-wide">Trenzas Camila</h1>
                            <p className="text-xs text-rosa-600 font-medium">Belleza, Peinados & Estilo</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-rosa-800">
                        <a href="#inicio" className="hover:text-rosa-500 transition-colors">Inicio</a>
                        <a href="#catalogo" className="hover:text-rosa-500 transition-colors">Catálogo</a>
                        <a href="#contacto" className="hover:text-rosa-500 transition-colors">Contacto</a>
                    </nav>
                    <button 
                        onClick={() => abrirModalReserva()}
                        className="bg-rosa-600 hover:bg-rosa-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-rosa-200 transition-all hover:scale-105"
                    >
                        Agendar Turno ✨
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section id="inicio" className="relative bg-gradient-to-b from-rosa-100/70 to-rosa-50 py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="bg-rosa-200/80 text-rosa-800 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full inline-block mb-4">
                        Especialista en Trenzas Africanas & Peinados en Mendoza
                    </span>
                    <h2 className="font-serif-custom text-4xl md:text-6xl font-extrabold text-rosa-900 mb-6 leading-tight">
                        Resalta tu belleza natural con <span className="text-rosa-600 italic">estilo único</span>
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Trenzas sueltas, pegadas, box braids, knotless y diseños personalizados creados con amor y profesionalismo.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a 
                            href="#catalogo"
                            className="bg-rosa-600 hover:bg-rosa-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-rosa-300 transition-all hover:-translate-y-0.5"
                        >
                            Ver Catálogo de Trenzas 💇‍♀️
                        </a>
                    </div>
                </div>
            </section>

            {/* Catálogo Section */}
            <section id="catalogo" className="py-16 px-4 max-w-6xl mx-auto flex-1 w-full">
                <div className="text-center mb-12">
                    <h3 className="font-serif-custom text-3xl md:text-4xl font-bold text-rosa-900 mb-3">
                        Nuestros Tipos de Trenzas
                    </h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Selecciona el estilo que más te guste y agenda tu turno fácilmente.
                    </p>
                </div>

                {loadingServicios ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-rosa-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-rosa-700 font-medium">Cargando hermoso catálogo...</p>
                    </div>
                ) : servicios.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-rosa-100 max-w-md mx-auto">
                        <p className="text-gray-600">No hay estilos publicados en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicios.map((s) => (
                            <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-rosa-100 shadow-sm hover:shadow-xl hover:border-rosa-300 transition-all duration-300 flex flex-col group">
                                <div className="relative h-64 overflow-hidden bg-rosa-100">
                                    <img 
                                        src={s.imagenUrl || 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600'} 
                                        alt={s.nombre} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600'; }}
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rosa-700 shadow-sm">
                                        ⏱️ {s.duracionMinutos} min
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-serif-custom text-xl font-bold text-rosa-900 mb-2">{s.nombre}</h4>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{s.descripcion || 'Peinado profesional con acabado de alta calidad.'}</p>
                                    </div>
                                    <div className="pt-4 border-t border-rosa-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-gray-500 font-medium block">Precio</span>
                                            <span className="text-xl font-extrabold text-rosa-700">${Number(s.precio).toLocaleString('es-AR')}</span>
                                        </div>
                                        <button 
                                            onClick={() => abrirModalReserva(s)}
                                            className="bg-rosa-600 hover:bg-rosa-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                                        >
                                            Reservar ✨
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer id="contacto" className="bg-rosa-900 text-white py-10 px-4 mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-rosa-800 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🌸</span>
                        <div>
                            <h5 className="font-serif-custom text-lg font-bold">Trenzas Camila</h5>
                            <p className="text-xs text-rosa-200">Reserva de turnos y catálogo exclusivo</p>
                        </div>
                    </div>
                    <div className="text-sm text-rosa-200 text-center md:text-right space-y-1">
                        <p className="font-medium">📍 Mendoza, Argentina</p>
                        <p>
                            💬 WhatsApp: <a href="https://wa.me/5492612502696" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-semibold">2612502696</a>
                        </p>
                        <p>
                            📸 Instagram: <a href="https://instagram.com/camila.colombo3" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-semibold">@camila.colombo3</a>
                        </p>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto text-center text-xs text-rosa-300">
                    © 2026 Trenzas Camila. Todos los derechos reservados.
                </div>
            </footer>

            {/* Modal Reserva */}
            {modalReservaOpen && (
                <ModalReserva 
                    servicio={servicioSeleccionado} 
                    serviciosList={servicios}
                    csrfToken={csrfToken}
                    onCerrar={cerrarModalReserva}
                />
            )}
        </div>
    );
}

// Modal Reserva Component
function ModalReserva({ servicio, serviciosList, csrfToken, onCerrar, esAdmin = false, onReservaCreada }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaReserva, setFechaReserva] = useState('');
    const [servicioId, setServicioId] = useState(servicio ? servicio.id : (serviciosList[0]?.id || ''));
    const [tipoTrenzaText, setTipoTrenzaText] = useState(servicio ? servicio.nombre : (serviciosList[0]?.nombre || ''));
    const [errorMsg, setErrorMsg] = useState('');
    const [exito, setExito] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Min date = today
    const today = new Date().toISOString().split('T')[0];

    const handleServicioChange = (e) => {
        const id = e.target.value;
        setServicioId(id);
        const s = serviciosList.find(x => x.id == id);
        if (s) setTipoTrenzaText(s.nombre);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: JSON.stringify({
                    nombre,
                    telefono,
                    email,
                    fechaReserva,
                    tipoTrenza: tipoTrenzaText,
                    servicioId: servicioId ? Number(servicioId) : null
                })
            });

            if (res.ok) {
                setExito(true);
                if (onReservaCreada) onReservaCreada();
            } else {
                const data = await res.json();
                setErrorMsg(data.message || 'Ocurrió un error al agendar la reserva.');
            }
        } catch (err) {
            setErrorMsg('Error de conexión al servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rosa-200 relative">
                <button 
                    onClick={onCerrar}
                    className="absolute top-4 right-4 text-gray-400 hover:text-rosa-700 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-rosa-100 transition-colors"
                >
                    ✕
                </button>

                {exito ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            ✓
                        </div>
                        <h4 className="font-serif-custom text-2xl font-bold text-rosa-900 mb-2">
                            {esAdmin ? '¡Reserva Creada por Admin!' : '¡Reserva Registrada!'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Turno agendado para <strong>{nombre}</strong> ({tipoTrenzaText}) el día <strong>{fechaReserva}</strong>.
                        </p>
                        <button 
                            onClick={onCerrar}
                            className="bg-rosa-600 hover:bg-rosa-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors w-full"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <div>
                        <h4 className="font-serif-custom text-2xl font-bold text-rosa-900 mb-1">
                            {esAdmin ? 'Nueva Reserva (Administración) 🌸' : 'Agendar Tu Turno 🌸'}
                        </h4>
                        <p className="text-xs text-gray-500 mb-6">
                            {esAdmin ? 'Crea un turno manualmente para un cliente.' : 'Completa tus datos para confirmar tu cita.'}
                        </p>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Estilo de Trenza</label>
                                <select 
                                    value={servicioId} 
                                    onChange={handleServicioChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500 bg-rosa-50/50"
                                >
                                    {serviciosList.map(s => (
                                        <option key={s.id} value={s.id}>{s.nombre} - ${Number(s.precio).toLocaleString('es-AR')}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Nombre Completo del Cliente *</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Ej. María Colombo"
                                    value={nombre} 
                                    onChange={e => setNombre(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Teléfono (WhatsApp) *</label>
                                <input 
                                    type="tel" 
                                    required
                                    placeholder="Ej. 2612502696"
                                    value={telefono} 
                                    onChange={e => setTelefono(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico (para recordatorio)</label>
                                <input 
                                    type="email" 
                                    placeholder="ejemplo@correo.com"
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Fecha del Turno *</label>
                                <input 
                                    type="date" 
                                    required
                                    min={today}
                                    value={fechaReserva} 
                                    onChange={e => setFechaReserva(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-rosa-600 hover:bg-rosa-700 text-white font-bold py-3 rounded-xl shadow-md shadow-rosa-200 transition-all mt-4 disabled:opacity-50"
                            >
                                {submitting ? 'Procesando...' : (esAdmin ? 'Guardar Reserva ✨' : 'Confirmar Reserva ✨')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// Admin Login Component
function AdminLogin({ csrfToken, onLoginExitoso, onVolverCliente }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSubmitting(true);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onLoginExitoso(data.username || username);
            } else {
                const data = await res.json();
                setErrorMsg(data.message || 'Credenciales inválidas.');
            }
        } catch (err) {
            setErrorMsg('Error al conectar con el servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rosa-100 via-rosa-50 to-rosa-200 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-rosa-200">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-rosa-600 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
                        🔒
                    </div>
                    <h3 className="font-serif-custom text-2xl font-bold text-rosa-900">Acceso Administrativo</h3>
                    <p className="text-xs text-rosa-600">Panel Privado Trenzas Camila</p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Usuario</label>
                        <input 
                            type="text" 
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200 focus:outline-none focus:ring-2 focus:ring-rosa-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-rosa-600 hover:bg-rosa-700 text-white font-bold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 mt-2"
                    >
                        {submitting ? 'Iniciando Sesión...' : 'Ingresar al Panel'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={onVolverCliente}
                        className="text-xs text-rosa-700 hover:underline font-medium"
                    >
                        ← Volver a la vista de clientes
                    </button>
                </div>
            </div>
        </div>
    );
}

// Admin Dashboard Component
function AdminDashboard({ adminUsername, csrfToken, onLogout }) {
    const [tab, setTab] = useState('reservas'); // 'reservas', 'catalogo', 'facturacion', 'password'
    const [reservas, setReservas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [reporteFacturacion, setReporteFacturacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroTelefono, setFiltroTelefono] = useState('');
    const [modalCrearReservaAdmin, setModalCrearReservaAdmin] = useState(false);

    // Load data based on active tab
    useEffect(() => {
        cargarServiciosAdmin();
        if (tab === 'reservas') cargarReservas();
        if (tab === 'catalogo') cargarServiciosAdmin();
        if (tab === 'facturacion') cargarReporteFacturacion();
    }, [tab]);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            let url = '/api/reservas';
            if (filtroFecha) url = `/api/reservas/fecha?fecha=${filtroFecha}`;
            else if (filtroTelefono) url = `/api/reservas/telefono?telefono=${encodeURIComponent(filtroTelefono)}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setReservas(data);
            }
        } catch (e) {
            console.error('Error al cargar reservas:', e);
        } finally {
            setLoading(false);
        }
    };

    const cargarServiciosAdmin = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/servicios/admin');
            if (res.ok) {
                const data = await res.json();
                setServicios(data);
            }
        } catch (e) {
            console.error('Error al cargar catálogo admin:', e);
        } finally {
            setLoading(false);
        }
    };

    const cargarReporteFacturacion = async (anio = new Date().getFullYear(), mes = new Date().getMonth() + 1) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/facturacion/mensual?anio=${anio}&mes=${mes}`);
            if (res.ok) {
                const data = await res.json();
                setReporteFacturacion(data);
            }
        } catch (e) {
            console.error('Error al cargar facturación:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/logout', {
                method: 'POST',
                headers: { [csrfToken.headerName]: csrfToken.token }
            });
        } catch (e) {}
        onLogout();
    };

    const cambiarEstadoReserva = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`/api/reservas/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (res.ok) cargarReservas();
        } catch (e) {}
    };

    const cambiarEstadoPago = async (id, nuevoEstadoPago) => {
        try {
            const res = await fetch(`/api/reservas/${id}/estado-pago`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: JSON.stringify({ estadoPago: nuevoEstadoPago })
            });
            if (res.ok) cargarReservas();
        } catch (e) {}
    };

    const eliminarReserva = async (id) => {
        if (!confirm('¿Seguro de eliminar esta reserva?')) return;
        try {
            const res = await fetch(`/api/reservas/${id}`, {
                method: 'DELETE',
                headers: { [csrfToken.headerName]: csrfToken.token }
            });
            if (res.ok) cargarReservas();
        } catch (e) {}
    };

    const enviarRecordatorioEmail = async (reservaId) => {
        try {
            const res = await fetch(`/api/recordatorios/email/${reservaId}`, {
                method: 'POST',
                headers: { [csrfToken.headerName]: csrfToken.token }
            });
            if (res.ok) {
                alert('✉️ Recordatorio por correo enviado/procesado con éxito.');
                cargarReservas();
            }
        } catch (e) {
            alert('Error al enviar el recordatorio por correo.');
        }
    };

    const enviarRecordatorioWhatsApp = async (reservaId) => {
        try {
            const res = await fetch(`/api/recordatorios/whatsapp/${reservaId}`);
            if (res.ok) {
                const data = await res.json();
                window.open(data.url, '_blank');
            }
        } catch (e) {
            alert('Error al generar enlace de WhatsApp.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-rosa-50">
            {/* Header Admin */}
            <header className="bg-rosa-900 text-white py-4 px-6 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🌸</span>
                    <div>
                        <h2 className="font-serif-custom text-xl font-bold">Panel de Administración</h2>
                        <p className="text-xs text-rosa-200">Hola, {adminUsername}</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="bg-rosa-800 hover:bg-rosa-700 text-rosa-100 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    Cerrar Sesión 🚪
                </button>
            </header>

            {/* Sub-nav Tabs */}
            <div className="bg-white border-b border-rosa-200 px-6">
                <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto text-sm font-semibold text-gray-600">
                    <button 
                        onClick={() => setTab('reservas')}
                        className={`py-3.5 px-3 border-b-2 transition-colors ${tab === 'reservas' ? 'border-rosa-600 text-rosa-700 font-bold' : 'border-transparent hover:text-rosa-600'}`}
                    >
                        📋 Gestión de Reservas
                    </button>
                    <button 
                        onClick={() => setTab('catalogo')}
                        className={`py-3.5 px-3 border-b-2 transition-colors ${tab === 'catalogo' ? 'border-rosa-600 text-rosa-700 font-bold' : 'border-transparent hover:text-rosa-600'}`}
                    >
                        ✂️ Catálogo de Trenzas
                    </button>
                    <button 
                        onClick={() => setTab('facturacion')}
                        className={`py-3.5 px-3 border-b-2 transition-colors ${tab === 'facturacion' ? 'border-rosa-600 text-rosa-700 font-bold' : 'border-transparent hover:text-rosa-600'}`}
                    >
                        📊 Facturación Mensual
                    </button>
                    <button 
                        onClick={() => setTab('password')}
                        className={`py-3.5 px-3 border-b-2 transition-colors ${tab === 'password' ? 'border-rosa-600 text-rosa-700 font-bold' : 'border-transparent hover:text-rosa-600'}`}
                    >
                        🔑 Cambiar Contraseña
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <main className="max-w-6xl mx-auto p-6 flex-1 w-full">
                {tab === 'reservas' && (
                    <div>
                        {/* Bar de Acciones y Filtros */}
                        <div className="bg-white p-4 rounded-2xl border border-rosa-200 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="font-semibold text-gray-700">Filtrar por:</span>
                                <input 
                                    type="date" 
                                    value={filtroFecha}
                                    onChange={e => { setFiltroFecha(e.target.value); setFiltroTelefono(''); }}
                                    className="px-3 py-1.5 rounded-lg border border-rosa-200 text-xs"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por teléfono..."
                                    value={filtroTelefono}
                                    onChange={e => { setFiltroTelefono(e.target.value); setFiltroFecha(''); }}
                                    className="px-3 py-1.5 rounded-lg border border-rosa-200 text-xs"
                                />
                                <button 
                                    onClick={cargarReservas}
                                    className="bg-rosa-600 hover:bg-rosa-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                                >
                                    Buscar
                                </button>
                                {(filtroFecha || filtroTelefono) && (
                                    <button 
                                        onClick={() => { setFiltroFecha(''); setFiltroTelefono(''); setTimeout(cargarReservas, 0); }}
                                        className="text-xs text-gray-500 hover:underline"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setModalCrearReservaAdmin(true)}
                                    className="bg-rosa-600 hover:bg-rosa-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-rosa-200 hover:scale-105"
                                >
                                    ✨ + Crear Reserva (Admin)
                                </button>
                                <span className="text-xs text-rosa-700 font-bold bg-rosa-100 px-3 py-1.5 rounded-full">
                                    Total: {reservas.length} reservas
                                </span>
                            </div>
                        </div>

                        {/* Modal para Crear Reserva desde Admin */}
                        {modalCrearReservaAdmin && (
                            <ModalReserva 
                                servicio={null}
                                serviciosList={servicios}
                                csrfToken={csrfToken}
                                esAdmin={true}
                                onReservaCreada={() => {
                                    cargarReservas();
                                }}
                                onCerrar={() => {
                                    setModalCrearReservaAdmin(false);
                                    cargarReservas();
                                }}
                            />
                        )}

                        {/* Tabla Reservas */}
                        <div className="bg-white rounded-2xl border border-rosa-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-rosa-100 text-rosa-900 font-bold border-b border-rosa-200">
                                        <tr>
                                            <th className="p-3">Cliente</th>
                                            <th className="p-3">Contacto</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Servicio & Precio</th>
                                            <th className="p-3">Estado Reserva</th>
                                            <th className="p-3">Pago</th>
                                            <th className="p-3 text-center">Recordatorios</th>
                                            <th className="p-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-rosa-100 text-gray-700">
                                        {reservas.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="p-6 text-center text-gray-500">No se encontraron reservas.</td>
                                            </tr>
                                        ) : (
                                            reservas.map(r => (
                                                <tr key={r.id} className="hover:bg-rosa-50/50 transition-colors">
                                                    <td className="p-3 font-semibold text-gray-900">{r.nombre}</td>
                                                    <td className="p-3">
                                                        <div>📞 {r.telefono}</div>
                                                        {r.email && <div className="text-gray-400 text-[10px]">✉️ {r.email}</div>}
                                                    </td>
                                                    <td className="p-3 font-medium">{r.fechaReserva}</td>
                                                    <td className="p-3">
                                                        <div className="font-semibold text-rosa-900">{r.tipoTrenza}</div>
                                                        <div className="text-xs font-bold text-rosa-700">${Number(r.precio).toLocaleString('es-AR')}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        <select 
                                                            value={r.estado}
                                                            onChange={e => cambiarEstadoReserva(r.id, e.target.value)}
                                                            className={`px-2 py-1 rounded-full text-[10px] font-bold border ${r.estado === 'COMPLETADA' ? 'bg-green-100 text-green-700 border-green-200' : r.estado === 'CANCELADA' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                                                        >
                                                            <option value="PENDIENTE">PENDIENTE</option>
                                                            <option value="CONFIRMADA">CONFIRMADA</option>
                                                            <option value="COMPLETADA">COMPLETADA</option>
                                                            <option value="CANCELADA">CANCELADA</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <select 
                                                            value={r.estadoPago}
                                                            onChange={e => cambiarEstadoPago(r.id, e.target.value)}
                                                            className={`px-2 py-1 rounded-full text-[10px] font-bold border ${r.estadoPago === 'PAGADO' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}
                                                        >
                                                            <option value="PENDIENTE">PENDIENTE</option>
                                                            <option value="PAGADO">PAGADO</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3 text-center space-x-1">
                                                        <button 
                                                            onClick={() => enviarRecordatorioWhatsApp(r.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg text-xs transition-colors shadow-sm"
                                                            title="Enviar Recordatorio WhatsApp"
                                                        >
                                                            💬 WhatsApp
                                                        </button>
                                                        {r.email && (
                                                            <button 
                                                                onClick={() => enviarRecordatorioEmail(r.id)}
                                                                className="bg-rosa-600 hover:bg-rosa-700 text-white p-1.5 rounded-lg text-xs transition-colors shadow-sm"
                                                                title="Enviar Recordatorio Email"
                                                            >
                                                                ✉️ Email
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button 
                                                            onClick={() => eliminarReserva(r.id)}
                                                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'catalogo' && (
                    <TabCatalogo 
                        servicios={servicios} 
                        csrfToken={csrfToken} 
                        onActualizar={cargarServiciosAdmin} 
                    />
                )}

                {tab === 'facturacion' && (
                    <TabFacturacion 
                        reporte={reporteFacturacion} 
                        onCambiarPeriodo={(a, m) => cargarReporteFacturacion(a, m)} 
                    />
                )}

                {tab === 'password' && (
                    <TabPassword csrfToken={csrfToken} />
                )}
            </main>
        </div>
    );
}

// Tab Catálogo (CRUD) Component
function TabCatalogo({ servicios, csrfToken, onActualizar }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [duracionMinutos, setDuracionMinutos] = useState(120);
    const [editandoId, setEditandoId] = useState(null);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');

        const payload = {
            nombre,
            descripcion,
            precio: Number(precio),
            imagenUrl,
            duracionMinutos: Number(duracionMinutos)
        };

        const method = editandoId ? 'PUT' : 'POST';
        const url = editandoId ? `/api/servicios/${editandoId}` : '/api/servicios';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMsg(editandoId ? 'Servicio actualizado correctamente' : 'Nuevo estilo creado con éxito');
                resetForm();
                onActualizar();
            } else {
                const data = await res.json();
                setMsg(data.message || 'Error al guardar el servicio');
            }
        } catch (e) {
            setMsg('Error de conexión');
        }
    };

    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setImagenUrl('');
        setDuracionMinutos(120);
        setEditandoId(null);
    };

    const iniciarEdicion = (s) => {
        setEditandoId(s.id);
        setNombre(s.nombre);
        setDescripcion(s.descripcion || '');
        setPrecio(s.precio);
        setImagenUrl(s.imagenUrl || '');
        setDuracionMinutos(s.duracionMinutos || 120);
    };

    const toggleEstado = async (s) => {
        const action = s.activo ? 'desactivar' : 'activar';
        try {
            const res = await fetch(`/api/servicios/${s.id}/${action}`, {
                method: 'PUT',
                headers: { [csrfToken.headerName]: csrfToken.token }
            });
            if (res.ok) onActualizar();
        } catch (e) {}
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="bg-white p-6 rounded-2xl border border-rosa-200 shadow-sm h-fit">
                <h4 className="font-serif-custom text-xl font-bold text-rosa-900 mb-4">
                    {editandoId ? 'Editar Estilo de Trenza' : 'Agregar Nuevo Estilo'}
                </h4>

                {msg && <div className="mb-4 p-3 bg-rosa-100 text-rosa-900 text-xs rounded-xl">{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nombre del Estilo *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ej. Box Braids Medianas"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rosa-200"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea 
                            rows="3"
                            placeholder="Detalles del peinado, accesorios incluidos..."
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rosa-200"
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Precio ($ ARS) *</label>
                            <input 
                                type="number" 
                                required
                                min="1"
                                placeholder="15000"
                                value={precio}
                                onChange={e => setPrecio(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-rosa-200"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Duración (Mins)</label>
                            <input 
                                type="number" 
                                required
                                min="15"
                                value={duracionMinutos}
                                onChange={e => setDuracionMinutos(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-rosa-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">URL de la Imagen (Foto)</label>
                        <input 
                            type="url" 
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={imagenUrl}
                            onChange={e => setImagenUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rosa-200"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button 
                            type="submit"
                            className="flex-1 bg-rosa-600 hover:bg-rosa-700 text-white font-bold py-2.5 rounded-xl shadow-sm transition-colors"
                        >
                            {editandoId ? 'Actualizar' : 'Crear Estilo ✨'}
                        </button>
                        {editandoId && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Listado */}
            <div className="lg:col-span-2 space-y-4">
                <h4 className="font-serif-custom text-xl font-bold text-rosa-900 mb-2">Estilos Publicados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servicios.map(s => (
                        <div key={s.id} className={`bg-white p-4 rounded-2xl border ${s.activo ? 'border-rosa-200' : 'border-gray-200 opacity-60'} shadow-sm flex flex-col justify-between`}>
                            <div className="flex gap-4 mb-3">
                                <img 
                                    src={s.imagenUrl || 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600'} 
                                    alt={s.nombre} 
                                    className="w-20 h-20 object-cover rounded-xl bg-rosa-100 flex-shrink-0"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600'; }}
                                />
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {s.activo ? 'ACTIVO' : 'INACTIVO'}
                                    </span>
                                    <h5 className="font-bold text-rosa-900 text-sm mt-1">{s.nombre}</h5>
                                    <p className="text-xs text-rosa-700 font-extrabold mt-1">${Number(s.precio).toLocaleString('es-AR')}</p>
                                    <span className="text-[11px] text-gray-500">⏱️ {s.duracionMinutos} minutos</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rosa-100 text-xs">
                                <button 
                                    onClick={() => iniciarEdicion(s)}
                                    className="text-rosa-700 font-semibold hover:underline"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => toggleEstado(s)}
                                    className={`font-semibold ${s.activo ? 'text-orange-600' : 'text-green-600'} hover:underline`}
                                >
                                    {s.activo ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Tab Facturación Component
function TabFacturacion({ reporte, onCambiarPeriodo }) {
    const hoy = new Date();
    const [anio, setAnio] = useState(hoy.getFullYear());
    const [mes, setMes] = useState(hoy.getMonth() + 1);

    useEffect(() => {
        onCambiarPeriodo(anio, mes);
    }, [anio, mes]);

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="space-y-6">
            {/* Controles Fecha */}
            <div className="bg-white p-4 rounded-2xl border border-rosa-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <h4 className="font-serif-custom text-xl font-bold text-rosa-900">Reporte de Facturación</h4>
                <div className="flex items-center gap-3 text-sm">
                    <label className="font-semibold text-gray-700">Período:</label>
                    <select 
                        value={mes} 
                        onChange={e => setMes(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-xl border border-rosa-200 bg-rosa-50 text-xs font-semibold text-rosa-900"
                    >
                        {meses.map((m, idx) => (
                            <option key={idx} value={idx + 1}>{m}</option>
                        ))}
                    </select>
                    <select 
                        value={anio} 
                        onChange={e => setAnio(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-xl border border-rosa-200 bg-rosa-50 text-xs font-semibold text-rosa-900"
                    >
                        {[2024, 2025, 2026, 2027].map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
            </div>

            {reporte && (
                <div>
                    {/* Tarjetas Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-md">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-100 block mb-1">Total Facturado (Cobrado)</span>
                            <div className="text-3xl font-extrabold">${Number(reporte.totalFacturadoCobrado).toLocaleString('es-AR')}</div>
                            <span className="text-xs text-green-100 mt-2 block">Ingresos efectivamente recibidos</span>
                        </div>

                        <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-white p-6 rounded-3xl shadow-md">
                            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 block mb-1">Pendiente de Cobro</span>
                            <div className="text-3xl font-extrabold">${Number(reporte.totalPendienteCobro).toLocaleString('es-AR')}</div>
                            <span className="text-xs text-orange-100 mt-2 block">Reservas agendadas por cobrar</span>
                        </div>

                        <div className="bg-gradient-to-br from-rosa-600 to-rosa-800 text-white p-6 rounded-3xl shadow-md">
                            <span className="text-xs font-bold uppercase tracking-wider text-rosa-200 block mb-1">Facturación Estimada Total</span>
                            <div className="text-3xl font-extrabold">${Number(reporte.totalEstimadoMes).toLocaleString('es-AR')}</div>
                            <span className="text-xs text-rosa-200 mt-2 block">Proyección completa del mes</span>
                        </div>
                    </div>

                    {/* Resumen de Reservas */}
                    <div className="bg-white p-6 rounded-2xl border border-rosa-200 shadow-sm mb-6">
                        <h5 className="font-bold text-rosa-900 text-sm mb-4">Resumen de Turnos del Mes</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-rosa-50 rounded-xl">
                                <span className="text-xs text-gray-500 block">Total Reservas</span>
                                <span className="text-xl font-bold text-rosa-900">{reporte.totalReservas}</span>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl">
                                <span className="text-xs text-green-700 block">Completadas</span>
                                <span className="text-xl font-bold text-green-700">{reporte.reservasCompletadas}</span>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-xl">
                                <span className="text-xs text-yellow-700 block">Pendientes/Confirmadas</span>
                                <span className="text-xl font-bold text-yellow-700">{reporte.reservasPendientes}</span>
                            </div>
                            <div className="p-3 bg-red-50 rounded-xl">
                                <span className="text-xs text-red-700 block">Canceladas</span>
                                <span className="text-xl font-bold text-red-700">{reporte.reservasCanceladas}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desglose por Servicio */}
                    <div className="bg-white p-6 rounded-2xl border border-rosa-200 shadow-sm">
                        <h5 className="font-bold text-rosa-900 text-sm mb-4">Desglose por Tipo de Trenza</h5>
                        <div className="divide-y divide-rosa-100 text-xs">
                            {Object.keys(reporte.desglosePorServicio || {}).length === 0 ? (
                                <p className="text-gray-500">No hay reservas registradas en este mes.</p>
                            ) : (
                                Object.entries(reporte.desglosePorServicio).map(([nombreServicio, cantidad]) => (
                                    <div key={nombreServicio} className="py-2.5 flex items-center justify-between">
                                        <span className="font-semibold text-gray-800">{nombreServicio}</span>
                                        <span className="bg-rosa-100 text-rosa-800 font-bold px-3 py-1 rounded-full">
                                            {cantidad} turno(s)
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Tab Password Component
function TabPassword({ csrfToken }) {
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [msg, setMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setErrorMsg('');

        if (nueva !== confirmacion) {
            setErrorMsg('La confirmación de la contraseña no coincide.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfToken.headerName]: csrfToken.token
                },
                body: JSON.stringify({ actual, nueva })
            });

            if (res.ok) {
                setMsg('¡Contraseña actualizada con éxito!');
                setActual('');
                setNueva('');
                setConfirmacion('');
            } else {
                const data = await res.json();
                setErrorMsg(data.message || 'Error al cambiar la contraseña.');
            }
        } catch (e) {
            setErrorMsg('Error al conectar con el servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-rosa-200 shadow-sm max-w-md mx-auto">
            <h4 className="font-serif-custom text-xl font-bold text-rosa-900 mb-4">Cambiar Contraseña Administrativa</h4>

            {msg && <div className="mb-4 p-3 bg-green-100 text-green-800 text-xs rounded-xl">{msg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-800 text-xs rounded-xl">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Contraseña Actual *</label>
                    <input 
                        type="password" 
                        required
                        value={actual}
                        onChange={e => setActual(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200"
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Nueva Contraseña *</label>
                    <input 
                        type="password" 
                        required
                        value={nueva}
                        onChange={e => setNueva(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Mínimo 12 caracteres, mayúscula, minúscula, número y símbolo.</p>
                </div>
                <div>
                    <label className="block font-semibold text-gray-700 mb-1">Confirmar Nueva Contraseña *</label>
                    <input 
                        type="password" 
                        required
                        value={confirmacion}
                        onChange={e => setConfirmacion(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rosa-200"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-rosa-600 hover:bg-rosa-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Guardando...' : 'Actualizar Contraseña'}
                </button>
            </form>
        </div>
    );
}

// Render React App to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
