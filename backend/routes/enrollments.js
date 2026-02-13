const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/enrollments/enroll
// @desc    Записаться на курс (создать запись)
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Проверяем, не записан ли уже
    const exists = await Enrollment.findOne({
      user: req.user._id,
      courseId
    });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Вы уже записаны на этот курс' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      courseId,
      status: 'active'
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// @route   GET /api/enrollments/my
// @desc    Получить все мои курсы
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

module.exports = router;