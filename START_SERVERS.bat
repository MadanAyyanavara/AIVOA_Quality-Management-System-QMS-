@echo off
REM QMS Complaint Intake System - Quick Start Script

echo.
echo ========================================
echo   QMS Complaint Intake System
echo   Starting Backend and Frontend
echo ========================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script needs to run in two separate terminals.
    echo Please run the following commands manually:
    echo.
    echo TERMINAL 1 - Backend:
    echo cd "%cd%"
    echo uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    echo.
    echo TERMINAL 2 - Frontend:
    echo cd "%cd%\frontend"
    echo npm run dev
    echo.
    pause
    exit /b
)

REM Start Backend in new window
echo Starting Backend Server...
start "QMS Backend" cmd /k "cd /d "%cd%" && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting Frontend Server...
start "QMS Frontend" cmd /k "cd /d "%cd%\frontend" && npm run dev"

echo.
echo ========================================
echo Servers starting...
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo ========================================
echo.
pause
