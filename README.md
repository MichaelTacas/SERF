# SERF

## Sistema Empresarial de Gestión de Reportes Financieros

SERF es un sistema desarrollado como proyecto académico para el curso **Patrones de Diseño de Software**.

El sistema permite gestionar información empresarial relacionada con **clientes, filiales, productos, inventario, usuarios y ventas**, además de generar reportes financieros aplicando principios **SOLID** y diferentes **patrones de diseño de software**.

El proyecto está compuesto por un backend desarrollado con Spring Boot, un frontend desarrollado con React y TypeScript, y una base de datos MySQL.

---

## Tecnologías utilizadas

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring MVC
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Maven
- Swagger / OpenAPI

### Base de datos

- MySQL 8
- Base de datos: `serf_db`

### Frontend

- React
- TypeScript
- Vite
- CSS

---

# Estructura del proyecto

```text
SERF
├── database
│   └── scripts de base de datos
│
├── serf-api
│   └── Backend Spring Boot
│
├── serf-web
│   └── Frontend React + TypeScript
│
├── .gitignore
└── README.md
```

---

# Arquitectura del backend

El backend está organizado mediante separación de responsabilidades.

```text
serf-api
└── src
    ├── main
    │   ├── java/com/idat/serf
    │   │   ├── config
    │   │   ├── controller
    │   │   ├── dto
    │   │   ├── exception
    │   │   ├── mapper
    │   │   ├── model
    │   │   ├── patterns
    │   │   ├── repository
    │   │   ├── security
    │   │   ├── service
    │   │   └── validator
    │   │
    │   └── resources
    │       └── application.properties
    │
    └── test
```

Esta organización permite mantener:

- Bajo acoplamiento.
- Alta cohesión.
- Separación de responsabilidades.
- Mayor facilidad de mantenimiento.
- Mayor facilidad para realizar pruebas.

---

# Funcionalidades principales

SERF permite realizar las siguientes operaciones:

- Autenticación mediante JWT.
- Administración de usuarios.
- Administración de clientes.
- Administración de filiales.
- Administración de productos.
- Control de inventario.
- Registro y consulta de ventas.
- Validación automática de stock.
- Actualización automática del inventario después de una venta.
- Generación de reportes financieros.
- Reportes manuales.
- Reportes automáticos utilizando información registrada en el sistema.

---

# Roles del sistema

SERF utiliza dos roles principales.

## Administrador

El Administrador puede acceder a:

```text
Clientes
Filiales
Productos
Ventas
Reportes
Usuarios
```

Puede realizar funciones como:

- Registrar, editar y eliminar clientes.
- Registrar, editar y eliminar filiales.
- Registrar, editar y eliminar productos.
- Configurar precios y stock.
- Consultar las ventas realizadas.
- Generar reportes financieros.
- Registrar nuevos usuarios.
- Crear usuarios con rol Administrador o Vendedor.

El administrador no registra ventas directamente.

---

## Vendedor

El Vendedor puede acceder a:

```text
Clientes
Productos
Ventas
```

Puede:

- Registrar clientes.
- Consultar clientes.
- Editar clientes.
- Consultar productos.
- Consultar precios.
- Consultar stock.
- Registrar ventas.
- Consultar las ventas registradas.

No puede:

- Eliminar clientes.
- Modificar productos.
- Administrar filiales.
- Generar reportes.
- Administrar usuarios.

Cuando registra una venta, el sistema obtiene automáticamente el vendedor autenticado desde el JWT.

---

# Flujo de una venta

El proceso principal funciona de la siguiente manera:

```text
Vendedor inicia sesión
        ↓
Consulta productos
        ↓
Selecciona un cliente
        ↓
Selecciona un producto
        ↓
Indica cantidad
        ↓
SERF identifica automáticamente al vendedor
        ↓
Se valida el stock
        ↓
Se registra la venta
        ↓
Se actualiza el stock
        ↓
La venta queda disponible para consulta
```

Si la cantidad solicitada supera el stock disponible, la operación es rechazada.

---

# Patrones de diseño implementados

SERF aplica diferentes patrones de diseño para resolver problemas específicos del sistema.

---

## Singleton

Clase principal:

```text
ConfiguracionGlobal
```

Permite mantener una única instancia de la configuración global del sistema.

Se utiliza para centralizar configuraciones utilizadas durante la generación de reportes, como la moneda corporativa y otros parámetros generales.

---

## Prototype

Clase principal:

```text
PlantillaReporte
```

Permite crear nuevas plantillas de reportes mediante clonación.

De esta forma no es necesario construir nuevamente una plantilla completa cada vez que se genera un nuevo reporte.

---

## Builder

Clases principales:

```text
ReporteBuilder
ReporteFinancieroBuilder
ReporteFinanciero
```

Permite construir reportes financieros paso a paso.

La construcción del reporte se separa de su representación final, facilitando la incorporación de nuevas secciones.

---

## Composite

Clases principales:

```text
ComponenteReporte
ElementoReporte
SeccionReporte
```

Permite representar el reporte utilizando una estructura jerárquica.

Una sección puede contener:

```text
Sección
├── Elemento
├── Elemento
└── Otra sección
```

Esto facilita la construcción de reportes complejos a partir de elementos más pequeños.

---

## Decorator

Clases principales:

```text
ReporteExportable
ReporteBase
ReporteDecorator
MarcaAguaDecorator
FirmaDigitalDecorator
```

