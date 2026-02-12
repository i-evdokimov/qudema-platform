const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Убедись, что путь к моделям верный

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    console.log('📥 Получен запрос на регистрацию:', req.body); // ЛОГ 1

    const { email, password, name, role } = req.body;

    // Проверка существования
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email уже занят' });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание пользователя
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    console.log('✅ Пользователь создан:', newUser.email); // ЛОГ 2

    // Создаем токен
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret_key_dev',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });

  } catch (err) {
    console.error('❌ ОШИБКА РЕГИСТРАЦИИ:', err); // ГЛАВНЫЙ ЛОГ ОШИБКИ
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при регистрации',
      error: err.message 
    });
  }
});

// ВХОД
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    // Токен
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key_dev',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (err) {
    console.error('❌ ОШИБКА ВХОДА:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// ПОЛУЧЕНИЕ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
router.get('/me', async (req, res) => {
    // Простая проверка токена вручную для теста
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_dev');
        
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ success: false });

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(401).json({ success: false });
    }
});

module.exports = router;