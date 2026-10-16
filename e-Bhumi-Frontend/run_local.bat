@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 18 or newer. This role platform needs its API server.
 pause
 exit /b 1
)
node server.cjs
pause
