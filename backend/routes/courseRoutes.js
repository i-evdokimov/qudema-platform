const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   GET /api/courses
// @desc    Получить все курсы
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select('-modules'); // Отдаем список без тяжелых уроков
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// @route   GET /api/courses/:id
// @desc    Получить один курс (по ID базы или по courseId типа 'phys-oge')
router.get('/:id', async (req, res) => {
  try {
    // 1. Ищем по текстовому ID (courseId: "phys-oge-8-9")
    let course = await Course.findOne({ courseId: req.params.id });

    // 2. Если не нашли, пробуем искать по системному _id (если это длинный код)
    if (!course && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(req.params.id);
    }

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;