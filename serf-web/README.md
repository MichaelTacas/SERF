# Sistema de Soporte Técnico - Frontend

Frontend web desarrollado para la gestión de solicitudes de soporte técnico.

La aplicación permite iniciar sesión, identificar el rol del usuario, registrar y consultar solicitudes, seleccionar clientes y técnicos disponibles, actualizar estados y mostrar diferentes funcionalidades según el perfil autenticado.

El frontend se encuentra conectado con una API REST desarrollada en Spring Boot y protegida mediante Spring Security y JWT.

---

# Tecnologías utilizadas

- React
- TypeScript
- Vite
- HTML
- CSS
- Fetch API
- Local Storage
- JWT para autenticación

---

# Funcionalidades implementadas

Actualmente el frontend permite:

- Iniciar sesión mediante correo y contraseña.
- Recibir y almacenar un token JWT.
- Mantener información básica del usuario autenticado.
- Cerrar sesión.
- Diferenciar la interfaz según el rol.
- Registrar nuevas solicitudes de soporte como administrador.
- Ingresar título y descripción del problema.
- Seleccionar prioridad:
  - BAJA
  - MEDIA
  - ALTA
- Seleccionar un cliente registrado.
- Consultar y seleccionar técnicos disponibles.
- Registrar solicitudes sin técnico asignado cuando corresponda.
- Listar solicitudes existentes.
- Mostrar información del cliente y técnico asociado.
- Visualizar prioridad y estado.
- Actualizar estados.
- Mostrar acciones según el rol y estado actual.
- Mostrar mensajes de éxito o error.
- Enviar automáticamente el JWT al backend.

---

# Autenticación

El sistema cuenta con una pantalla de inicio de sesión.

El usuario ingresa:

```text
Correo electrónico
Contraseña
```

El frontend envía las credenciales a:

```text
POST /api/auth/login
```

Si las credenciales son correctas, el backend devuelve información similar a:

```json
{
  "token": "eyJ...",
  "tipo": "Bearer",
  "expiraEnSegundos": 3600,
  "usuarioId": 1,
  "email": "usuario@grzasociados.com",
  "rol": "ADMINISTRADOR"
}
```

El frontend guarda la sesión utilizando:

```text
auth_token
auth_user
```

en `Local Storage`.

---

# Flujo de autenticación

```text
Usuario
   ↓
LoginPage
   ↓
authService.login()
   ↓
POST /api/auth/login
   ↓
Spring Security
   ↓
JWT
   ↓
Local Storage
   ↓
App.tsx
   ↓
Vista según rol
```

Cuando el usuario cierra sesión:

```text
auth_token → eliminado
auth_user  → eliminado
```

y la aplicación vuelve automáticamente a `LoginPage`.

---

# Roles del sistema

La aplicación diferencia actualmente dos roles:

```text
ADMINISTRADOR
TECNICO
```

---

## Vista del ADMINISTRADOR

El administrador puede visualizar:

- Formulario para registrar solicitudes.
- Listado general de solicitudes.
- Cliente asignado.
- Técnico asignado.
- Prioridad.
- Estado.
- Acciones administrativas permitidas.
- Cierre de solicitudes resueltas.

Ejemplo visual:

```text
Sistema de Soporte Técnico

Gestión y seguimiento de solicitudes de soporte

Registrar nueva solicitud

Solicitudes registradas
```

El administrador puede realizar el cierre definitivo:

```text
RESUELTA
   ↓
Cerrar solicitud
   ↓
CERRADA
```

---

## Vista del TÉCNICO

El técnico visualiza:

- Solicitudes de soporte.
- Título.
- Prioridad.
- Estado.
- Cliente.
- Técnico asignado.
- Acciones relacionadas con la atención.

El técnico no visualiza el formulario:

```text
Registrar nueva solicitud
```

Su flujo de trabajo es:

```text
PENDIENTE
   ↓
Iniciar atención
   ↓
EN_PROCESO
   ↓
Marcar resuelta
   ↓
RESUELTA
   ↓
Pendiente de cierre
```

