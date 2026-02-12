const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');

// Определение связей между моделями

// User <-> Course (многие ко многим через Enrollment)
User.belongsToMany(Course, { 
  through: Enrollment, 
  foreignKey: 'userId',
  as: 'enrolledCourses'
});

Course.belongsToMany(User, { 
  through: Enrollment, 
  foreignKey: 'courseId',
  as: 'enrolledStudents'
});

// Course -> Lesson (один ко многим)
Course.hasMany(Lesson, {
  foreignKey: 'courseId',
  as: 'lessons',
  onDelete: 'CASCADE'
});

Lesson.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// User -> Enrollment
User.hasMany(Enrollment, {
  foreignKey: 'userId',
  as: 'enrollments'
});

Enrollment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'student'
});

// Course -> Enrollment
Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments'
});

Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// Экспорт всех моделей
module.exports = {
  sequelize,
  User,
  Course,
  Lesson,
  Enrollment
};
