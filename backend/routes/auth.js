const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <-- Важно: подключаем конкретный файл, а не папку

// Генерация токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка, есть ли юзер
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Создание юзера
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Неверные данные пользователя' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// @route   POST /api/auth/login
// @desc    Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Неверный email или пароль' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// @route   GET /api/auth/me
// @desc    Получить текущего юзера (нужен токен)
router.get('/me', async (req, res) => {
    // Простейшая проверка, если нужно - добавим middleware защиты позже
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({message: "Нет токена"});
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (e) {
        res.status(401).json({message: "Токен невалиден"});
    }
});

module.exports = router;