El técnico no puede cerrar definitivamente una solicitud.

Cuando una solicitud ya está cerrada se muestra:

```text
Finalizada
```

---

# Estados de las solicitudes

Las solicitudes siguen el flujo:

```text
PENDIENTE
    ↓
EN_PROCESO
    ↓
RESUELTA
    ↓
CERRADA
```

Las reglas de negocio relacionadas con las transiciones se validan principalmente en el backend.

---

# Flujo según rol

```text
ADMINISTRADOR
      ↓
Registra solicitud
      ↓
PENDIENTE

TÉCNICO
      ↓
Iniciar atención
      ↓
EN_PROCESO

TÉCNICO
      ↓
Marcar resuelta
      ↓
RESUELTA

ADMINISTRADOR
      ↓
Cerrar solicitud
      ↓
CERRADA
```

---

# Estructura principal

```text
src
├── components
│   ├── AppHeader.tsx
│   ├── SolicitudForm.tsx
│   └── SolicitudEstadoAction.tsx
│
├── interfaces
│   ├── AuthResponse.ts
│   ├── Cliente.ts
│   ├── LoginRequest.ts
│   ├── Solicitud.ts
│   ├── SolicitudRequest.ts
│   └── Tecnico.ts
│
├── pages
│   ├── LoginPage.tsx
│   └── SolicitudesPage.tsx
│
├── services
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── clienteService.ts
│   ├── solicitudService.ts
│
├── styles
│   ├── AppHeader.css
│   ├── Login.css
│   └── Solicitudes.css
│
├── App.tsx
├── index.css
└── main.tsx
```

---

# Responsabilidad de los componentes

## App.tsx

Es el componente principal de la aplicación.

Se encarga de:

- Verificar si existe una sesión.
- Mostrar `LoginPage` cuando no existe autenticación.
- Mostrar la aplicación cuando el usuario está autenticado.
- Coordinar el cierre de sesión.

Flujo:

```text
¿Existe sesión?

NO
→ LoginPage

SÍ
→ AppHeader
→ SolicitudesPage
```

---

## LoginPage.tsx

Es la pantalla encargada de capturar:

- Correo electrónico.
- Contraseña.

Se comunica con:

```text
authService.login()
```

Si el login es correcto, cambia el estado de la aplicación y permite acceder al sistema.

---

## AppHeader.tsx

Muestra información del usuario autenticado:

```text
Correo
Rol
Cerrar sesión
```

Ejemplo administrador:

```text
admin@grzasociados.com
Administrador
```

Ejemplo técnico:

```text
tecnico@grzasociados.com
Técnico
```

---

## SolicitudesPage.tsx

Es la pantalla principal de gestión de solicitudes.

Se encarga de:

- Cargar las solicitudes.
- Detectar el rol del usuario.
- Mostrar contenido según el perfil.
- Coordinar el registro de solicitudes.
- Coordinar cambios de estado.
- Mostrar el listado general.

El formulario `SolicitudForm` solamente se renderiza cuando:

```text
rol = ADMINISTRADOR
```

---

## SolicitudForm.tsx

Componente encargado de capturar los datos necesarios para registrar una nueva solicitud.

Permite ingresar:

- Título.
- Descripción.
- Prioridad.
- Cliente.
- Técnico disponible.

Este componente actualmente se muestra únicamente al administrador.

---

## SolicitudEstadoAction.tsx

Componente responsable de mostrar las acciones disponibles según:

- Rol del usuario.
- Estado de la solicitud.

### Técnico

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

### Administrador

```text
PENDIENTE
→ Pendiente de atención

EN_PROCESO
→ En atención

RESUELTA
→ Cerrar solicitud

CERRADA
→ Finalizada
```

---

# Servicios

La comunicación con el backend se mantiene separada de los componentes visuales.

---

## authService.ts

Gestiona la autenticación del usuario.

