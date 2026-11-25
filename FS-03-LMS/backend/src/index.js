require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const categoryRoutes = require('./routes/categories');
const enrollmentRoutes = require('./routes/enrollments');
const quizRoutes = require('./routes/quizzes');
const certificateRoutes = require('./routes/certificates');
const liveClassRoutes = require('./routes/liveClasses');
const instructorRoutes = require('./routes/instructor');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'fs03-backend' }));
app.get('/health', (req, res) => res.send('healthy\n'));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/fs03_lms').then(() => {
  app.listen(PORT, () => console.log(`[FS-03] Backend running on port ${PORT}`));
});