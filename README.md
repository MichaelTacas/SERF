# EFSRT2 - Sistema de Soporte Técnico

Proyecto académico desarrollado para el curso **Proyecto Integración de los Componentes de las Capas de Datos, Negocio y Vista**.

El sistema permite gestionar solicitudes de soporte técnico mediante una aplicación web basada en una arquitectura por capas, integrando frontend, backend, lógica de negocio, persistencia, autenticación y autorización por roles.

## Integrantes

- Michael Jeymi Tacas Rocha
- Aldair Davis Hernandez Ramirez

## Organización de referencia

**GRZ & Asociados**

---

# Tecnologías

## Frontend

- React
- TypeScript
- Vite
- HTML
- CSS
- Fetch API
- Local Storage para gestión de sesión

## Backend

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Spring Security
- JWT
- BCrypt
- OAuth2 Resource Server
- Swagger / OpenAPI
- Maven
- JUnit

## Base de datos

- MySQL

---

# Estructura del proyecto

```text
efsrt2-soporte-tecnico
├── database
│   └── setup.sql
│
├── efsrt2-soporte-tecnico-api
│   ├── src
│   ├── pom.xml
│   └── README.md
│
└── efsrt2-soporte-tecnico-web
    ├── src
    ├── package.json
    └── README.md
```

---

# Arquitectura

El sistema utiliza una arquitectura organizada por capas:

```text
Vista / Frontend
React + TypeScript
        ↓
Autenticación
JWT
        ↓
API / Controller
Spring Boot
        ↓
Application Service
        ↓
Lógica de negocio
Service + Validators
        ↓
Acceso a datos
Repository + JPA / Hibernate
        ↓
Base de datos
MySQL
```

Esta organización permite separar las responsabilidades de la interfaz, seguridad, lógica de negocio y persistencia.

---

# Funcionalidades principales

El sistema permite:

- Registrar clientes.
- Registrar y administrar técnicos.
- Consultar técnicos disponibles.
- Registrar solicitudes de soporte.
- Asignar prioridades.
- Asignar técnicos.
- Listar solicitudes.
- Consultar solicitudes por estado.
- Consultar solicitudes por prioridad.
- Cambiar el estado de las solicitudes.
- Validar disponibilidad del técnico.
- Validar transiciones entre estados.
- Iniciar sesión mediante correo y contraseña.
- Generar tokens JWT.
- Proteger endpoints mediante Spring Security.
- Diferenciar permisos según el rol.
- Mostrar interfaces diferentes para administrador y técnico.
- Cerrar sesión.
- Validar permisos para cambios de estado.

---

# Flujo de estados

Las solicitudes utilizan los siguientes estados:

```text
PENDIENTE
    ↓
EN_PROCESO
    ↓
RESUELTA
    ↓
CERRADA
```

El flujo operativo según el rol es:

```text
ADMINISTRADOR
      ↓
Registra solicitud
      ↓
PENDIENTE

TÉCNICO
      ↓
Inicia atención
      ↓
EN_PROCESO
      ↓
Marca como resuelta
      ↓
RESUELTA

ADMINISTRADOR
      ↓
Cierra solicitud
      ↓
CERRADA
```

El sistema evita transiciones incorrectas como:

```text
PENDIENTE → CERRADA
```

---

# Roles del sistema

## ADMINISTRADOR

El administrador puede:

- Iniciar sesión.
- Registrar solicitudes.
- Consultar solicitudes.
- Asignar clientes.
- Asignar técnicos.
- Administrar usuarios desde la API.
- Registrar, modificar y eliminar clientes.
- Registrar, modificar y eliminar técnicos.
- Eliminar solicitudes.
- Cerrar solicitudes que se encuentren resueltas.

En el frontend, el administrador visualiza el formulario:

```text
Registrar nueva solicitud
```

y la lista general de solicitudes registradas.

---

## TÉCNICO

El técnico puede:

