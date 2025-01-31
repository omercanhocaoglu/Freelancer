const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();

// Template engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static('public'));

// Pages
app.get( "/", ( req, res ) => {
    res.render('index');
});
app.get("/add", (req, res) => {
    res.render('add');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu port ${port}'de çalışmaya başladı.`)
});