const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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
app.use(session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/freelancer-test-db' })
  }));
app.use(flash());
app.use(( req, res, next ) => {
    res.locals.flashMessages = req.flash();
    next();
});
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

// connect DB
mongoose.connect('mongodb+srv://omercanhocaoglu:NV8VnLfeDkGdcI15@cluster0.p4i36.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then( () => {
    console.log('DB connected!')
} ).catch((err) => {
    console.log(err)
});

// Pages
app.get('/', PhotoControllers.getAllPhotos);
app.get("/add", PhotoControllers.getAddPhoto);
app.get("/contact", PhotoControllers.getContact);
app.post("/contact", PhotoControllers.sendEmail);
app.get('/photos/:id', PhotoControllers.getSinglePhoto);
app.get('/photos/edit/:id', PhotoControllers.getEditPhoto);
app.post('/photos', PhotoControllers.getUploadPhoto);
// Edit
app.put('/photos/:id', PhotoControllers.getEditedPhoto);
// Delete
app.delete('/photos/:id', PhotoControllers.getDeletePhoto);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Sunucu port ${port}'de çalışmaya başladı.`)
});