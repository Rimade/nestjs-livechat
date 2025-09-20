# Live Chat Server

Сервер для live чата на NestJS с WebSocket и Prisma.

## Возможности

- 💬 Реальное время общения через WebSocket
- 💾 Сохранение сообщений в PostgreSQL
- 🎨 Современный веб-интерфейс
- 📱 Адаптивный дизайн
- 🔄 История сообщений

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных
Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

Отредактируйте `.env` и укажите ваши данные для подключения к PostgreSQL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/live_chat?schema=public"
PORT=3000
```

### 3. Создание базы данных
```bash
# Создайте базу данных PostgreSQL
createdb live_chat

# Примените миграции
npx prisma migrate dev
```

### 4. Запуск сервера
```bash
# Режим разработки
npm run start:dev

# Продакшн режим
npm run build
npm run start:prod
```

### 5. Открытие чата
Откройте браузер и перейдите по адресу: http://localhost:3000

## API

### WebSocket события

- `join` - присоединение к чату с именем пользователя
- `message` - отправка сообщения
- `getHistory` - получение истории сообщений

### HTTP эндпоинты

- `GET /` - главная страница чата

## Технологии

- **NestJS** - фреймворк для Node.js
- **Socket.IO** - WebSocket библиотека
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных
- **TypeScript** - типизированный JavaScript