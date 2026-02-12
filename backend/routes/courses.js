const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCourses,
  getMyCourses, // <--- Добавили импорт
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require('../controllers/courseController');

// Публичные маршруты
router.get('/', getCourses);

// === ВАЖНО: Роут "Мои курсы" должен быть ДО /:id ===
router.get('/my', protect, getMyCourses);

router.get('/:id', getCourse);

// Защищенные маршруты
router.post('/:id/enroll', protect, enrollCourse);

// Только для админов и преподавателей
router.post('/', protect, authorize('admin', 'teacher'), createCourse);
router.put('/:id', protect, authorize('admin', 'teacher'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;