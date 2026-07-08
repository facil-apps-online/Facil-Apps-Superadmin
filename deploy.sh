#!/bin/bash
set -e

echo "🚀 Iniciando despliegue del portal de Administración..."
echo "⬇️ 1/4 Descargando cambios de GitHub..."
git pull origin master

echo "🧹 2/4 Limpiando caché de npm..."
npm cache clean --force

echo "📦 3/4 Instalando dependencias..."
NODE_OPTIONS="--max-old-space-size=4096" npm install

echo "🏗️ 4/4 Construyendo la aplicación..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "✅ ¡Despliegue del Admin completado con éxito!"
