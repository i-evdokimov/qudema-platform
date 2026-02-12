const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ База данных подключена успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
  }
};

module.exports = { sequelize, testConnection };