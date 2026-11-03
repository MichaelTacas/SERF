# Sistema de Soporte Técnico - Backend

API REST desarrollada para la gestión de solicitudes de soporte técnico.

El sistema permite administrar clientes, técnicos, usuarios y solicitudes de soporte, aplicando reglas de negocio para la asignación de técnicos, prioridades, cambios de estado, autenticación y autorización por roles.

La información se almacena de forma persistente en una base de datos MySQL mediante Spring Data JPA e Hibernate.

---

## Integrantes y responsabilidades

Michael:
Análisis / Frontend / Controladores / Seguridad /
Documentación / Pruebas

Aldair:
Modelado / DTO / Backend / Servicios /
Lógica de negocio / Validaciones / Persistencia / QA

## Tecnologías utilizadas

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Hibernate
- MySQL
- Jakarta Validation
- Spring Security
- JWT
- BCrypt
- OAuth2 Resource Server
- Maven
- JUnit
- Swagger / OpenAPI
- React + TypeScript en el frontend

---

# Arquitectura

El backend se encuentra organizado mediante una arquitectura por capas y separación de responsabilidades.

```text
Frontend / Cliente HTTP
        ↓
Spring Security / JWT
        ↓
Controller
        ↓
Application Service
        ↓
Service
        ↓
Validator
        ↓
Repository
        ↓
JPA / Hibernate
        ↓
MySQL
```

Principales paquetes:

```text
src/main/java/com/idat/soportetecnico
├── application
│   └── impl
├── config
├── controller
├── dto
├── exception
├── mapper
├── model
├── repository
├── security
├── service
│   └── impl
└── validator
```

Cada capa cumple una responsabilidad específica:

- **Security:** autentica al usuario y valida sus permisos mediante JWT.
- **Controller:** recibe las solicitudes HTTP.
- **Application Service:** coordina los casos de uso.
- **Service:** contiene la lógica relacionada con cada entidad.
- **Validator:** aplica reglas de negocio específicas.
- **Repository:** gestiona el acceso a los datos.
- **JPA / Hibernate:** realiza el mapeo objeto-relacional.
- **MySQL:** almacena la información de forma persistente.

Esta estructura permite mantener bajo acoplamiento y una mejor separación de responsabilidades.

---

# Base de datos

El proyecto utiliza MySQL.

Nombre de la base de datos:

```text
soporte_tecnico_db
```

El script para crear la base de datos, tablas y datos iniciales se encuentra en:

```text
database/setup.sql
```

La estructura general del proyecto es:

```text
efsrt2-soporte-tecnico
├── database
│   └── setup.sql
├── efsrt2-soporte-tecnico-api
└── efsrt2-soporte-tecnico-web
```

Entre las principales tablas se encuentran:

```text
clientes
tecnicos
solicitudes
usuarios
```

La tabla `usuarios` almacena la información utilizada para la autenticación:

```text
id
email
password_hash
rol
activo
```

Las contraseñas no se almacenan en texto plano. Se utiliza BCrypt para generar el hash correspondiente.

---

# Configuración

La configuración principal se encuentra en:

```text
src/main/resources/application.properties
```

La contraseña de MySQL no se almacena directamente en el repositorio.

Se utiliza:

```text
DB_PASSWORD
```

El usuario de MySQL puede configurarse mediante:

```text
DB_USER
```

Si no se define, se utiliza `root`.

También se utilizan variables de entorno para JWT y para el administrador inicial:

```text
JWT_SECRET
JWT_ISSUER
JWT_EXPIRATION_SECONDS

ADMIN_EMAIL
ADMIN_PASSWORD
```

---

## Ejemplo de configuración en PowerShell

### Base de datos

```powershell
$env:DB_PASSWORD="TU_CONTRASEÑA_MYSQL"
```

### Generar una clave JWT segura para desarrollo

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

### Administrador inicial

```powershell
$env:ADMIN_EMAIL="admin@grzasociados.com"
$env:ADMIN_PASSWORD="TU_CONTRASEÑA_DE_DESARROLLO"
```

Las contraseñas y secretos reales no deben almacenarse directamente en GitHub.

## Crear usuarios y probar los roles

El administrador inicial se crea al iniciar la API (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). El rol `TECNICO` se crea con la sesión del administrador:

1. `POST /api/auth/login` con `{"email": "admin@grzasociados.com", "password": "TU_CONTRASEÑA_ADMIN"}`.
2. Usar el `token` devuelto en Swagger (botón **Authorize**) o como `Authorization: Bearer <token>`.
3. `POST /api/usuarios` con `{"email": "tecnico@grzasociados.com", "password": "Tecnico2026!", "rol": "TECNICO"}`.

La colección de Postman (`postman/`) automatiza estos pasos en la carpeta **00 - Autenticación y usuarios (JWT)**; solo se debe definir la variable `adminPassword`.

---

# Seguridad

El sistema implementa autenticación y autorización mediante Spring Security y JWT.

La seguridad actualmente incluye:

- Spring Security.
- Autenticación mediante JWT.
- Tokens Bearer.
- Sesiones stateless.
- BCrypt para contraseñas.
- Roles `ADMINISTRADOR` y `TECNICO`.
- Control de acceso según endpoint.
- Validación de permisos para cambios de estado.
- Protección de endpoints administrativos.
- Swagger configurado para autenticación Bearer.

El flujo de autenticación es:

```text
Usuario
   ↓
POST /api/auth/login
   ↓
Validación de correo y contraseña
   ↓
BCrypt
   ↓
Generación de JWT
   ↓
JWT + rol del usuario
   ↓
Frontend
   ↓
Authorization: Bearer <token>
   ↓
Spring Security
   ↓
Endpoint autorizado
```

---

# Roles del sistema

## ADMINISTRADOR

El administrador puede:

- Iniciar sesión.
- Registrar solicitudes.
- Consultar solicitudes.
- Administrar usuarios.
- Registrar clientes.
- Modificar clientes.
- Eliminar clientes.
- Registrar técnicos.
- Modificar técnicos.
- Eliminar técnicos.
- Cerrar solicitudes resueltas.
- Acceder a funciones administrativas.

## TECNICO

El técnico puede:

- Iniciar sesión.
- Consultar solicitudes.
- Iniciar la atención de solicitudes.
- Cambiar una solicitud de `PENDIENTE` a `EN_PROCESO`.
- Cambiar una solicitud de `EN_PROCESO` a `RESUELTA`.
- Consultar información necesaria para realizar la atención.

El técnico no puede:

- Registrar nuevas solicitudes.
- Administrar usuarios.
- Crear, modificar o eliminar clientes.
- Crear, modificar o eliminar técnicos.
- Eliminar solicitudes.
- Cerrar definitivamente una solicitud resuelta.

---

# Autenticación

## Endpoint de login

```text
POST /api/auth/login
```

Ejemplo