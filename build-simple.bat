@echo off
echo ========================================
echo BUILD SIMPLIFICADO - PROEDITION APP
echo ========================================
echo.

REM Verificar se o Node.js está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo.
    echo 📥 Baixe e instale o Node.js de: https://nodejs.org/
    echo 💡 Escolha a versao LTS (recomendada)
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
node --version

REM Verificar se o npm está funcionando
echo.
echo Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm nao encontrado!
    pause
    exit /b 1
)

echo ✅ npm encontrado!
npm --version

REM Instalar dependências
echo.
echo 📦 Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias!
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas!

REM Verificar se o Android SDK está configurado
echo.
echo 🔍 Verificando configuracao Android...
npx react-native doctor

echo.
echo ========================================
echo ✅ VERIFICACAO COMPLETA!
echo ========================================
echo.
echo 📱 Para compilar o APK, execute:
echo    npm run build:apk
echo.
echo 🌐 Ou use o GitHub Actions (recomendado):
echo    1. Faça push para o GitHub
echo    2. O APK sera compilado automaticamente
echo    3. Baixe o APK da aba Actions
echo.
pause
