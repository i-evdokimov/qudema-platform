const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Если есть DATABASE_URL (это Render), используем её
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Обязательно для Render
      }
    },
    logging: false
  });
} else {
  // Иначе используем локальные настройки (для твоего компьютера)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      logging: false
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ База данных подключена успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    // Не убиваем процесс тут, даем серверу шанс показать ошибку
  }
};

module.exports = { sequelize, testConnection };