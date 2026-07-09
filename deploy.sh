#!/bin/bash
set -e

echo "ðŸš€ Iniciando despliegue del portal de AdministraciÃ³n..."
echo "â¬‡ï¸ 1/4 Descargando cambios de GitHub..."
git pull origin master

echo "ðŸ§¹ 2/4 Limpiando cachÃ© de npm..."
npm cache clean --force

echo "ðŸ“¦ 3/4 Instalando dependencias..."
NODE_OPTIONS="--max-old-space-size=4096" npm install

echo "🌐 Actualizando listado de navegadores (browserslist)..."
npx update-browserslist-db@latest

echo "ðŸ—ï¸ 4/4 Construyendo la aplicaciÃ³n..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "âœ… Â¡Despliegue del Admin completado con Ã©xito!"
