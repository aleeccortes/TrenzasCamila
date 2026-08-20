# ProyCamila

Aplicacion web para recibir y administrar reservas de Camila Trenzas. Incluye backend Spring Boot, frontend responsive, autenticacion administrativa, MySQL, migraciones Flyway y despliegue con Docker Compose.

## Tecnologias

- Java 21 y Spring Boot 3.5
- Spring MVC, Data JPA, Validation y Security
- MySQL 8.4
- Flyway para versionar el esquema
- HTML, CSS y JavaScript sin frameworks
- Docker y Docker Compose

## Arquitectura MVC por capas

```text
src/main/java/com/proycamila/
|-- controller/   # Entrada HTTP, codigos de estado y delegacion
|-- service/      # Reglas de negocio, validacion y transacciones
|-- repository/   # Acceso a datos con Spring Data JPA
|-- model/        # Entidades persistentes
|-- dto/          # Contratos de entrada y salida de la API
|-- exception/    # Excepciones y respuestas globales de error
`-- security/     # Spring Security y creacion inicial del administrador
```

El frontend utilizado por la aplicacion esta en `src/main/resources/static`. Se sirve desde el mismo origen que la API, por lo que no requiere CORS ni direcciones `localhost` escritas en JavaScript. La carpeta `Camila` se conserva como version anterior y Docker no la incluye.

## Inicio rapido con Docker

Requisitos: Docker Engine o Docker Desktop con Compose.

1. Revisar `.env` y reemplazar todas las claves antes de un despliegue real.
2. Construir e iniciar la aplicacion:

```bash
docker compose up -d --build
```

En redes corporativas que inspeccionan TLS, se debe instalar la CA de la organizacion en el truststore de Docker/Java. El `.env` local puede pasar opciones mediante `MAVEN_OPTS` para diagnostico, pero no se recomienda desactivar certificados en un build de produccion.

3. Consultar el estado:

```bash
docker compose ps
docker compose logs -f app
```

4. Abrir `http://localhost:8081`. El ingreso administrativo esta en `http://localhost:8081/login.html`.

Para detener los contenedores sin borrar datos:

```bash
docker compose down
```

Para borrar tambien la base de datos, usar `docker compose down -v`. Esta accion elimina permanentemente las reservas.

## Variables de entorno

Docker Compose carga el archivo `.env`, que esta excluido de Git. `.env.example` documenta el formato que puede compartirse.

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `APP_PORT` | Puerto publicado por Docker | `8081` |
| `SERVER_PORT` | Puerto de Spring al ejecutar desde IntelliJ | `8082` |
| `MYSQL_DATABASE` | Nombre de la base | `proycamila` |
| `MYSQL_HOST_PORT` | Puerto local del MySQL de ProyCamila | `3307` |
| `MYSQL_USER` | Usuario sin privilegios de root | `proycamila_app` |
| `MYSQL_PASSWORD` | Clave del usuario de la aplicacion | clave fuerte |
| `MYSQL_ROOT_PASSWORD` | Clave administrativa de MySQL | clave fuerte diferente |
| `DB_URL` | JDBC URL; Compose la configura automaticamente | `jdbc:mysql://localhost:3306/proycamila` |
| `DB_USERNAME` | Usuario JDBC al ejecutar sin Docker | `proycamila_app` |
| `DB_PASSWORD` | Clave JDBC al ejecutar sin Docker | clave fuerte |
| `DB_POOL_SIZE` | Maximo de conexiones HikariCP | `10` |
| `DB_MIN_IDLE` | Conexiones inactivas minimas | `2` |
| `ADMIN_USERNAME` | Administrador creado en el primer inicio | `admin` |
| `ADMIN_PASSWORD` | Clave inicial, minimo 12 caracteres | clave fuerte |
| `COOKIE_SECURE` | Enviar cookie solo por HTTPS | `true` en produccion |
| `MAVEN_OPTS` | Opciones del build Maven; normalmente vacio | vacio |

`ADMIN_PASSWORD` debe incluir mayuscula, minuscula, numero y simbolo. Solo se usa para crear al administrador si aun no existe; cambiar la variable no modifica una cuenta ya creada. La clave puede actualizarse desde el panel.

## Ejecucion local sin Docker

Se requiere Java 21, Maven 3.9 y una instancia MySQL disponible.

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/proycamila?serverTimezone=UTC"
$env:DB_USERNAME="proycamila_app"
$env:DB_PASSWORD="tu-clave-mysql"
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="UnaClaveAdminSegura123!"
$env:COOKIE_SECURE="false"
mvn spring-boot:run
```

Flyway crea las tablas al iniciar. Hibernate usa `ddl-auto=validate`: valida el modelo, pero no modifica el esquema silenciosamente.

## API

| Metodo | Ruta | Acceso | Funcion |
|---|---|---|---|
| `POST` | `/api/reservas` | Publico + CSRF | Solicitar reserva |
| `GET` | `/api/reservas` | ADMIN | Listar reservas |
| `GET` | `/api/reservas/fecha?fecha=AAAA-MM-DD` | ADMIN | Filtrar por fecha |
| `GET` | `/api/reservas/telefono?telefono=...` | ADMIN | Buscar por telefono |
| `DELETE` | `/api/reservas/{id}` | ADMIN | Eliminar reserva |
| `GET` | `/api/auth/csrf` | Publico | Obtener token CSRF |
| `GET` | `/api/auth/me` | ADMIN | Consultar sesion |
| `PUT` | `/api/auth/password` | ADMIN | Cambiar clave |
| `POST` | `/login` | Publico + CSRF | Iniciar sesion |
| `POST` | `/logout` | Autenticado + CSRF | Cerrar sesion |

Las respuestas de validacion tienen una estructura uniforme con `timestamp`, `status`, `message` y `fields`.

## Seguridad

- Claves almacenadas con BCrypt, costo 12.
- Autorizacion por rol `ADMIN`.
- Proteccion CSRF en todas las operaciones que modifican datos.
- Migracion de identificador de sesion al autenticar y una sesion por administrador.
- Cookies `HttpOnly`, `SameSite=Strict` y opcionalmente `Secure`.
- Content Security Policy, bloqueo de frames y recursos limitados al mismo origen.
- Validacion en DTOs y nuevamente en services para preservar reglas de negocio.
- Renderizado del panel mediante `textContent`, sin insertar datos de clientes como HTML.
- Contenedor ejecutado con usuario sin privilegios, filesystem de solo lectura y `no-new-privileges`.

## Pruebas y empaquetado

```bash
mvn test
mvn clean package
```

Las pruebas actuales cubren normalizacion, telefonos invalidos, duplicados, fechas fuera de rango, nombres invalidos, busqueda parcial y cambio seguro de contrasenia.

## Produccion

Antes de publicar:

1. Reemplazar todas las claves de `.env` y no subir ese archivo al repositorio.
2. Colocar un proxy HTTPS, por ejemplo Nginx, Caddy o un balanceador, delante del puerto de la aplicacion.
3. Establecer `COOKIE_SECURE=true` cuando el acceso sea HTTPS.
4. No publicar el puerto `3306`; Compose mantiene MySQL solamente en la red interna.
5. Restringir el acceso al endpoint de administracion mediante red o firewall si el caso de uso lo permite.
6. Configurar copias de seguridad periodicas del volumen `mysql_data`.
7. Revisar logs con `docker compose logs` y monitorear `/actuator/health/readiness`.

Ejemplo de respaldo:

```bash
docker compose exec mysql sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' > backup.sql
```

Ejemplo de restauracion:

```bash
docker compose exec -T mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < backup.sql
```
