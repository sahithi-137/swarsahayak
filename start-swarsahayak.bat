@echo off
title SwarSahayak - Local & Public LocalTunnel Launcher
color 0A

echo =====================================================================
echo   SWARSAHAYAK — MULTILINGUAL VOICE DIGITAL ASSISTANT FOR RURAL INDIA
echo   Local Server & Temporary LocalTunnel Public Sharing
echo =====================================================================
echo.

cd /d "%~dp0"

:: 1. Check if Backend is already running on port 8000
netstat -ano | findstr /R /C:":8000 *LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Backend FastAPI server is already running on port 8000.
) else (
    echo [*] Starting FastAPI Backend server on port 8000...
    start "SwarSahayak Backend (Port 8000)" cmd /k "cd /d "%~dp0" && .\backend\venv\Scripts\uvicorn.exe backend.app.main:app --host 127.0.0.1 --port 8000"
    timeout /t 3 /nobreak >nul
)

:: 2. Check if Frontend is already running on port 5173
netstat -ano | findstr /R /C:":5173 *LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Frontend Vite server is already running on port 5173.
) else (
    echo [*] Starting Vite Frontend server on port 5173...
    start "SwarSahayak Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 0.0.0.0 --port 5173"
    timeout /t 3 /nobreak >nul
)

echo.
echo =====================================================================
echo   STATUS & ACCESS URLS
echo =====================================================================
echo   Local Website  : http://localhost:5173
echo   Local Backend  : http://localhost:8000
echo.
echo [*] Fetching Tunnel Password (your public IP for LocalTunnel bypass)...
for /f "delims=" %%I in ('powershell -NoProfile -Command "(Invoke-RestMethod -Uri https://api.ipify.org -TimeoutSec 4) 2>$null"') do set TUNNEL_PASSWORD=%%I
if defined TUNNEL_PASSWORD (
    echo   Tunnel Password: %TUNNEL_PASSWORD%
    echo   (When opening the link on mobile or remote PC, enter %TUNNEL_PASSWORD% on the friendly screen and submit)
) else (
    echo   Tunnel Password: Check https://loca.lt/mytunnelpassword
)
echo.
echo =====================================================================
echo   STARTING LOCALTUNNEL PUBLIC LINK (Keep this window open!)
echo =====================================================================
echo.

node "%~dp0frontend\tunnel.js"

pause


