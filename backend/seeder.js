const { sequelize, User, Course, Lesson, Enrollment } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // 1. Проверяем подключение
    await sequelize.authenticate();
    console.log('✅ Подключение к БД успешно.');

    // 2. Очищаем базу (ВНИМАНИЕ: удалит все старые данные!)
    // force: true пересоздает таблицы
    await sequelize.sync({ force: true });
    console.log('🗑️ Старые данные удалены, таблицы пересозданы.');

    // 3. Создаем хеш пароля (пароль для всех: 123456)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // 4. Создаем пользователей
    const admin = await User.create({
      firstName: 'Главный',
      lastName: 'Админ',
      email: 'admin@qudema.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true
    });

    const teacher = await User.create({
      firstName: 'Иван',
      lastName: 'Учитель',
      email: 'teacher@qudema.com',
      password: hashedPassword,
      role: 'teacher',
      isEmailVerified: true
    });

    const student = await User.create({
      firstName: 'Петя',
      lastName: 'Ученик',
      email: 'student@qudema.com',
      password: hashedPassword,
      role: 'student',
      grade: 11,
      isEmailVerified: true
    });

    console.log('👥 Пользователи созданы (Пароль для всех: 123456)');

    // 5. Создаем Курсы
    const mathCourse = await Course.create({
      title: 'Математика ЕГЭ 2024: Полный курс',
      description: 'Подготовка к профильной математике с нуля до 90+ баллов. Разбор всех заданий первой и второй части.',
      subject: 'математика',
      examType: 'ЕГЭ',
      grade: 11,
      price: 4990,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      level: 'advanced',
      isPublished: true,
      rating: 4.8
    });

    const physicsCourse = await Course.create({
      title: 'Физика ОГЭ: Механика',
      description: 'Интенсивный курс по механике. Законы Ньютона, кинематика и динамика простыми словами.',
      subject: 'физика',
      examType: 'ОГЭ',
      grade: 9,
      price: 2990,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800',
      level: 'beginner',
      isPublished: true,
      rating: 4.5
    });

    console.log('📚 Курсы созданы');

    // 6. Создаем Уроки для Математики
    await Lesson.create({
      courseId: mathCourse.id,
      title: 'Вводный урок. Структура экзамена',
      description: 'Разбираем, из чего состоит ЕГЭ, критерии оценки и план подготовки.',
      order: 1,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Тестовое видео
      duration: 1200, // 20 минут
      isFree: true,
      isPublished: true
    });

    await Lesson.create({
      courseId: mathCourse.id,
      title: 'Задание №1. Планиметрия',
      description: 'Решение треугольников, свойства медиан и биссектрис.',
      order: 2,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 3600, // 60 минут
      isFree: false,
      isPublished: true
    });

    console.log('🎓 Уроки добавлены');

    console.log('🚀 БАЗА УСПЕШНО НАПОЛНЕНА! МОЖНО ЗАПУСКАТЬ СЕРВЕР.');
    process.exit();

  } catch (error) {
    console.error('❌ Ошибка при наполнении базы:', error);
    process.exit(1);
  }
};

seedDatabase();