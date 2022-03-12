const express = require('express');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo');
const { default: mongoose } = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const fs = require('fs');
const app = express();
const port = 3000;

mongoose.connect('mongodb');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload());

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-date');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  res.render('photo', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + 'public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`${port}'de çalışıyor.`);
});
