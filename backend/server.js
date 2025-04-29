

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const app = express();

require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../assets')));
app.use(session({ secret: 'adminsecret', resave: false, saveUninitialized: true }));

// View Engine (Admin Panel)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Models
const Client = require('./models/Client');
const Review = require('./models/Review');
const Project = require('./models/Project');

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/admin/login');
}

// Admin Routes
app.get('/admin/login', (req, res) => {
    res.render('login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.user = 'admin';
        return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
});
  

app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
    const clients = await Client.find();
    const reviews = await Review.find();
    const projects = await Project.find();
    res.render('dashboard', { clients, reviews, projects });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/admin/login');
    });
});

// Client Routes
app.post('/admin/clients', isAuthenticated, upload.single('logo'), async (req, res) => {
    await Client.create({ name: req.body.name, logoUrl: req.file.path });
    res.redirect('/admin/dashboard');
});

app.post('/admin/clients/delete/:id', isAuthenticated, async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

// Müştəri Update (edit)
app.post('/admin/clients/update/:id', isAuthenticated, upload.single('logo'), async (req, res) => {
    const client = await Client.findById(req.params.id);
  
    if (!client) {
      return res.redirect('/admin/dashboard');
    }
  
    client.name = req.body.name || client.name;
    
    // Yeni logo upload olunubsa, dəyiş
    if (req.file) {
      client.logoUrl = req.file.path;
    }
  
    await client.save();
    res.redirect('/admin/dashboard');
});
  

// Review Routes
app.post('/admin/reviews', isAuthenticated, upload.single('photo'), async (req, res) => {
    await Review.create({ name: req.body.name, company: req.body.company, comment: req.body.comment, photoUrl: req.file.path });
    res.redirect('/admin/dashboard');
});

app.post('/admin/reviews/delete/:id', isAuthenticated, async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

// Rəy Update (edit)
app.post('/admin/reviews/update/:id', isAuthenticated, upload.single('photo'), async (req, res) => {
    const review = await Review.findById(req.params.id);
  
    if (!review) {
      return res.redirect('/admin/dashboard');
    }
  
    review.name = req.body.name || review.name;
    review.company = req.body.company || review.company;
    review.comment = req.body.comment || review.comment;
    
    // Yeni şəkil upload olunubsa, dəyiş
    if (req.file) {
      review.photoUrl = req.file.path;
    }
  
    await review.save();
    res.redirect('/admin/dashboard');
});
  

// Project Routes
app.post('/admin/projects', isAuthenticated, upload.single('image'), async (req, res) => {
    await Project.create({ title: req.body.title, description: req.body.description, imageUrl: req.file.path, link: req.body.link });
    res.redirect('/admin/dashboard');
});

app.post('/admin/projects/delete/:id', isAuthenticated, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

// Proyekt Update (edit)
app.post('/admin/projects/update/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    const project = await Project.findById(req.params.id);
  
    if (!project) {
      return res.redirect('/admin/dashboard');
    }
  
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.link = req.body.link || project.link;
    
    // Yeni şəkil upload olunubsa, dəyiş
    if (req.file) {
      project.imageUrl = req.file.path;
    }
  
    await project.save();
    res.redirect('/admin/dashboard');
});
  
// Apiler

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
  
  
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));