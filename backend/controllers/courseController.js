const { Course, Lesson, Enrollment } = require('../models');
const { Op } = require('sequelize');

// @desc    Получить все курсы
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { subject, examType, grade, level, search } = req.query;

    const where = { isPublished: true };

    if (subject) where.subject = subject;
    if (examType) where.examType = examType;
    if (grade) where.grade = parseInt(grade);
    if (level) where.level = level;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const courses = await Course.findAll({
      where,
      include: [
        {
          model: Lesson,
          as: 'lessons',
          attributes: ['id', 'title', 'order', 'isFree']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Ошибка получения курсов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении курсов',
      error: error.message
    });
  }
};

// @desc    Получить курсы ТЕКУЩЕГО пользователя (Личный кабинет)
// @route   GET /api/courses/my
// @access  Private
exports.getMyCourses = async (req, res) => {
  try {
    // Ищем записи в таблице Enrollments для этого юзера
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Course,
          // Sequelize может называть поле 'Course' или 'course' в зависимости от настройки связей.
          // Если возникнет ошибка, возможно нужно добавить as: 'course' или проверить models/index.js
          attributes: ['id', 'title', 'description', 'image_url', 'level']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Преобразуем данные в удобный вид
    const data = enrollments.map(enrollment => {
      // Проверка на случай битых ссылок
      const course = enrollment.Course || enrollment.course; 
      
      if (!course) return null;

      // Возвращаем данные курса + прогресс из таблицы записи
      return {
        ...course.toJSON(),
        progress: enrollment.progress || 0,
        enrolledAt: enrollment.createdAt
      };
    }).filter(item => item !== null);

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Ошибка получения моих курсов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке ваших курсов',
      error: error.message
    });
  }
};

// @desc    Получить курс по ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Lesson,
          as: 'lessons',
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    // Логика доступа к урокам
    if (!req.user) {
      // Гость: только бесплатные
      course.lessons = course.lessons.filter(lesson => lesson.isFree);
    } else {
      // Авторизован: проверяем покупку
      const enrollment = await Enrollment.findOne({
        where: {
          userId: req.user.id,
          courseId: course.id
        }
      });

      // Если не купил - только бесплатные
      if (!enrollment && req.user.role !== 'admin') {
        course.lessons = course.lessons.filter(lesson => lesson.isFree);
      }
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Ошибка получения курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении курса',
      error: error.message
    });
  }
};

// @desc    Создать курс
// @route   POST /api/courses
// @access  Private (Admin, Teacher)
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Курс успешно создан',
      data: course
    });
  } catch (error) {
    console.error('Ошибка создания курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании курса',
      error: error.message
    });
  }
};

// @desc    Обновить курс
// @route   PUT /api/courses/:id
// @access  Private (Admin, Teacher)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    await course.update(req.body);

    res.json({
      success: true,
      message: 'Курс успешно обновлен',
      data: course
    });
  } catch (error) {
    console.error('Ошибка обновления курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении курса',
      error: error.message
    });
  }
};

// @desc    Удалить курс
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Курс успешно удален'
    });
  } catch (error) {
    console.error('Ошибка удаления курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении курса',
      error: error.message
    });
  }
};

// @desc    Записаться на курс
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: course.id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Вы уже записаны на этот курс'
      });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId: course.id,
      progress: 0,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
    });

    // Опционально: увеличить счетчик, если есть такое поле
    // await course.increment('enrollmentCount');

    res.status(201).json({
      success: true,
      message: 'Вы успешно записались на курс',
      data: enrollment
    });
  } catch (error) {
    console.error('Ошибка записи на курс:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при записи на курс',
      error: error.message
    });
  }
};