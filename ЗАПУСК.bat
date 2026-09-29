@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Лабораторная работа 3: React ToDo в Docker ===
docker info >nul 2>&1
if errorlevel 1 (
  echo [!] Docker не запущен. Откройте Docker Desktop, дождитесь статуса "Engine running" и запустите этот файл снова.
  pause
  exit /b 1
)
echo Сборка образа и запуск контейнера...
docker compose up -d --build
if errorlevel 1 (
  echo [!] Ошибка запуска. Проверьте, что порт 8080 свободен.
  pause
  exit /b 1
)
docker compose ps
timeout /t 3 >nul
start "" http://localhost:8080
echo.
echo Готово! Приложение: http://localhost:8080
echo Для остановки запустите ОСТАНОВКА.bat
pause
