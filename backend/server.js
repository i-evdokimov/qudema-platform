const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { sequelize } = require('./models');

// Инициализация Express
const app = express();

// Middleware
app.use(helmet()); // Безопасность
app.use(cors()); // CORS
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded
app.use(morgan('dev')); // Логирование

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use('/api', limiter);

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Qudema API работает',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses'
    }
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Подключение к БД
    await testConnection();
    
    // Синхронизация моделей с БД
    // Мы убрали проверку process.env.NODE_ENV, чтобы это работало и на Render
    console.log('⏳ Синхронизация моделей с базой данных...');
    await sequelize.sync({ alter: true });
    console.log('✅ Модели успешно синхронизированы (таблицы проверены/созданы)');

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📡 Режим: ${process.env.NODE_ENV || 'production'}`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
