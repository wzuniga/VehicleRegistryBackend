#!/usr/bin/env bash

# Script de despliegue simple para VehicleRegistryBackend
set -e

echo "📂 Entrando al directorio del proyecto..."
cd VehicleRegistryBackend

echo "Actualizando repositorio..."
git pull

echo "Instalando dependencias..."
npm install

echo "Construyendo proyecto..."
npm run build

echo "🔁 Reiniciando servicio con PM2..."
pm2 restart vehicle-registry-api

echo "Despliegue completado con exito."
