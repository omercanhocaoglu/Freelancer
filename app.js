const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Photo = require('./models/Photo');

// Template engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect DB
mongoose.connect('mongodb://localhost/freelancer-test-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Pages
app.get('/', async ( req, res ) => {
    const photos = await Photo.find({});
    res.render('index', {
        photos
    });
});
app.get("/add", (req, res) => {
    res.render('add');
});
app.get('/photos/:id', async (req, res) => {
    // console.log(req.params.id);
    // res.render();
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo
    }); 
});

app.post('/photos', async ( req, res ) => {
    // console.log(req.body);
    await Photo.create(req.body);
    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu port ${port}'de çalışmaya başladı.`)
});