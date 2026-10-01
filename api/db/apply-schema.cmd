@echo off
setlocal
set "DOCKER_PATH=C:\Users\Windows\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe"
powershell -ExecutionPolicy Bypass -File "%~dp0apply-schema.ps1" -DockerPath "%DOCKER_PATH%"
