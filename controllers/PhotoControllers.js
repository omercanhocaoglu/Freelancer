const Photo = require('../models/Photo');
const fs = require('fs');

// for all photos
exports.getAllPhotos = async ( req, res ) => {
    const photos = await Photo.find({}).sort('-dateCreated');
    res.render('index', {
        photos
    });
};
// for add photo
exports.getAddPhoto = async (req, res) => {
    res.render('add');
};
//for single photo
exports.getSinglePhoto = async (req, res) => {
    // console.log(req.params.id);
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo
    }); 
};
// for photo edit
exports.getEditPhoto =  async (req, res) =>{
    const photoID = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photoID
    });
};
// for upload photo
exports.getUploadPhoto = async ( req, res ) => {
    //console.log(req.files.image);
    // console.log(req.body);
    //await Photo.create(req.body);
    //res.redirect('/');
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    };  
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadedImage.name
        });
        res.redirect('/');
    });
};
// for edited photo
exports.getEditedPhoto = async (req, res) => {
    const photoUpdate = await Photo.findOne({ _id: req.params.id });
    photoUpdate.title = req.body.title;
    photoUpdate.description = req.body.description;
    photoUpdate.save();
    res.redirect(`/photos/${req.params.id}`);
}
// for delete photo
exports.getDeletePhoto = async ( req, res ) => {
    // console.log(req.params.id);
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove( req.params.id );
    res.redirect('/');
}