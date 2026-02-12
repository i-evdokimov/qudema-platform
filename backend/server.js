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
    await testConnection();
    
    // ВАЖНО: force: true удаляет таблицы и создает заново.
    // Это исправит ошибку 500, если проблема была в структуре таблицы.
    // ПОСЛЕ УСПЕШНОГО ЗАПУСКА ПОМЕНЯЙ ОБРАТНО НА alter: true
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true }); 
      console.log('⚠️ ТАБЛИЦЫ ПЕРЕСОЗДАНЫ (Force Sync)');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска:', error);
  }
};

startServer();

startServer();

module.exports = app;
