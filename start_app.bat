@echo off
title College Resource Booking Launcher
cls
echo ===================================================
echo     College Resource Booking System Launcher
echo ===================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Python detected on your system.
    echo [INFO] Starting local HTTP server at http://localhost:8000 ...
    echo.
    start "" "http://localhost:8000/login.html"
    python -m http.server 8000
) else (
    echo [INFO] Opening login.html directly in your default web browser...
    start "" "%~dp0login.html"
)

pause
