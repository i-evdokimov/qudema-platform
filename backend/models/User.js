module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Имя обязательно
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email должен быть уникальным
      validate: {
        isEmail: true, // Проверка формата email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student',
      allowNull: false
    }
  });

  return User;
};