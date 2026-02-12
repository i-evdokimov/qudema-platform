const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subject: {
    type: DataTypes.ENUM('математика', 'русский', 'физика', 'химия', 'биология', 'информатика', 'английский', 'обществознание', 'история', 'литература', 'география'),
    allowNull: false
  },
  examType: {
    type: DataTypes.ENUM('ЕГЭ', 'ОГЭ', 'ВПР'),
    allowNull: false,
    field: 'exam_type'
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Класс (9 или 11)'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Продолжительность курса в часах'
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'enrollment_count'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  }
}, {
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

module.exports = Course;
