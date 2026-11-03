# SERF API

Backend del proyecto **SERF - Sistema Empresarial de Gestión de Reportes Financieros**.

Este módulo contiene la API REST desarrollada con **Java 21 y Spring Boot**, encargada de gestionar usuarios, clientes, filiales, productos, ventas, seguridad y generación de reportes financieros.

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

Cada paquete tiene una responsabilidad específica para mantener bajo acoplamiento y alta cohesión.

---

## Capas principales

### Controller

Recibe las solicitudes HTTP y expone los endpoints REST.

Ejemplos:

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

Ejemplos:

```text
ClienteService
FilialService
ProductoService
ReporteService
UsuarioService
VentaService
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

Define los objetos utilizados para recibir y devolver información mediante la API.

### Mapper

Convierte entidades del modelo en DTO y viceversa.

### Validator

Contiene validaciones específicas del negocio.

Actualmente:

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

Las tablas principales corresponden a:

```text
clientes
usuarios
filiales
productos
ventas
```

---

## Variables de entorno

La aplicación utiliza variables de entorno para evitar guardar credenciales directamente en el código.

Variables requeridas:

```text
DB_PASSWORD
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
```

Ejemplo:

```text
DB_PASSWORD=tu_password_mysql
JWT_SECRET=tu_secret_base64
ADMIN_EMAIL=admin@serf.local
ADMIN_PASSWORD=tu_password_admin
```

La clave `JWT_SECRET` debe estar codificada en Base64 y representar una clave de al menos 32 bytes.

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

Swagger también se encuentra habilitado públicamente para fines de desarrollo y pruebas.

El resto de la API requiere autenticación según la configuración de seguridad.

### Roles

```text
ADMINISTRADOR
VENDEDOR
```

---

## Administrador inicial

Al iniciar la aplicación, SERF verifica si existe el administrador configurado mediante:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
```

Si no existe, el sistema puede crear el usuario administrador inicial.

---

## Módulos principales

### Clientes

Permite gestionar la información de clientes.

### Usuarios

Permite gestionar usuarios del sistema.

### Filiales

Permite registrar las diferentes filiales de la empresa.

### Productos

Gestiona información como:

```text
Código
Nombre
Categoría
Costo de importación
Precio de venta
Proveedor
Stock
Filial
```

### Ventas

Registra operaciones de venta asociadas a:

```text
Producto
Cliente
Vendedor
Filial
Cantidad
Precio unitario
Método de pago
```

Antes de registrar una venta se valida la disponibilidad del stock.

---

## Validación de stock

La clase:

```text
StockDisponibleValidator
```

verifica:

- Que la cantidad sea mayor a cero.
- Que exista stock suficiente.

Cuando la venta es válida:

```text
Registrar venta
↓
Descontar stock
↓
Guardar producto actualizado
↓
Guardar venta
```

---

## Reportes financieros

La API permite generar reportes financieros mensuales.

### Reporte manual

```text
POST /api/reportes/mensual
```

Los datos financieros son enviados mediante la solicitud.

### Reporte automático

```text
POST /api/reportes/mensual/automatico
```

El sistema consulta la base de datos para calcular información relacionada con ingresos y costos de productos vendidos.

---

## Patrones de diseño

Los patrones se encuentran en:

```text
com.idat.serf.patterns
```

### Creacionales

```text
Singleton
Prototype
Builder
```

### Estructurales

```text
Composite
Decorator
Facade
```

Principales clases:

```text
ConfiguracionGlobal
PlantillaReporte
ReporteBuilder
ReporteFinancieroBuilder
ComponenteReporte
ElementoReporte
SeccionReporte
ReporteDecorator
MarcaAguaDecorator
FirmaDigitalDecorator
ReporteFacade
```

---

## SOLID

El proyecto aplica principios SOLID mediante:

- Separación entre controladores, servicios y repositorios.
- Validadores independientes.
- Uso de interfaces de servicio.
- Inyección de dependencias mediante constructores.
- Clases con responsabilidades específicas.

Ejemplo:

```text
VentaServiceImpl
├── VentaRepository
├── ProductoRepository
└── StockDisponibleValidator
```

---

## Swagger

Con el backend ejecutándose:

```text
http://localhost:8080/swagger-ui/index.html
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

---

## Ejecutar el proyecto

Desde IntelliJ ejecutar:

```text
SerfApplication.java
```

También puede ejecutarse desde la terminal de Windows:

```bash
mvnw.cmd spring-boot:run
```

El servidor se inicia por defecto en:

```text
http://localhost:8080
```

---

## Pruebas

Las pruebas se encuentran en:

```text
src/test/java/com/idat/serf
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

---

## Proyecto académico

**Curso:** Patrones de Diseño de Software

**Sistema:** SERF - Sistema Empresarial de Gestión de Reportes Financieros