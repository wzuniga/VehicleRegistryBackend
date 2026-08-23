# 🚀 Guía de Despliegue a Producción

## Opción 1: Despliegue en Servidor (VPS/Droplet) — la que está en uso

**Estado actual:** desplegado en `137.184.208.111`, un solo VPS que sirve el backend (este repo) y el frontend (`VehicleRegistryFrontend`) juntos vía Nginx. El backend corre con PM2 escuchando solo en `127.0.0.1:3000` (nunca expuesto directo a internet); Nginx lo publica bajo `/api/*` y sirve el build estático del frontend en `/`. Ver la sección "Despliegue a Producción" del `README.md` de este repo para el detalle completo (diagrama, config de Nginx, pasos de actualización).

Resumen rápido de lo que hay que tener en el servidor:

### Prerrequisitos en el Servidor
- Ubuntu 22.04+ / 24.04
- Node.js 22 LTS
- PM2 para gestión de procesos
- Nginx (sirve el frontend y hace de proxy hacia `/api`)
- Swap habilitado si el droplet tiene poca RAM (< 1GB) — sin esto, `npm install`/`npm run build` se matan por OOM

### Paso 1: Preparar el Servidor

```bash
ssh root@tu-servidor-ip

apt update && apt upgrade -y
apt install -y git nginx

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2

# Swap (solo si el droplet tiene poca RAM)
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Paso 2: Clonar el Repositorio

```bash
cd /opt
git clone https://github.com/wzuniga/VehicleRegistryBackend.git
cd VehicleRegistryBackend
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.production .env
nano .env
```

Completa `.env` con las credenciales reales (base de datos, `JWT_SECRET` generado aparte, Google OAuth, SMTP). La plantilla en `.env.production` no lleva secretos reales — nunca los subas al repo. Ver el `README.md` para el detalle de cada variable y el diagrama de arquitectura actual.

### Paso 4: Compilar y Ejecutar

```bash
# Compilar el proyecto
npm run build

# Iniciar con PM2
npm run start:pm2

# O manualmente:
pm2 start ecosystem.config.js

# Ver logs
pm2 logs vehicle-registry-api

# Ver estado
pm2 status
```

`ecosystem.config.js` está configurado con `instances: 1` (pensado para droplets pequeños). Súbelo si el servidor tiene más recursos.

### Paso 5: Configurar PM2 para Auto-inicio

```bash
# Guardar la configuración actual de PM2
pm2 save

# Configurar PM2 para iniciarse con el sistema
pm2 startup systemd -u root --hp /root

# Ejecutar el comando que PM2 te muestre
```

### Paso 6: Configurar Nginx (frontend + proxy `/api`)

El backend nunca debe quedar expuesto directo al puerto 3000: solo alcanzable vía Nginx bajo `/api`. Ver la configuración completa (con el `location /` para el frontend y el `location /api/` para el backend) en el `README.md` de este repo y en el de `VehicleRegistryFrontend`.

```bash
sudo nano /etc/nginx/sites-available/vehicle-registry
sudo ln -s /etc/nginx/sites-available/vehicle-registry /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Paso 7: Configurar Firewall

```bash
# Permitir solo SSH y HTTP/HTTPS — el puerto 3000 del backend NO se abre,
# solo es alcanzable internamente por Nginx (127.0.0.1)
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Opción 2: Despliegue en Railway.app (Más Fácil)

### Paso 1: Preparar el Proyecto

Crear archivo `Procfile` en la raíz:
```
web: npm run start:prod
```

Crear archivo `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Paso 2: Subir a Railway

1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Click en "New Project" → "Deploy from GitHub repo"
4. Selecciona `VehicleRegistryBackend`
5. Railway detectará automáticamente que es un proyecto Node.js

### Paso 3: Configurar Variables de Entorno en Railway

En el dashboard de Railway, ve a tu proyecto y agrega las mismas variables que en `.env.production` (host y credenciales reales de tu base de datos, `JWT_SECRET`, etc.):
```
DB_HOST=<host-de-tu-postgres>
DB_PORT=5432
DB_USERNAME=<usuario>
DB_PASSWORD=<password>
DB_DATABASE=<nombre-de-tu-base>
NODE_ENV=production
PORT=3000
```

Railway te dará una URL pública automáticamente.

---

## Opción 3: Despliegue en Render.com

1. Ve a [render.com](https://render.com)
2. Crea una cuenta y conecta GitHub
3. Click en "New +" → "Web Service"
4. Selecciona el repo `VehicleRegistryBackend`
5. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Node
6. Agrega las variables de entorno
7. Click en "Create Web Service"

---

## Actualizar el Código en Producción

### Con PM2 (Opción 1):
```bash
# En el servidor
cd ~/VehicleRegistryBackend
git pull origin main
npm install
npm run build
pm2 restart vehicle-registry-api
```

### Con Railway/Render:
Solo haz `git push` a main y se desplegará automáticamente.

---

## Comandos Útiles PM2

```bash
# Ver logs en tiempo real
pm2 logs vehicle-registry-api

# Reiniciar la app
pm2 restart vehicle-registry-api

# Detener la app
pm2 stop vehicle-registry-api

# Ver estado y uso de recursos
pm2 status
pm2 monit

# Eliminar la app de PM2
pm2 delete vehicle-registry-api
```

---

## Verificar que Funciona

```bash
# Desde tu máquina local (el backend solo es alcanzable vía Nginx, bajo /api)
curl http://tu-servidor-ip/api/pending-car-plates

# O visita en el navegador
http://tu-servidor-ip/api/docs
```

---

## Configurar HTTPS (Opcional pero Recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL gratis
sudo certbot --nginx -d tu-dominio.com

# Renovación automática ya está configurada
```

---

## Monitoreo y Logs

```bash
# Ver logs de la aplicación
pm2 logs vehicle-registry-api --lines 100

# Ver logs de Nginx (si lo usas)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Monitorear recursos
pm2 monit
```

---

## ¿Cuál Opción Elegir?

- **Opción 1 (VPS + PM2)**: Máximo control, mejor para producción seria
- **Opción 2 (Railway)**: Más rápido, gratis para empezar, ideal para prototipos
- **Opción 3 (Render)**: Similar a Railway, también gratis para empezar

**Recomendación**: Este proyecto ya está desplegado con la **Opción 1** (PM2 + Nginx) en `137.184.208.111` — ver el detalle en el `README.md`.