- Iniciar sesión.
- Consultar solicitudes.
- Iniciar la atención de una solicitud.
- Cambiar una solicitud de `PENDIENTE` a `EN_PROCESO`.
- Cambiar una solicitud de `EN_PROCESO` a `RESUELTA`.

El técnico no puede:

- Registrar solicitudes.
- Administrar usuarios.
- Crear, modificar o eliminar clientes.
- Crear, modificar o eliminar técnicos.
- Eliminar solicitudes.
- Cambiar una solicitud de `RESUELTA` a `CERRADA`.

En el frontend, el técnico visualiza únicamente las solicitudes y las acciones relacionadas con su atención.

---

# Seguridad

El sistema implementa seguridad mediante:

- Spring Security.
- JWT.
- BCrypt.
- Roles y permisos.
- Sesiones stateless.
- Bearer Token.
- Protección de endpoints.
- Validaciones adicionales de permisos en la lógica de negocio.

El flujo de autenticación es:

```text
Usuario
   ↓
Login
   ↓
POST /api/auth/login
   ↓
Validación de credenciales
   ↓
BCrypt
   ↓
Generación JWT
   ↓
Frontend guarda el token
   ↓
Authorization: Bearer <JWT>
   ↓
Spring Security
   ↓
Recurso autorizado
```

El frontend almacena:

```text
auth_token
auth_user
```

en `Local Storage`.

El archivo:

```text
apiClient.ts
```

agrega automáticamente el JWT a las peticiones protegidas.

---

# Validaciones de seguridad por rol

Entre las principales reglas se encuentran:

| Operación | Administrador | Técnico |
|---|---:|---:|
| Iniciar sesión | Sí | Sí |
| Consultar solicitudes | Sí | Sí |
| Registrar solicitud | Sí | No |
| Actualizar solicitudes permitidas | Sí | Sí |
| Eliminar solicitud | Sí | No |
| Administrar usuarios | Sí | No |
| Registrar clientes | Sí | No |
| Registrar técnicos | Sí | No |
| Cerrar solicitud resuelta | Sí | No |

Cuando un usuario no se encuentra autenticado correctamente, la API puede responder:

```text
401 Unauthorized
```

Cuando está autenticado pero no tiene permisos:

```text
403 Forbidden
```

---

# Validadores de negocio

El sistema utiliza validadores independientes para mantener una correcta separación de responsabilidades.

## TecnicoDisponibleValidator

Verifica que el técnico seleccionado se encuentre disponible antes de ser asignado.

## TransicionEstadoValidator

Verifica que la transición entre estados sea válida.

Ejemplo:

```text
PENDIENTE → EN_PROCESO ✅
PENDIENTE → CERRADA ❌
```

## PermisoCambioEstadoValidator

Comprueba si el usuario autenticado tiene permiso para realizar determinados cambios de estado.

Regla principal:

```text
TÉCNICO
RESUELTA → CERRADA ❌

ADMINISTRADOR
RESUELTA → CERRADA ✅
```

Esto evita que un técnico pueda cerrar una solicitud directamente mediante Swagger, Postman u otra herramienta externa.

---

# 1. Preparar la base de datos

Abrir MySQL Workbench y ejecutar:

```text
database/setup.sql
```

La base de datos utilizada es:

```text
soporte_tecnico_db
```

Entre las principales tablas se encuentran:

```text
clientes
tecnicos
solicitudes
usuarios
```

Las contraseñas de los usuarios son almacenadas mediante hash BCrypt y no en texto plano.

---

# 2. Ejecutar el backend

Entrar a:

```powershell
cd efsrt2-soporte-tecnico-api
```

## Configurar MySQL

```powershell
$env:DB_PASSWORD="TU_CONTRASEÑA_MYSQL"
```

## Generar JWT_SECRET

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

## Configurar administrador inicial

```powershell
$env:ADMIN_EMAIL="admin@grzasociados.com"
$env:ADMIN_PASSWORD="TU_CONTRASEÑA_ADMIN"
```

