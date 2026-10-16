@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting e-Bhumi Frontend via Node.js...
    node server.js
    pause
    exit /b
)
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting e-Bhumi Frontend via Python...
    python -m http.server 8080
    pause
    exit /b
)
echo Neither Node.js nor Python was found. Please install Node.js or Python to run this workspace.
pause
