const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true // Например: "phys-oge-8-9"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: String
  },
  level: {
    type: String
  },
  duration: {
    type: String
  },
  // Список уроков
  modules: [
    {
      title: { type: String },
      content: { type: String }, // Ссылка на видео или текст
      type: { type: String, default: 'video' } // video / text / quiz
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);