#!/bin/bash

# Script para preparar el despliegue en Railway

echo "🚀 Preparando despliegue en Railway..."

# 1. Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

# 2. Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install

# 3. Compilar frontend
echo "🔨 Compilando frontend..."
npm run build

echo "✅ Listo para desplegar en Railway"
echo ""
echo "Próximos pasos:"
echo "1. Ve a https://railway.app"
echo "2. Click 'Deploy' → 'Deploy from GitHub'"
echo "3. Selecciona tu repositorio"
echo "4. Railway detectará automáticamente el proyecto"
echo "5. Configura variables de entorno en Railway"
echo ""
echo "Variables a configurar en Railway:"
echo "  - DB_USER: Rafael"
echo "  - DB_PASSWORD: 123456789"
echo "  - DB_HOST: tu_host_oracle"
echo "  - DB_PORT: 1521"
echo "  - DB_SID: xe"
echo "  - NODE_ENV: production"
echo "  - PORT: 5000"
