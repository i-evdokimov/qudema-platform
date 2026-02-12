const Sequelize = require('sequelize');
const config = require('../config/database'); // Убедись, что путь верный

// Создаем подключение
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Важно для Render!
      }
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключаем модель пользователя
db.User = require('./User')(sequelize, Sequelize);

module.exports = db;