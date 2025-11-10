# 🚀 Guía de Despliegue a Producción

## Opción 1: Despliegue en Servidor (VPS/Droplet)

### Prerrequisitos en el Servidor
- Ubuntu 20.04+ / Debian 11+
- Node.js 18+ instalado
- PM2 para gestión de procesos
- Nginx (opcional, para proxy reverso)

### Paso 1: Preparar el Servidor

```bash
# Conectarse al servidor
ssh root@tu-servidor-ip

# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Git
sudo apt install -y git

# Crear usuario para la aplicación (opcional pero recomendado)
sudo adduser vehicleapp
sudo usermod -aG sudo vehicleapp
```

### Paso 2: Clonar el Repositorio

```bash
# Cambiar al usuario de la app
su - vehicleapp

# Clonar el repo
cd ~
git clone https://github.com/wzuniga/VehicleRegistryBackend.git
cd VehicleRegistryBackend

# Instalar dependencias
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar el archivo de producción
cp .env.production .env

# Editar con tus datos reales
nano .env
```

Asegúrate de que `.env` tenga:
```
DB_HOST=143.110.206.161
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=231112RMcc
DB_DATABASE=vehicle_registry
PORT=3000
NODE_ENV=production
```

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

### Paso 5: Configurar PM2 para Auto-inicio

```bash
# Guardar la configuración actual de PM2
pm2 save

# Configurar PM2 para iniciarse con el sistema
pm2 startup

# Ejecutar el comando que PM2 te muestre
```

### Paso 6: Configurar Nginx como Proxy Reverso (Opcional)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/vehicle-registry
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # o tu IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Activar el sitio
sudo ln -s /etc/nginx/sites-available/vehicle-registry /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Paso 7: Configurar Firewall

```bash
# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Permitir el puerto de la app (si no usas Nginx)
sudo ufw allow 3000

# Activar firewall
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

En el dashboard de Railway, ve a tu proyecto y agrega:
```
DB_HOST=143.110.206.161
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=231112RMcc
DB_DATABASE=vehicle_registry
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
# Desde tu máquina local
curl http://tu-servidor-ip:3000/pending-car-plates

# O visita en el navegador
http://tu-servidor-ip:3000/docs
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

**Recomendación**: Si ya tienes el servidor `143.110.206.161`, usa la **Opción 1** con PM2.
