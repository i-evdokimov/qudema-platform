const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String, // ID курса, например "phys-oge-8-9"
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);