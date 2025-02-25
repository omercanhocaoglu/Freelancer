const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const fs = require('fs');
const Photo = require('./models/Photo');
const PhotoControllers = require('./controllers/PhotoControllers');

// Template engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

// connect DB
mongoose.connect('mongodb://localhost/freelancer-test-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Pages
app.get('/', PhotoControllers.getAllPhotos);
app.get("/add", PhotoControllers.getAddPhoto);
app.get('/photos/:id', PhotoControllers.getSinglePhoto);
app.get('/photos/edit/:id', PhotoControllers.getEditPhoto);
app.post('/photos', PhotoControllers.getUploadPhoto);
// Edit
app.put('/photos/:id', PhotoControllers.getEditedPhoto);
// Delete
app.delete('/photos/:id', PhotoControllers.getDeletePhoto);

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu port ${port}'de çalışmaya başladı.`)
});