Sus principales responsabilidades son:

- Iniciar sesión.
- Guardar el JWT.
- Guardar información del usuario.
- Obtener el token.
- Obtener el usuario autenticado.
- Verificar si existe una sesión.
- Cerrar sesión.

Utiliza:

```text
auth_token
auth_user
```

en `Local Storage`.

---

## apiClient.ts

Centraliza la comunicación HTTP con la API.

Actualmente permite trabajar con:

```text
GET
POST
PUT
```

Además, recupera automáticamente el JWT mediante:

```text
authService.obtenerToken()
```

y agrega:

```http
Authorization: Bearer <token>
```

a las peticiones protegidas.

También diferencia algunos errores:

```text
401 Unauthorized
→ sesión inválida o expirada

403 Forbidden
→ usuario sin permisos para la acción
```

---

## solicitudService.ts

Gestiona operaciones relacionadas con solicitudes.

Entre ellas:

- Listar.
- Registrar.
- Actualizar.

---

## clienteService.ts

Obtiene la información de los clientes registrados desde el backend.

---

## tecnicoService.ts

Obtiene los técnicos disponibles para ser asignados a las solicitudes.

---

# Integración con el backend

El frontend consume una API REST desarrollada con Spring Boot.

El flujo actual es:

```text
Usuario
   ↓
React + TypeScript
   ↓
Login / JWT
   ↓
Services
   ↓
apiClient
   ↓
Authorization: Bearer <JWT>
   ↓
API REST Spring Boot
   ↓
Spring Security
   ↓
Lógica de negocio
   ↓
Repository / JPA
   ↓
MySQL
```

El backend se ejecuta normalmente en:

```text
http://localhost:8080
```

El frontend se ejecuta normalmente en:

```text
http://localhost:5173
```

Si el puerto `5173` está ocupado, Vite puede seleccionar otro puerto, por ejemplo:

```text
http://localhost:5174
```

---

# Proxy de desarrollo

Vite está configurado para redirigir solicitudes realizadas a:

```text
/api
```

hacia:

```text
http://localhost:8080
```

Ejemplo:

```text
Frontend

GET /api/solicitudes

       ↓

Vite Proxy

       ↓

Backend

http://localhost:8080/api/solicitudes
```

Esto permite evitar colocar la URL completa del backend en cada servicio.

---

# Seguridad del frontend

La interfaz utiliza el rol del usuario para determinar qué componentes se muestran.

Ejemplo:

```tsx
const esAdministrador =
    usuario?.rol === "ADMINISTRADOR";
```

Luego React puede utilizar renderizado condicional:

```text
ADMINISTRADOR
→ muestra SolicitudForm

TECNICO
→ no muestra SolicitudForm
```

Sin embargo, estas restricciones visuales no representan por sí solas la seguridad del sistema.

El backend también utiliza Spring Security y validadores para impedir operaciones no autorizadas aunque el usuario intente ejecutarlas directamente mediante Swagger o Postman.

---

# Manejo de sesión

Cuando el login es correcto:

```text
JWT
↓
auth_token
```

y:

```text
Datos del usuario
↓
auth_user
```

Cuando se presiona:

```text
Cerrar sesión
```

se eliminan ambos valores y el usuario vuelve a la pantalla de login.

---

# Requisitos

Antes de ejecutar el frontend se necesita:

- Node.js instalado.
- npm instalado.
- Backend Spring Boot en ejecución.
- Base de datos MySQL configurada.
- Usuario válido para iniciar sesión.

---

# Instalación

Desde la carpeta:

```powershell
cd efsrt2-soporte-tecnico-web
```

instalar dependencias:

```powershell
npm install
```

---

# Ejecución

Iniciar el servidor de desarrollo:

```powershell
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173/
```

Abrir esa dirección desde el navegador.

---

# Ejecución completa del sistema

Para utilizar la aplicación deben encontrarse activos:

```text
MySQL
  ↓
Spring Boot :8080
  ↓
React / Vite :5173
```

