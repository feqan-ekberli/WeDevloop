

// createAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ email: 'admin@wedevloop.com' });

    if (exists) {
      console.log('❗ Bu admin artıq mövcuddur.');
      return process.exit();
    }

    await User.create({
      email: 'admin@wedevloop.com',
      password: 'admin123'  // Burada hash ETMİRİK!
    });

    console.log('✅ Admin yaradıldı: admin@wedevloop.com / admin123');
    process.exit();
  } catch (err) {
    console.error('Xəta:', err);
    process.exit(1);
  }
}

createAdmin();
