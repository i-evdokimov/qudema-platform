const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ПОДКЛЮЧЕНИЕ К MONGODB (Убираем старый Sequelize/SQL) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- РОУТЫ ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Тестовый роут
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));