---

## 1. Preparar la base de datos

El script se encuentra en:

```text
database/setup.sql
```

La base utilizada es:

```text
soporte_tecnico_db
```

---

## 2. Iniciar el backend

Desde:

```text
efsrt2-soporte-tecnico-api
```

configurar las variables necesarias y ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

Debe estar disponible en:

```text
http://localhost:8080
```

---

## 3. Iniciar el frontend

Desde:

```text
efsrt2-soporte-tecnico-web
```

ejecutar:

```powershell
npm run dev
```

---

## 4. Abrir la aplicación

Ingresar a la dirección mostrada por Vite:

```text
http://localhost:5173/
```

---

## 5. Iniciar sesión

Ingresar con un usuario registrado en el sistema.

Dependiendo del rol:

```text
ADMINISTRADOR
→ vista administrativa

TECNICO
→ vista de atención
```

---

# Diseño de la interfaz

La aplicación utiliza un diseño oscuro y adaptable.

Se priorizó:

- Organización visual clara.
- Login independiente.
- Identificación del usuario autenticado.
- Identificación del rol.
- Cabecera del sistema.
- Separación entre formulario y listado.
- Campos correctamente identificados.
- Uso de listas desplegables.
- Visualización clara de prioridades.
- Visualización clara de estados.
- Acciones específicas según el rol.
- Acciones específicas según el estado.
- Diseño responsive.
- Botón de cierre de sesión.

---

# Principios aplicados

Durante el desarrollo se mantuvieron responsabilidades separadas.

```text
LoginPage
→ captura las credenciales

authService
→ gestiona autenticación y sesión

AppHeader
→ muestra información del usuario

SolicitudForm
→ captura datos de nuevas solicitudes

SolicitudEstadoAction
→ determina acciones según rol y estado

SolicitudesPage
→ coordina la pantalla principal

Services
→ encapsulan operaciones de cada recurso

apiClient
→ centraliza HTTP y JWT
```

Esta separación aplica principalmente el principio de Responsabilidad Única de SOLID.

También facilita agregar nuevas funcionalidades sin modificar innecesariamente componentes existentes.

---

# Flujo funcional comprobado

Durante las pruebas se verificó el siguiente flujo:

```text
ADMINISTRADOR
→ inicia sesión
→ registra solicitud
→ PENDIENTE

TÉCNICO
→ inicia sesión
→ visualiza solicitud
→ Iniciar atención
→ EN_PROCESO
→ Marcar resuelta
→ RESUELTA

ADMINISTRADOR
→ inicia sesión
→ Cerrar solicitud
→ CERRADA
```

El técnico no puede realizar el cierre definitivo.

---

# Relación con el proyecto completo

Este frontend forma parte de:

```text
efsrt2-soporte-tecnico
```

y trabaja en conjunto con:

```text
efsrt2-soporte-tecnico-api
```

La persistencia se realiza en MySQL a través del backend.

La arquitectura general es:

```text
Vista
React + TypeScript
        ↓
Autenticación
JWT
        ↓
API / Controller
Spring Boot
        ↓
Spring Security
        ↓
Lógica de negocio
Services + Validators
        ↓
Acceso a datos
Repository + JPA / Hibernate
        ↓
Base de datos
MySQL
```

---

# Estado actual

Actualmente el frontend cuenta con:

- React + TypeScript.
- Vite.
- Diseño oscuro.
- Login.
- Autenticación JWT.
- Local Storage.
- Cierre de sesión.
- Vista del administrador.
- Vista del técnico.
- Registro de solicitudes para administradores.
- Seguimiento de solicitudes para técnicos.
- Actualización de estados.
- Restricciones visuales según rol.
- Integración con Spring Security.
- Envío automático de JWT.
- Manejo de respuestas `401` y `403`.
- Integración completa con backend y MySQL.

El frontend se encuentra funcionalmente integrado con las capas de negocio y datos del sistema.