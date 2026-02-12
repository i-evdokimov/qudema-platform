const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { sequelize } = require('./models');

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev')); 

// Маршруты
app.use('/api/auth', require('./routes/auth'));
// Если у тебя есть routes/courses, раскомментируй следующую строку:
// app.use('/api/courses', require('./routes/courses'));

// Корневой маршрут (для проверки жизни сервера)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Qudema API is running',
    version: '1.0.0'
  });
});

// ЕДИНСТВЕННАЯ функция запуска сервера
const startServer = async () => {
  try {
    // 1. Проверяем подключение
    await testConnection();
    
    // 2. Синхронизация с базой (СБРОС ТАБЛИЦ для лечения ошибки 500)
    // Внимание: force: true удаляет старые данные!
    console.log('⏳ Синхронизация таблиц...');
    await sequelize.sync({ force: true }); 
    console.log('✅ Таблицы успешно пересозданы (Force Sync)');

    // 3. Запуск прослушивания порта (ТОЛЬКО ОДИН РАЗ!)
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Критическая ошибка запуска:', error);
    process.exit(1); // Завершаем процесс при ошибке
  }
};

// Запускаем
startServer();