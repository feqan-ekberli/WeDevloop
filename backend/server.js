
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Client = require('./models/Client');
const Review = require('./models/Review');
const Project = require('./models/Project');
const Translation = require('./models/Translation');

const app = express();

require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '..')));
app.use(session({ secret: 'adminsecret', resave: false, saveUninitialized: true }));



// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect('/admin/login');
  next();
}

// Auth Routes
app.get('/admin/login', (req, res) => {
  res.render('login');
});

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
  
    console.log('Gələn email:', email);
    console.log('Gələn şifrə:', password);
  
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ İstifadəçi tapılmadı');
      return res.send('Email və ya şifrə yanlışdır.');
    }
  
    const match = await bcrypt.compare(password, user.password);
    console.log('Hash uyğunluğu:', match);
  
    if (!match) {
      console.log('❌ Şifrə yanlışdır');
      return res.send('Email və ya şifrə yanlışdır.');
    }
  
    console.log('✅ Giriş uğurludur');
    req.session.user = user._id;
    res.redirect('/admin/dashboard');
});
  
app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Dashboard
app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  const clients = await Client.find();
  const reviews = await Review.find();
  const projects = await Project.find();
  res.render('dashboard', { clients, reviews, projects });
});

// Clients
app.post('/admin/clients', isAuthenticated, upload.single('logo'), async (req, res) => {
  await Client.create({ name: req.body.name, logoUrl: req.file.path });
  res.redirect('/admin/dashboard');
});

app.post('/admin/clients/update/:id', isAuthenticated, upload.single('logo'), async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (req.body.name) client.name = req.body.name;
  if (req.file) client.logoUrl = req.file.path;
  await client.save();
  res.redirect('/admin/dashboard');
});

app.post('/admin/clients/delete/:id', isAuthenticated, async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

// Reviews
app.post('/admin/reviews', isAuthenticated, upload.single('photo'), async (req, res) => {
  await Review.create({
    name: req.body.name,
    company: req.body.company,
    comment: req.body.comment,
    photoUrl: req.file.path
  });
  res.redirect('/admin/dashboard');
});

app.post('/admin/reviews/update/:id', isAuthenticated, upload.single('photo'), async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (req.body.name) review.name = req.body.name;
  if (req.body.company) review.company = req.body.company;
  if (req.body.comment) review.comment = req.body.comment;
  if (req.file) review.photoUrl = req.file.path;
  await review.save();
  res.redirect('/admin/dashboard');
});

app.post('/admin/reviews/delete/:id', isAuthenticated, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

// Projects
app.post('/admin/projects', isAuthenticated, upload.single('image'), async (req, res) => {
  await Project.create({
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    imageUrl: req.file.path
  });
  res.redirect('/admin/dashboard');
});

app.post('/admin/projects/update/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (req.body.title) project.title = req.body.title;
  if (req.body.description) project.description = req.body.description;
  if (req.body.link) project.link = req.body.link;
  if (req.file) project.imageUrl = req.file.path;
  await project.save();
  res.redirect('/admin/dashboard');
});

app.post('/admin/projects/delete/:id', isAuthenticated, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

app.get('/api/lang/:lang/:page', async (req, res) => {
  const { lang, page } = req.params;

  try {
    const translation = await Translation.findOne({ lang, page });

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    res.json(translation.content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/clients', async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

app.get('/api/reviews', async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

app.get('/api/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
