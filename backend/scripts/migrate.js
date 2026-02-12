const { sequelize } = require('../models');

const runMigrations = async () => {
  try {
    console.log('🔄 Запуск миграций...');
    
    // Синхронизация всех моделей с БД
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Миграции выполнены успешно');
    console.log('📊 Таблицы созданы/обновлены:');
    console.log('   - users');
    console.log('   - courses');
    console.log('   - lessons');
    console.log('   - enrollments');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка миграций:', error);
    process.exit(1);
  }
};

runMigrations();