Las contraseñas y secretos reales no deben almacenarse directamente en el repositorio.

## Crear usuarios y probar los roles

Al iniciar, el backend crea el administrador inicial (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). El rol `TECNICO` se crea desde la API, con la sesión del administrador:

1. Iniciar sesión en `POST /api/auth/login`:

```json
{
  "email": "admin@grzasociados.com",
  "password": "TU_CONTRASEÑA_ADMIN"
}
```

2. Copiar el `token` de la respuesta y usarlo en Swagger (botón **Authorize**) o como `Authorization: Bearer <token>`.

3. Crear el técnico con `POST /api/usuarios`:

```json
{
  "email": "tecnico@grzasociados.com",
  "password": "Tecnico2026!",
  "rol": "TECNICO"
}
```

Con ese usuario se puede iniciar sesión en el frontend y comprobar que el técnico consulta solicitudes y cambia estados, pero no registra solicitudes ni cierra una solicitud resuelta.

La colección de Postman (`efsrt2-soporte-tecnico-api/postman`) automatiza estos pasos en la carpeta **00 - Autenticación y usuarios (JWT)**: solo se debe definir la variable `adminPassword`.

## Ejecutar Spring Boot

```powershell
.\mvnw.cmd spring-boot:run
```

El backend estará disponible en:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 3. Ejecutar el frontend

Abrir otra terminal:

```powershell
cd efsrt2-soporte-tecnico-web
```

Instalar dependencias:

```powershell
npm install
```

Ejecutar:

```powershell
npm run dev
```

Normalmente estará disponible en:

```text
http://localhost:5173
```

Si el puerto se encuentra ocupado, Vite puede iniciar en otro puerto, por ejemplo:

```text
http://localhost:5174
```

---

# Autenticación desde Swagger

Para probar endpoints protegidos:

```text
1. Abrir POST /api/auth/login.
2. Ingresar correo y contraseña.
3. Ejecutar la petición.
4. Copiar únicamente el valor de "token".
5. Pulsar "Authorize".
6. Pegar el JWT.
7. Ejecutar los endpoints protegidos.
```

Swagger agrega automáticamente:

```http
Authorization: Bearer <JWT>
```

---

# Pruebas automatizadas

Las pruebas del backend pueden ejecutarse con:

```powershell
.\mvnw.cmd clean test
```

Resultado verificado:

```text
Tests run: 11
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

La suite actualmente incluye:

```text
SoporteTecnicoApiApplicationTests
→ 1 prueba

TecnicoDisponibleValidatorTest
→ 3 pruebas

TransicionEstadoValidatorTest
→ 4 pruebas

PermisoCambioEstadoValidatorTest
→ 3 pruebas
```

Total:

```text
11 pruebas automatizadas
```

---

## Pruebas de disponibilidad

`TecnicoDisponibleValidatorTest` verifica:

```text
Técnico disponible
→ operación permitida

Técnico no disponible
→ ReglaNegocioException

Solicitud sin técnico
→ operación permitida
```

---

## Pruebas de transición de estados

`TransicionEstadoValidatorTest` verifica:

```text
PENDIENTE → EN_PROCESO ✅
EN_PROCESO → RESUELTA ✅
RESUELTA → CERRADA ✅
PENDIENTE → CERRADA ❌
```

---

## Pruebas de permisos

`PermisoCambioEstadoValidatorTest` verifica:

```text
TÉCNICO
RESUELTA → CERRADA
→ bloqueado ✅

ADMINISTRADOR
RESUELTA → CERRADA
→ permitido ✅

TÉCNICO
EN_PROCESO → RESUELTA
→ permitido ✅
```

---

# Pruebas funcionales

También se realizaron pruebas funcionales mediante:

- Swagger UI.
- Postman.
- Frontend React.
- Navegador web.

Se comprobó el flujo:

```text
ADMINISTRADOR
→ registra solicitud
→ PENDIENTE

