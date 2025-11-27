@echo off
echo Starting Electron...
cd /d "%~dp0"
node_modules\.bin\electron.cmd .
pause
