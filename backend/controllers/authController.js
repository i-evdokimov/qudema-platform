const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, grade } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student',
      grade
    });

    // Генерация токена
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации',
      error: error.message
    });
  }
};

// @desc    Вход пользователя
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Введите email и пароль'
      });
    }

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверка активности аккаунта
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Ваш аккаунт деактивирован'
      });
    }

    // Обновление последнего входа
    await user.update({ lastLogin: new Date() });

    // Генерация токена
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе',
      error: error.message
    });
  }
};

// @desc    Получить текущего пользователя
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя',
      error: error.message
    });
  }
};

// @desc    Выход (на фронтенде просто удаляем токен)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Выход выполнен успешно'
  });
};
