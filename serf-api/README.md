# SERF API

Backend del proyecto **SERF - Sistema Empresarial de Gestión de Reportes Financieros**.

Este módulo contiene la API REST desarrollada con **Java 21 y Spring Boot 4.1.1**, encargada de gestionar usuarios, clientes, filiales, productos, ventas, seguridad, inventario y generación de reportes financieros.

---

## Tecnologías

- Java 21
- Spring Boot 4.1.1
- Spring MVC
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- MySQL 8
- Maven
- Swagger / OpenAPI
- JUnit 5

---

## Estructura del backend

```text
src/main/java/com/idat/serf
├── config
├── controller
├── dto
├── exception
├── mapper
├── model
├── patterns
├── repository
├── security
├── service
├── validator
└── SerfApplication.java
```

Cada paquete mantiene una responsabilidad específica para favorecer:

- Bajo acoplamiento.
- Alta cohesión.
- Separación de responsabilidades.
- Mantenibilidad.
- Facilidad para realizar pruebas.

---

## Capas principales

### Controller

Recibe las solicitudes HTTP y expone los endpoints REST.

```text
AuthController
ClienteController
FilialController
ProductoController
ReporteController
UsuarioController
VentaController
```

### Service

Contiene la lógica de negocio.

```text
ClienteService
FilialService
ProductoService
ReporteService
UsuarioService
VentaService
```

Las implementaciones se encuentran principalmente en:

```text
service/impl
```

### Repository

Gestiona el acceso a la base de datos mediante Spring Data JPA.

```text
ClienteRepository
FilialRepository
ProductoRepository
UsuarioRepository
VentaRepository
```

### DTO

Define los objetos utilizados para recibir y transferir información mediante la API.

### Mapper

Convierte entidades del modelo en DTO y viceversa cuando corresponde.

### Validator

Contiene validaciones específicas del negocio.

Actualmente destaca:

```text
StockDisponibleValidator
```

---

## Base de datos

El sistema utiliza:

```text
MySQL 8
```

Base de datos:

```text
serf_db
```

Configuración principal:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/serf_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
```

Tablas principales:

```text
clientes
usuarios
filiales
productos
ventas
```

Hibernate actualiza la estructura mediante:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Variables de entorno

La aplicación utiliza variables de entorno para evitar almacenar credenciales directamente en el código.

```text
DB_USER
DB_PASSWORD
JWT_SECRET
JWT_ISSUER
ADMIN_EMAIL
ADMIN_PASSWORD
```

Ejemplo:

```text
DB_USER=root
DB_PASSWORD=tu_password_mysql
JWT_SECRET=tu_secret_base64
JWT_ISSUER=serf-api
ADMIN_EMAIL=admin@serf.local
ADMIN_PASSWORD=tu_password_admin
```

La clave `JWT_SECRET` debe encontrarse codificada correctamente y cumplir con la longitud requerida por la configuración JWT.

---

## Seguridad

La API utiliza:

```text
Spring Security
JWT
```

Endpoint público de autenticación:

```text
POST /api/auth/login
```

El resto de operaciones se protege según el rol del usuario.

### Roles

```text
ADMINISTRADOR
VENDEDOR
```

El JWT permite identificar al usuario autenticado y utilizar datos como:

```text
correo
rol
usuarioId
```

Esto permite, por ejemplo, identificar automáticamente al vendedor al registrar una venta.

---

## Administrador inicial

Al iniciar la aplicación, SERF verifica la existencia del administrador configurado mediante:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
```

Si no existe, el sistema puede crear el usuario administrador inicial según la configuración del proyecto.

---

# Productos e importaciones

El módulo de Productos permite gestionar información como:

```text
Código
Nombre
Descripción
Categoría
Costo de importación
Costo convertido a EUR
Precio de venta
Proveedor
Fecha de importación
Stock
Filial
```

## Conversión CNY → EUR

El costo de importación se registra en **CNY**.

Posteriormente el sistema calcula automáticamente su equivalente en **EUR**, que corresponde a la moneda corporativa configurada.

Flujo:

```text
Costo importación en CNY
        ↓
ProductoServiceImpl
        ↓
ConfiguracionGlobal
        ↓
Conversión CNY → EUR
        ↓
Costo importación en EUR
```

