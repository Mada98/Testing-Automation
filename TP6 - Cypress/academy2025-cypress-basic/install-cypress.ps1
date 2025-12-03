# Script de instalacion alternativa para Cypress
# Resuelve problemas de descarga y permisos en Windows

Write-Host "Script de instalacion de Cypress" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar version de Node.js
$nodeVersion = node --version
Write-Host "Version de Node.js: $nodeVersion" -ForegroundColor Yellow

if ($nodeVersion -match "v18") {
    Write-Host "ADVERTENCIA: Estas usando Node.js v18. Algunas dependencias requieren Node 20+." -ForegroundColor Yellow
    Write-Host "   Considera actualizar Node.js o usar nvm para cambiar de version." -ForegroundColor Yellow
    Write-Host ""
}

# Limpiar cache de npm
Write-Host "Limpiando cache de npm..." -ForegroundColor Cyan
npm cache clean --force

# Limpiar instalacion previa de Cypress si existe
$cypressCache = "$env:LOCALAPPDATA\Cypress\Cache"
if (Test-Path $cypressCache) {
    Write-Host "Eliminando cache de Cypress..." -ForegroundColor Cyan
    try {
        Remove-Item -Path $cypressCache -Recurse -Force -ErrorAction Stop
        Write-Host "Cache de Cypress eliminada" -ForegroundColor Green
    } catch {
        Write-Host "No se pudo eliminar completamente la cache (puede estar en uso)" -ForegroundColor Yellow
    }
}

# Configurar variables de entorno para descarga alternativa
Write-Host ""
Write-Host "Configurando variables de entorno para descarga..." -ForegroundColor Cyan
$env:CYPRESS_INSTALL_BINARY = "0"
$env:CYPRESS_RUN_BINARY = ""

# Intentar instalacion con diferentes metodos
Write-Host ""
Write-Host "Metodo 1: Instalacion estandar de npm..." -ForegroundColor Cyan
npm install cypress --save-dev --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Metodo 1 fallo. Intentando metodo alternativo..." -ForegroundColor Red
    
    Write-Host ""
    Write-Host "Metodo 2: Instalacion con variable de entorno CYPRESS_INSTALL_BINARY..." -ForegroundColor Cyan
    $env:CYPRESS_INSTALL_BINARY = "https://cdn.cypress.io/desktop/14.4.0/win32-x64/cypress.zip"
    npm install cypress@14.4.0 --save-dev --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Metodo 2 fallo. Intentando instalacion manual..." -ForegroundColor Red
        
        Write-Host ""
        Write-Host "Metodo 3: Instalacion manual de Cypress..." -ForegroundColor Cyan
        Write-Host "   Ejecuta manualmente: npx cypress install" -ForegroundColor Yellow
        $downloadUrl = "https://download.cypress.io/desktop/14.4.0?platform=win32&arch=x64"
        Write-Host "   O descarga desde: $downloadUrl" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Proceso completado" -ForegroundColor Green
Write-Host ""
Write-Host "Si aun tienes problemas:" -ForegroundColor Cyan
Write-Host "   1. Verifica tu conexion a Internet" -ForegroundColor White
Write-Host "   2. Configura proxy si es necesario: set HTTP_PROXY=http://proxy:port" -ForegroundColor White
Write-Host "   3. Intenta ejecutar PowerShell como Administrador" -ForegroundColor White
Write-Host "   4. Considera actualizar Node.js a la version 20 o superior" -ForegroundColor White
