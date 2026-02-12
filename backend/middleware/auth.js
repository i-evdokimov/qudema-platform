const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Защита маршрутов - проверка JWT токена
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Проверка наличия токена в заголовке
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Доступ запрещен. Необходима авторизация'
      });
    }

    try {
      // Верификация токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получение пользователя из БД
      const user = await User.findByPk(decoded.id);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Пользователь не найден или деактивирован'
        });
      }

      // Добавление пользователя в request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Недействительный токен'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ошибка аутентификации'
    });
  }
};

// Проверка ролей пользователя
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Роль ${req.user.role} не имеет доступа к этому ресурсу`
      });
    }
    next();
  };
};
