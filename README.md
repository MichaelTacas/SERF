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
- JUnit 5

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
- Registro del costo de importación en CNY.
- Conversión automática del costo de importación de CNY a EUR.
- Generación de reportes financieros.
- Reporte mensual de ingresos.
- Reporte trimestral de gastos e ingresos.
- Reporte anual consolidado.
- Reporte mensual automático utilizando información registrada en SERF.

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
- Generar reportes mensuales, trimestrales y anuales.
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

# Gestión de productos importados

Los productos permiten registrar información relacionada con su importación.

Entre los datos principales se encuentran:

```text
Código
Nombre
Categoría
Costo de importación
Costo convertido a EUR
Precio de venta
Proveedor
Fecha de importación
Stock
Filial
```

El costo de importación se registra en **CNY (yuan chino)**.

SERF utiliza la configuración global del sistema para convertir automáticamente este costo a **EUR**, que corresponde a la moneda corporativa.

Flujo:

```text
Costo de importación en CNY
        ↓
ConfiguracionGlobal
        ↓
Tipo de cambio CNY → EUR
        ↓
Costo de importación en EUR
        ↓
Registro del producto
```

Para fines académicos, el proyecto utiliza un tipo de cambio configurable definido en `ConfiguracionGlobal`.

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

## Singleton

Clase principal:

```text
ConfiguracionGlobal
```

Permite mantener una única instancia de la configuración global del sistema.

Actualmente centraliza:

- Moneda corporativa: EUR.
- Formato de fecha.
- Tipo de cambio utilizado para CNY → EUR.
- Conversión de moneda.

---

## Prototype

Clase principal:

```text
PlantillaReporte
```

Permite crear nuevas plantillas de reportes mediante clonación.

El sistema dispone de plantillas base para:

```text
Reporte mensual de ingresos
Reporte trimestral de gastos e ingresos
Reporte anual consolidado
```

Cuando se genera un nuevo reporte, se clona la plantilla correspondiente en lugar de construir toda su estructura nuevamente.

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

```text
Sección
├── Elemento
├── Elemento
└── Otra sección
```

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

Permite agregar características al reporte sin modificar directamente su implementación principal.

Actualmente se utiliza para incorporar:

- Marca de agua.
- Firma digital.

La firma se obtiene del usuario Administrador autenticado.

---

## Facade

Clase principal:

```text
ReporteFacade
```

Proporciona una interfaz simplificada para generar los reportes financieros.

La fachada coordina:

```text
Singleton
Prototype
Composite
Builder
Decorator
```

También permite generar:

```text
generarReporteMensual()
generarReporteTrimestral()
generarReporteAnual()
```

---

# Principios SOLID

El proyecto aplica principios SOLID para mejorar su mantenibilidad.

## SRP - Single Responsibility Principle

Cada componente tiene una responsabilidad específica.

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

El módulo de Reportes está disponible únicamente para el Administrador.

SERF permite generar reportes manuales de diferentes periodos y un reporte mensual automático.

## Reporte mensual

```text
POST /api/reportes/mensual
```

Genera un reporte mensual utilizando los valores de ingresos y gastos proporcionados.

---

## Reporte trimestral

```text
POST /api/reportes/trimestral
```

Genera un reporte trimestral de gastos e ingresos utilizando la plantilla correspondiente del patrón Prototype.

---

## Reporte anual

```text
POST /api/reportes/anual
```

Genera un reporte anual consolidado utilizando la plantilla correspondiente del patrón Prototype.

---

## Reporte mensual automático

```text
POST /api/reportes/mensual/automatico
```

Los ingresos y gastos son obtenidos automáticamente desde la información registrada en SERF.

Flujo general:

```text
Ventas
   ↓
Ingresos
   ↓
Productos vendidos
   ↓
Costos
   ↓
Gastos
   ↓
Reporte financiero mensual
```

---

## Interfaz de reportes

Desde el frontend el Administrador puede seleccionar:

```text
Reporte manual

Tipo de reporte:
├── Mensual
├── Trimestral
└── Anual
```

Después ingresa:

```text
País
Ingresos
Gastos
```

El responsable es obtenido automáticamente desde la sesión autenticada.

El frontend selecciona el endpoint correspondiente según el periodo elegido.

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

Hibernate administra la estructura mediante:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Entre las tablas principales se encuentran:

```text
clientes
usuarios
filiales
productos
ventas
```

La tabla `productos` también almacena el costo de importación y su valor convertido a EUR.

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

En la configuración actual del proyecto, el backend se ejecuta en:

```text
http://localhost:8030
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

# Swagger / OpenAPI

Con el backend ejecutándose:

```text
http://localhost:8030/swagger-ui/index.html
```

Swagger permite probar los módulos:

```text
Auth
Clientes
Usuarios
Filiales
Productos
Ventas
Reportes
```

En `reporte-controller` se encuentran:

```text
POST /api/reportes/mensual
POST /api/reportes/trimestral
POST /api/reportes/anual
POST /api/reportes/mensual/automatico
```

Las operaciones protegidas requieren autenticación mediante JWT.

---

# Pruebas

Las pruebas se encuentran en:

```text
serf-api/src/test/java/com/idat/serf
```

Incluyen pruebas para:

```text
Singleton
Prototype
Builder
Composite
Decorator
Facade
StockDisponibleValidator
Contexto de Spring Boot
```

Entre las clases principales:

```text
ConfiguracionGlobalTest
PlantillaReporteTest
ReporteBuilderTest
CompositeTest
DecoratorTest
ReporteFacadeTest
StockDisponibleValidatorTest
SerfApplicationTests
```

En la ejecución realizada mediante Maven se obtuvo:

```text
Tests run: 10
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

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
- Validaciones de reglas de negocio.
- Separación entre frontend y backend.

---

# Proyecto académico

**Curso:** Patrones de Diseño de Software

**Proyecto:** SERF - Sistema Empresarial de Gestión de Reportes Financieros

El proyecto demuestra la aplicación práctica de programación orientada a objetos, principios SOLID y patrones de diseño dentro de un sistema empresarial compuesto por backend, frontend y base de datos.