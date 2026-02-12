const db = require('./models');

async function zapolnitBazu() { try { console.log('1. Подключаемся...'); await db.sequelize.authenticate();

} catch (error) { console.error('❌ ОШИБКА:', error); } }

zapolnitBazu();