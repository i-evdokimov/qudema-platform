const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'course_id',
    references: {
      model: 'courses',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'video_url'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Длительность видео в секундах'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Текстовый материал урока'
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Дополнительные материалы (PDF, документы)'
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_free',
    comment: 'Бесплатный урок для ознакомления'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  underscored: true
});

module.exports = Lesson;
