@echo off
echo Запуск Live Chat Server...
echo.

REM Проверяем наличие .env файла
if not exist .env (
    echo Создание .env файла из примера...
    copy env.example .env
    echo.
    echo ВНИМАНИЕ: Отредактируйте файл .env и укажите правильные данные для подключения к PostgreSQL
    echo.
)

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo Установка зависимостей...
    npm install
    echo.
)

REM Запускаем сервер в режиме разработки
echo Запуск сервера...
npm run start:dev

pause