TÉCNICO
→ Iniciar atención
→ EN_PROCESO

TÉCNICO
→ Marcar resuelta
→ RESUELTA

ADMINISTRADOR
→ Cerrar solicitud
→ CERRADA
```

También se verificaron:

- Login correcto.
- Generación de JWT.
- Bearer Token.
- Acceso por roles.
- Restricción de endpoints administrativos.
- Cierre de sesión.
- Diferenciación visual por roles.
- Manejo de errores.
- Validaciones.
- Persistencia de solicitudes.

---

# Vista del administrador

El administrador visualiza:

```text
Sistema de Soporte Técnico
Gestión y seguimiento de solicitudes de soporte

Registrar nueva solicitud

Solicitudes registradas
```

Puede crear solicitudes y realizar las acciones administrativas correspondientes.

---

# Vista del técnico

El técnico visualiza:

```text
Sistema de Soporte Técnico
Solicitudes asignadas y seguimiento técnico

Solicitudes de soporte
```

No visualiza el formulario para registrar solicitudes.

Según el estado puede visualizar acciones como:

```text
PENDIENTE
→ Iniciar atención

EN_PROCESO
→ Marcar resuelta

RESUELTA
→ Pendiente de cierre

CERRADA
→ Finalizada
```

---

# Principios de diseño

Durante el desarrollo se aplicaron separación de responsabilidades y principios SOLID.

Se utilizaron componentes independientes como:

- Controllers.
- Application Services.
- Services.
- Validators.
- Repositories.
- DTO.
- Mapper.
- Componentes React.
- Servicios frontend.
- SecurityConfig.
- JwtService.
- UsuarioDetailsService.

Un ejemplo de separación de responsabilidades es:

```text
TecnicoDisponibleValidator
→ valida disponibilidad

TransicionEstadoValidator
→ valida el flujo de estados

PermisoCambioEstadoValidator
→ valida permisos del usuario
```

De esta manera, al incorporar una nueva regla no es necesario modificar toda la lógica existente.

Esto reduce el acoplamiento y facilita el mantenimiento y ampliación del sistema.

---

# Integración completa

El flujo general del sistema es:

```text
Usuario
   ↓
React + TypeScript
   ↓
Login / JWT
   ↓
API REST Spring Boot
   ↓
Spring Security
   ↓
Application Service
   ↓
Lógica de negocio
   ↓
Validators
   ↓
Repository
   ↓
JPA / Hibernate
   ↓
MySQL
```

El proyecto integra correctamente las tres capas principales solicitadas:

```text
Vista
→ React + TypeScript

Negocio
→ Spring Boot + Services + Validators

Datos
→ Repository + JPA + Hibernate + MySQL
```

---

# Repositorio

Repositorio general:

```text
https://github.com/MichaelTacas/efsrt2-soporte-tecnico
```

Incluye:

```text
database/
efsrt2-soporte-tecnico-api/
efsrt2-soporte-tecnico-web/
```

---

# Estado actual del proyecto

Actualmente se encuentra implementado:

- Frontend React + TypeScript.
- Backend Spring Boot.
- Base de datos MySQL.
- Arquitectura por capas.
- CRUD.
- DTO y Mapper.
- Application Services.
- Servicios.
- Repositorios.
- Validadores.
- Manejo global de errores.
- Swagger / OpenAPI.
- Spring Security.
- JWT.
- BCrypt.
- Roles `ADMINISTRADOR` y `TECNICO`.
- Control de acceso según rol.
- Login y cierre de sesión.
- Vistas diferenciadas según rol.
- Flujo de estados.
- Validación de permisos.
- 11 pruebas automatizadas.
- Pruebas funcionales de integración.

El sistema cuenta con una base funcional, modular y segura que puede continuar ampliándose mediante nuevos módulos sin modificar innecesariamente los componentes existentes.