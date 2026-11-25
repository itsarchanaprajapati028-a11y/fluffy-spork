const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

const courses = [
  {
    title: 'Complete React Developer Course',
    slug: 'complete-react-developer-course',
    description: 'Master React 18 from the ground up. Build real-world single-page applications with hooks, context, and Redux Toolkit.',
    shortDescription: 'Master React 18 with hands-on projects.',
    category: 'development',
    price: 49.99,
    originalPrice: 99.99,
    level: 'beginner',
    duration: 1800,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 342,
    thumbnail: { url: '/placeholder-course.svg', alt: 'React Course' },
    images: [{ url: '/placeholder-course.svg', alt: 'React Course' }],
    attributes: { 'What You\'ll Learn': 'Components, Hooks, State, Routing' },
    tags: ['react', 'javascript', 'frontend'],
  },
  {
    title: 'Node.js & Express Backend Masterclass',
    slug: 'nodejs-express-backend-masterclass',
    description: 'Build production-grade REST APIs with Node.js, Express, MongoDB, JWT auth, and Redis caching.',
    shortDescription: 'Production-grade REST APIs with Node.js.',
    category: 'development',
    price: 59.99,
    originalPrice: 119.99,
    level: 'intermediate',
    duration: 2400,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 210,
    thumbnail: { url: '/placeholder-course.svg', alt: 'Node.js Course' },
    images: [{ url: '/placeholder-course.svg', alt: 'Node.js Course' }],
    attributes: { 'What You\'ll Learn': 'Express, MongoDB, Auth, Deployment' },
    tags: ['node', 'express', 'backend'],
  },
  {
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    description: 'Learn the principles of user interface and experience design, from wireframes to polished prototypes in Figma.',
    shortDescription: 'Design beautiful, usable interfaces.',
    category: 'design',
    price: 39.99,
    originalPrice: 79.99,
    level: 'beginner',
    duration: 1200,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 156,
    thumbnail: { url: '/placeholder-course.svg', alt: 'UI/UX Course' },
    images: [{ url: '/placeholder-course.svg', alt: 'UI/UX Course' }],
    attributes: { 'What You\'ll Learn': 'Figma, Wireframing, Prototyping' },
    tags: ['design', 'figma', 'ux'],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fs03_lms';
  await mongoose.connect(uri);
  console.log('[FS-03] Connected for seeding');

  const adminEmail = 'admin@fs03.com';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({ firstName: 'Admin', lastName: 'User', email: adminEmail, password: await bcrypt.hash('admin123', 10), role: 'admin' });
    console.log('[FS-03] Admin created: admin@fs03.com / admin123');
  }
  const instructorEmail = 'instructor@fs03.com';
  let instructor;
  if (!(await User.findOne({ email: instructorEmail }))) {
    instructor = await User.create({ firstName: 'In', lastName: 'structor', email: instructorEmail, password: await bcrypt.hash('instructor123', 10), role: 'instructor', headline: 'Senior Instructor' });
    console.log('[FS-03] Instructor created: instructor@fs03.com / instructor123');
  } else {
    instructor = await User.findOne({ email: instructorEmail });
  }
  const studentEmail = 'student@fs03.com';
  if (!(await User.findOne({ email: studentEmail }))) {
    await User.create({ firstName: 'Stu', lastName: 'dent', email: studentEmail, password: await bcrypt.hash('student123', 10), role: 'student' });
    console.log('[FS-03] Student created: student@fs03.com / student123');
  }

  if ((await Course.countDocuments()) === 0) {
    const created = await Course.insertMany(
      courses.map((c) => ({
        ...c,
        instructor: instructor._id,
        modules: [
          {
            title: 'Getting Started',
            order: 1,
            lessons: [
              { title: 'Welcome & Overview', slug: 'welcome', type: 'video', videoUrl: 'https://example.com/intro.mp4', duration: 300, order: 1, isPreview: true },
              { title: 'Environment Setup', slug: 'setup', type: 'text', content: 'Install the required tools.', duration: 600, order: 2 },
            ],
          },
        ],
      }))
    );
    for (const c of created) {
      c.lessonsCount = c.modules.reduce((s, m) => s + m.lessons.length, 0);
      await c.save();
    }
    console.log('[FS-03] Seeded', created.length, 'courses');
  } else {
    console.log('[FS-03] Courses already present, skipping');
  }

  await mongoose.disconnect();
  console.log('[FS-03] Seeding complete');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});