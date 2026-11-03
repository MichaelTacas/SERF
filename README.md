# SERF

## Sistema Empresarial de Gestión de Reportes Financieros

SERF es un sistema desarrollado como proyecto académico para el curso **Patrones de Diseño de Software**.

El proyecto tiene como objetivo gestionar información empresarial relacionada con **filiales, productos, clientes, usuarios y ventas**, además de generar reportes financieros aplicando principios SOLID y diferentes patrones de diseño de software.

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

> El frontend se encuentra en proceso de adaptación al nuevo dominio SERF.

---

## Arquitectura

El backend está organizado por responsabilidades:

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
    │   └── resources
    │       └── application.properties
    └── test
```

La estructura busca mantener **bajo acoplamiento, alta cohesión y separación de responsabilidades**.

---

# Funcionalidades principales

SERF permite gestionar:

- Usuarios.
- Clientes.
- Filiales.
- Productos.
- Inventario.
- Ventas.
- Métodos de pago.
- Reportes financieros.
- Autenticación mediante JWT.

Al registrar una venta, el sistema valida automáticamente que exista stock disponible y posteriormente actualiza el inventario.

---

# Patrones de diseño implementados

El proyecto aplica diferentes patrones de diseño.

## Singleton

Clase principal:

```text
ConfiguracionGlobal
```

Permite mantener una única instancia de la configuración global del sistema.

Se utiliza para centralizar configuraciones como la moneda corporativa y el formato de fechas.

---

## Prototype

Clase principal:

```text
PlantillaReporte
```

Permite clonar plantillas de reportes sin crear nuevamente toda su configuración.

Esto facilita generar reportes a partir de una estructura previamente definida.

---

## Builder

Clases principales:

```text
ReporteBuilder
ReporteFinancieroBuilder
ReporteFinanciero
```

Permite construir reportes financieros paso a paso.

La creación del reporte se separa de su representación final.

---

## Composite

Clases principales:

```text
ComponenteReporte
ElementoReporte
SeccionReporte
```

Permite organizar los reportes mediante una estructura jerárquica.

Una sección puede contener diferentes elementos o incluso otras secciones.

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

Permite agregar características adicionales a los reportes sin modificar su estructura principal.

Actualmente se utiliza para agregar:

- Marca de agua.
- Firma digital.

---

## Facade

Clase principal:

```text
ReporteFacade
```

Proporciona una interfaz simplificada para generar reportes financieros.

La fachada coordina internamente los patrones utilizados en la generación del reporte.

---

# Principios SOLID

Durante el desarrollo se aplican principios SOLID para mejorar la mantenibilidad del proyecto.

### SRP - Single Responsibility Principle

Las responsabilidades están separadas en:

```text
Controller
Service
Repository
Mapper
Validator
```

Por ejemplo:

```text
StockDisponibleValidator
```

tiene únicamente la responsabilidad de validar si existe stock suficiente para realizar una venta.

### DIP - Dependency Inversion Principle

Los servicios reciben sus dependencias mediante inyección de dependencias de Spring.

Ejemplo:

```text
VentaServiceImpl
    ↓
VentaRepository
ProductoRepository
StockDisponibleValidator
```

Esto reduce el acoplamiento entre las clases.

---

# Base de datos

La base de datos utilizada es:

```text
serf_db
```

Para crearla puede utilizarse:

```sql
CREATE DATABASE IF NOT EXISTS serf_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE serf_db;
```

Hibernate administra las tablas mediante:

```properties
spring.jpa.hibernate.ddl-auto=update
```
