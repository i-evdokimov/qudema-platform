const Sequelize = require('sequelize');
const config = require('../config/database'); // Просто для порядка, но логику пропишем тут явно

let sequelize;

// ТА ЖЕ ЛОГИКА: Сначала проверяем DATABASE_URL от Render
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Локальная разработка
  sequelize = new Sequelize(
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
            rejectUnauthorized: false
        }
      }
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключаем модель пользователя
db.User = require('./User')(sequelize, Sequelize);

module.exports = db;