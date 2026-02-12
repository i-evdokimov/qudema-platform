const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  logout
} = require('../controllers/authController');

// Публичные маршруты
router.post('/register', register);
router.post('/login', login);

// Защищенные маршруты
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;
