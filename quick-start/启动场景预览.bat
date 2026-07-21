@echo off
chcp 65001 >nul
title Scene Preview (Vite + React)
echo.
echo  ========================================
echo   Scene Preview Tool (Vite + React)
echo   Port: 5174
echo  ========================================
echo.
echo  Starting...
echo  Browser: http://localhost:5174
echo  Press Ctrl+C to stop
echo.

cd /d "%~dp0\..\OpenMontage\remotion-composer"
start "" http://localhost:5174
npx vite --config preview/vite.config.ts

pause