La configuración global utiliza el patrón **Singleton**.

El tipo de cambio utilizado en el proyecto es configurable y se utiliza con fines académicos; no representa necesariamente una cotización de mercado en tiempo real.

---

# Ventas

Las ventas se encuentran asociadas a:

```text
Producto
Cliente
Vendedor
Filial
Cantidad
Precio unitario
Método de pago
```

Antes de registrar una venta se verifica la disponibilidad del stock.

Flujo:

```text
Solicitud de venta
        ↓
VentaService
        ↓
StockDisponibleValidator
        ↓
ProductoRepository
        ↓
Validación de stock
        ↓
VentaRepository
        ↓
Registro de venta
        ↓
Actualización de stock
```

---

## Validación de stock

La clase:

```text
StockDisponibleValidator
```

verifica:

- Que la cantidad sea válida.
- Que exista stock suficiente.
- Que no se registre una venta superior al inventario disponible.

Si no existe suficiente stock, la operación es rechazada.

---

# Reportes financieros

SERF permite generar reportes financieros utilizando diferentes periodos.

## Reporte mensual

```text
POST /api/reportes/mensual
```

Genera un reporte mensual utilizando los ingresos y gastos enviados en la solicitud.

---

## Reporte trimestral

```text
POST /api/reportes/trimestral
```

Genera un reporte trimestral de gastos e ingresos.

---

## Reporte anual

```text
POST /api/reportes/anual
```

Genera un reporte anual consolidado.

---

## Reporte mensual automático

```text
POST /api/reportes/mensual/automatico
```

En este caso SERF obtiene automáticamente información registrada en el sistema.

Flujo general:

```text
Ventas registradas
       ↓
Ingresos
       ↓
Productos vendidos
       ↓
Costos
       ↓
Gastos
       ↓
Reporte mensual automático
```

El responsable del reporte se obtiene automáticamente del usuario Administrador autenticado mediante Spring Security.

---

# Patrón Prototype en reportes

La clase principal es:

```text
PlantillaReporte
```

SERF utiliza plantillas base para:

```text
Reporte mensual de ingresos
Reporte trimestral de gastos e ingresos
Reporte anual consolidado
```

Cada plantilla puede ser clonada mediante:

```java
PlantillaReporte copia = plantilla.clonar();
```

Esto evita construir nuevamente toda la configuración del reporte cada vez que se necesita generar uno nuevo.

---

# Patrones de diseño

Los patrones se encuentran principalmente en:

```text
com.idat.serf.patterns
```

## Creacionales

```text
Singleton
Prototype
Builder
```

## Estructurales

```text
Composite
Decorator
Facade
```

Clases principales:

```text
ConfiguracionGlobal
PlantillaReporte
ReporteBuilder
ReporteFinancieroBuilder
ReporteFinanciero
ComponenteReporte
ElementoReporte
SeccionReporte
ReporteExportable
ReporteBase
ReporteDecorator
MarcaAguaDecorator
FirmaDigitalDecorator
ReporteFacade
```

---

## Singleton

```text
ConfiguracionGlobal
```

Centraliza:

- Moneda corporativa.
- Formato de fecha.
- Tipo de cambio CNY → EUR.
- Conversión monetaria.

---

## Prototype

```text
PlantillaReporte
```

Permite clonar las plantillas base utilizadas para los reportes mensuales, trimestrales y anuales.

---

## Builder

```text
ReporteBuilder
ReporteFinancieroBuilder
ReporteFinanciero
```

Construye el reporte financiero paso a paso.

---

## Composite

```text
ComponenteReporte
ElementoReporte
SeccionReporte
```

Permite construir secciones jerárquicas dentro de un reporte.

---

## Decorator

```text
ReporteBase
ReporteDecorator
MarcaAguaDecorator
FirmaDigitalDecorator
```

Permite agregar características al reporte sin modificar su implementación principal.

Actualmente se agregan:

```text
Marca de agua
Firma digital
```

---

## Facade

```text
ReporteFacade
```

Simplifica la generación de reportes y coordina internamente los demás patrones.
