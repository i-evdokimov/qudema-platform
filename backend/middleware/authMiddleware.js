const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Декодируем
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Добавляем данные юзера в запрос
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Не авторизован, токен невалиден' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Не авторизован, нет токена' });
  }
};

module.exports = { protect };