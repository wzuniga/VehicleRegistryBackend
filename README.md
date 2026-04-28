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

### Producción (rápida)

```bash
npm run build
npm run start:prod
```

## Despliegue a Producción (clásico y eficiente)

La opción más usada y estable para un VPS es:

- NestJS compilado (`dist/`)
- PM2 como process manager
- Nginx como reverse proxy (opcional pero recomendado)

Este proyecto ya incluye configuración lista para ese enfoque en `ecosystem.config.js` y un script de despliegue en `deployBackend.sh`.

### 1. Preparar servidor

Recomendado: Ubuntu 22.04+, Node.js 20 LTS y PM2.

```bash
sudo apt update
sudo apt install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Configurar proyecto en servidor

```bash
git clone <tu-repo>
cd VehicleRegistryBackend
cp .env.production .env
```

Edita `.env` con credenciales reales y seguras. Nunca subas secretos al repositorio.

### 3. Primer deploy

```bash
chmod +x deployBackend.sh
./deployBackend.sh
```

El script hace:

- `git pull`
- instalación de dependencias con `npm install`
- compilación `npm run build`
- si la API no existe en PM2: `pm2 start ecosystem.config.js --only vehicle-registry-api --env production`
- si ya existe: `pm2 restart vehicle-registry-api --update-env`

### 4. Autoarranque tras reinicio del servidor

```bash
pm2 startup
pm2 save
```

Ejecuta el comando que te devuelva `pm2 startup`.

### 5. Nginx (recomendado)

Configura un proxy hacia la API en puerto interno 3000.

```nginx
server {
	listen 80;
	server_name api.tu-dominio.com;

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

### 6. Operación diaria

```bash
# Actualizar backend
./deployBackend.sh

# Logs
pm2 logs vehicle-registry-api

# Estado y consumo
pm2 status
pm2 monit
```

### Perfil recomendado para bajo consumo

- PM2 en `fork` con 1 instancia por defecto
- reinicio automático por memoria (`max_memory_restart`)
- `watch: false` en producción
- app detrás de Nginx

Si luego necesitas más throughput, puedes pasar a `cluster` con más instancias.

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
