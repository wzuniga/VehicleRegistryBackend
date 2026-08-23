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

## Despliegue a Producción

**Arquitectura actual (en vivo):** un único VPS sirve el backend y el frontend juntos detrás de Nginx. El frontend (build estático de Vite) se sirve directamente desde `/`, y el backend (este repo, corriendo con PM2 en `127.0.0.1:3000`, **no expuesto directamente a internet**) se expone únicamente bajo la ruta interna `/api/*`. Así todo vive en un solo origen (sin problemas de CORS) y el puerto del proceso Node nunca queda accesible desde afuera.

```
Internet ──80──▶ Nginx (137.184.208.111)
                    ├── /            → archivos estáticos de VehicleRegistryFrontend/dist
                    └── /api/*       → proxy_pass a 127.0.0.1:3000 (VehicleRegistryBackend, PM2)

VehicleRegistryBackend (PM2, puerto 3000, solo 127.0.0.1)
                    └── Postgres en 178.128.159.83 (DB: postgres, schemas public/auth)
```

- **Servidor de app:** `137.184.208.111` (root, acceso por llave SSH; Ubuntu 24.04, droplet pequeño — 512MB RAM, por eso tiene 2GB de swap habilitado, necesario para que `npm install`/`npm run build` no mueran por falta de memoria).
- **Base de datos:** Postgres 16 en `178.128.159.83`, base **`postgres`** (la base default del servidor — no una base separada llamada `vehicle_registry`; ese nombre solo se usa como ejemplo genérico en la sección de instalación local más arriba). Esta base ya contiene los datos reales de la app en los schemas `public` (vehículos, SUNARP, SOAT, etc.) y `auth` (usuarios). El servidor Postgres es compartido con otras apps (cada una en su propio schema) — nunca ejecutes nada que toque schemas fuera de `public`/`auth`. Las credenciales viven solo en el `.env` del servidor (no están en este repo).
- **Sin dominio todavía:** se sirve por HTTP sobre la IP. Cuando haya un dominio apuntando aquí, correr Certbot (ver más abajo) y actualizar `FRONTEND_URL` / `GOOGLE_CALLBACK_URL` / la config de Nginx.
- **Google OAuth y SMTP (envío de correos de invitación) no están configurados con credenciales reales** — el registro/login por email y el resto de la app funcionan igual, pero "Continuar con Google" y el pre-registro por correo (`/admin/preregister`) no funcionarán hasta cargar un `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` real (Google Cloud Console) y credenciales SMTP reales en el `.env` del servidor.

### 1. Preparar el servidor (una sola vez)

```bash
apt update && apt install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2

# Swap (imprescindible en droplets con poca RAM)
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 2. Clonar y configurar

```bash
cd /opt
git clone https://github.com/wzuniga/VehicleRegistryBackend.git
cd VehicleRegistryBackend
cp .env.production .env
nano .env   # completar con las credenciales reales (DB, JWT_SECRET, Google, SMTP)
```

`JWT_SECRET` debe ser un valor generado aparte (por ejemplo `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`), nunca el placeholder del archivo de ejemplo. Nunca subas el `.env` real al repositorio (ya está en `.gitignore`).

### 3. Compilar y arrancar con PM2

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root   # ejecutar el comando que imprima, para autoarranque tras reboot
```

`ecosystem.config.js` corre **1 sola instancia** en modo `fork` (pensado para un droplet pequeño). Si el servidor crece, se puede subir `instances` y pasar a `cluster`.

### 4. Nginx (frontend + `/api` en un solo server block)

El backend **no debe** exponerse directamente al puerto 3000 desde internet: solo debe ser alcanzable vía Nginx bajo `/api`. Un firewall (`ufw allow 22,80` y nada más) refuerza esto aunque Node escuche en todas las interfaces.

```nginx
server {
    listen 80;
    server_name 137.184.208.111;   # o tu dominio cuando lo tengas

    client_max_body_size 50m;      # imágenes en base64 (plate-detections, etc.)

    root /opt/VehicleRegistryFrontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # SPA routing (React Router)
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;  # nota el / final: hace que Nginx quite el prefijo /api
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/docs {
        proxy_pass http://127.0.0.1:3000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/vehicle-registry /etc/nginx/sites-enabled/vehicle-registry
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx && systemctl enable nginx
```

### 5. Actualizar en producción

```bash
cd /opt/VehicleRegistryBackend
./deployBackend.sh   # git pull + npm install + npm run build + pm2 restart
```

Para el frontend, ver el README de `VehicleRegistryFrontend` (solo hace falta reconstruir el `dist/`; Nginx lo sirve directo, sin PM2).

### 6. Operación diaria

```bash
pm2 status
pm2 logs vehicle-registry-api
pm2 monit

# Logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 7. HTTPS (cuando haya un dominio)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com
```

Después, actualizar en el `.env` del backend: `FRONTEND_URL` y `GOOGLE_CALLBACK_URL` a `https://tu-dominio.com`. El frontend no necesita cambios (sigue llamando a `/api`, mismo origen).

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

## Endpoints sin Autenticación JWT

Los siguientes endpoints permanecen públicos (sin token requerido) para soportar los scrapers y workers externos:

| Módulo | Métodos | Ruta |
|--------|---------|------|
| Vehículos | GET / POST / PATCH / DELETE | `/vehicles/**` |
| Placas pendientes | GET / POST / PATCH / DELETE | `/pending-car-plates/**` |
| Maestro de placas | GET / POST / PATCH / DELETE | `/license-plate-master/**` |
| SUNARP SPRL | GET / POST / PATCH / DELETE | `/sprl-sunarp/**` |
| Títulos SUNARP | GET / PATCH | `/sprl-sunarp-titles/**` |
| SBS Seguros | GET / POST / PATCH / DELETE | `/sbs-insurance/**` |
| Inspección vehicular | GET / POST / PATCH / DELETE | `/inspeccion-vehicular/**` |
| SOAT APESEG | GET / POST / PATCH / DELETE | `/soat-apeseg/**` |
| Detección de placas | GET / POST / PATCH | `/plate-detections/**` |
| Auth pública | POST | `/auth/register`, `/auth/login` |
| Google OAuth | GET | `/auth/google`, `/auth/google/callback` |

Para activar protección JWT en endpoints de scrapers en el futuro, añade `@UseGuards(JwtAuthGuard)` al controlador correspondiente.

## Licencia

MIT
