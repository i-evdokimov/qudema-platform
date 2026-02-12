const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Тест соединения
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ База данных подключена успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
