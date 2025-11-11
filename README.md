# Vehicle Registry Backend

Backend API construido con **NestJS + TypeORM + PostgreSQL** para gestionar vehículos con autenticación.

## Características

- **NestJS** Framework modular y escalable
- **TypeORM** ORM para PostgreSQL con soporte multi-schema
- **Autenticación JWT** Módulo de auth en schema `auth`
- **Schemas separados** `auth` para usuarios y `public` para datos de la aplicación
- **Validación** class-validator para DTOs
- **Bcrypt** Encriptación de contraseñas

## Estructura del Proyecto

```
src/
├── config/           # Configuración de TypeORM y módulos
├── auth/            # Módulo de autenticación (schema: auth)
│   ├── entities/    # User entity
│   ├── dto/         # DTOs de login/register
│   ├── guards/      # JWT guard
│   └── strategies/  # JWT strategy
├── modules/         # Módulos de negocio (schema: public)
│   └── vehicles/    # Ejemplo: módulo de vehículos
└── common/          # Utilidades compartidas
```

## Pre-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL.

3. Crear la base de datos y schemas:

```sql
CREATE DATABASE vehicle_registry;

\c vehicle_registry;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;
```

4. Ejecutar migraciones (cuando estén disponibles):

```bash
npm run migration:run
```

## Ejecución

### Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run start:prod
```

## Endpoints Principales

### Auth (Schema: auth)

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión (obtiene JWT token)
- `GET /auth/profile` - Obtener perfil del usuario autenticado (requiere JWT)

### Vehicles (Schema: public) - Ejemplo

- `GET /vehicles` - Listar vehículos
- `POST /vehicles` - Crear vehículo (requiere JWT)
- `GET /vehicles/:id` - Obtener vehículo por ID
- `PUT /vehicles/:id` - Actualizar vehículo (requiere JWT)
- `DELETE /vehicles/:id` - Eliminar vehículo (requiere JWT)

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Scripts Útiles

```bash
# Formatear código
npm run format

# Lint
npm run lint

# Generar migración
npm run typeorm migration:generate -- src/migrations/MigrationName

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

## Tecnologías

- [NestJS](https://nestjs.com/) - Framework progresivo de Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript y JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional
- [Passport JWT](http://www.passportjs.org/) - Autenticación con tokens JWT
- [class-validator](https://github.com/typestack/class-validator) - Validación de DTOs

## Licencia

MIT



📝 Comandos Útiles

# Actualizar código
```bash
cd VehicleRegistryBackend
git pull
npm install
npm run build
pm2 restart vehicle-registry-api
```

# Ver logs
```bash
pm2 logs vehicle-registry-api
```

# Monitorear
```bash
pm2 monit
```

🔒 Opcional: Configurar Nginx + HTTPS
Si quieres usar un dominio y HTTPS, sigue la sección de Nginx en DEPLOYMENT.md.

¿Quieres que te ayude con algún paso específico del despliegue?