Permite agregar nuevas características a un reporte sin modificar directamente su implementación principal.

Actualmente se utiliza para incorporar:

- Marca de agua.
- Firma digital.

La firma del reporte se obtiene del usuario Administrador autenticado.

---

## Facade

Clase principal:

```text
ReporteFacade
```

Proporciona una interfaz simplificada para generar reportes financieros.

La fachada coordina internamente diferentes componentes y patrones utilizados durante la generación del reporte.

De esta forma, el controlador no necesita conocer todos los pasos internos necesarios para construirlo.

---

# Principios SOLID

El proyecto aplica principios SOLID para mejorar su mantenibilidad.

## SRP - Single Responsibility Principle

Cada componente tiene una responsabilidad específica.

Ejemplo:

```text
Controller → recibe solicitudes HTTP
Service → contiene lógica de negocio
Repository → acceso a datos
Validator → validaciones específicas
Mapper → conversión de objetos
```

Por ejemplo:

```text
StockDisponibleValidator
```

tiene únicamente la responsabilidad de verificar que exista stock suficiente antes de registrar una venta.

---

## DIP - Dependency Inversion Principle

Las dependencias son proporcionadas mediante inyección de dependencias de Spring.

Ejemplo:

```text
VentaServiceImpl
      ↓
VentaRepository
ProductoRepository
StockDisponibleValidator
```

Esto permite reducir el acoplamiento entre las clases y facilita las pruebas.

---

# Seguridad

SERF utiliza:

- Spring Security.
- JWT.
- Autenticación mediante correo y contraseña.
- Autorización basada en roles.

El token contiene información del usuario autenticado, incluyendo:

```text
correo
rol
usuarioId
```

Los permisos también se validan en el backend.

Por ejemplo:

```text
ADMINISTRADOR
→ acceso a Usuarios, Filiales y Reportes

VENDEDOR
→ registro de Ventas
→ consulta de Productos
→ gestión limitada de Clientes
```

Ocultar opciones en el frontend mejora la experiencia de usuario, pero la seguridad principal se encuentra en el backend.

---

# Reportes financieros

SERF permite generar dos tipos de reportes.

## Reporte automático

Los ingresos y gastos son calculados utilizando información registrada en las ventas y productos del sistema.

```text
Ventas
   ↓
Ingresos
   ↓
Costos de productos
   ↓
Gastos
   ↓
Reporte financiero
```

---

## Reporte manual

Permite ingresar valores financieros manualmente para generar un reporte.

El responsable del reporte no puede modificarse manualmente.

El backend obtiene automáticamente al Administrador autenticado mediante Spring Security y JWT.

---

# Base de datos

La base de datos utilizada es:

```text
serf_db
```

Puede crearse mediante:

```sql
CREATE DATABASE IF NOT EXISTS serf_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE serf_db;
```

Hibernate administra la estructura de las tablas mediante:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# Ejecución del backend

Ingresar a:

```text
SERF/serf-api
```

Configurar las variables de entorno requeridas:

```text
DB_USER
DB_PASSWORD
JWT_SECRET
JWT_ISSUER
ADMIN_EMAIL
ADMIN_PASSWORD
```

Luego ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

El backend se ejecutará normalmente en:

```text
http://localhost:8080
```

> Por seguridad, las contraseñas y claves JWT no se almacenan en el repositorio.

---

# Ejecución del frontend

Abrir otra terminal e ingresar a:

```text
SERF/serf-web
```

Ejecutar:

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:5173
```

---

# Pruebas realizadas

Durante el desarrollo se probaron los principales flujos del sistema.

## Administrador

- Inicio de sesión.
- Gestión de clientes.
- Gestión de filiales.
- Gestión de productos.
- Consulta de ventas.
- Generación de reportes.
- Registro de usuarios.
- Validación de permisos.

## Vendedor

- Inicio de sesión.
- Registro de clientes.
- Edición de clientes.
- Consulta de productos.
- Consulta de stock.
- Registro de ventas.
- Asignación automática del vendedor autenticado.
- Actualización automática del stock.
- Restricción de módulos administrativos.

También se realizaron pruebas sobre componentes relacionados con los patrones de diseño y validaciones del sistema.

---

# Swagger / OpenAPI

El backend utiliza Swagger para documentar y probar los endpoints REST.

Con el backend ejecutándose, la documentación puede consultarse desde Swagger UI.

Desde Swagger es posible probar operaciones relacionadas con:

- Clientes.
- Filiales.
- Productos.
- Ventas.
- Usuarios.
- Reportes.

Las operaciones protegidas requieren autenticación.

---

# Buenas prácticas aplicadas

Durante el desarrollo se priorizaron:

- Separación de responsabilidades.
- Bajo acoplamiento.
- Alta cohesión.
- Inyección de dependencias.
- Validaciones independientes.
- Manejo centralizado de errores.
- Seguridad basada en roles.
- Código organizado por capas.
- Patrones de diseño reutilizables.
- Uso de DTO para transferencia de información.

---

# Proyecto académico

**Curso:** Patrones de Diseño de Software

**Proyecto:** SERF - Sistema Empresarial de Gestión de Reportes Financieros

El proyecto demuestra la aplicación práctica de principios SOLID y patrones de diseño dentro de un sistema empresarial compuesto por backend, frontend y base de datos.