const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// connect DB
mongoose.connect('mongodb://localhost/freelancer-test-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//create Schema
const PhotoSchema = new Schema({
    title: String,
    description: String
});
const Photo = mongoose.model('Photo', PhotoSchema);
// create a photo
// Photo.create({
//     title: "Photo Title 1",
//     description: "Photo Description 1 lorem ipsum"
// });

// read photo
Photo.find({}, (err, data) => {
    console.log(data);
});

// test etmek için node test yaz