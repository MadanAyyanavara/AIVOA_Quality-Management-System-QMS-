# QMS Complaint Intake System - PowerShell Launcher

Write-Host ""
Write-Host "========================================"
Write-Host "   QMS Complaint Intake System"
Write-Host "   Starting Backend and Frontend"
Write-Host "========================================"
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectPath "frontend"

Write-Host "Project Path: $projectPath" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANT: Run these commands in SEPARATE PowerShell terminals" -ForegroundColor Yellow
Write-Host ""

Write-Host "TERMINAL 1 - Backend Server (Port 8000):" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Green
Write-Host "cd '$projectPath'" -ForegroundColor White
Write-Host "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host ""

Write-Host "TERMINAL 2 - Frontend Server (Port 3000/5173):" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Green
Write-Host "cd '$frontendPath'" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "========================================"
Write-Host "Access Points (after both start):"
Write-Host "========================================"
Write-Host "Frontend App:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Base:      http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs:      http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "API ReDoc:     http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press Enter to copy Backend command to clipboard..." -ForegroundColor Yellow
Read-Host

# Copy backend command to clipboard
$backendCmd = "cd '$projectPath'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
$backendCmd | Set-Clipboard

Write-Host "Backend command copied to clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "Now paste it in Terminal 1 and press Enter"
