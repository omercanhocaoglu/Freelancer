const Photo = require('../models/Photo');
const fs = require('fs');
const nodemailer = require('nodemailer');

exports.getAllPhotos = async ( req, res ) => {
    const page = req.query.page || 1;
    const photosPerPage = 3;
    const totalPhotos = await Photo.find().countDocuments();
    // console.log(totalPhotos);
    
    const photos = await Photo.find({}).sort('-dateCreated')
    .skip((page -1) *photosPerPage)
    .limit(photosPerPage);
    res.render('index', {
        photos: photos,
        current: page,
        pages: Math.ceil(totalPhotos / photosPerPage)
    });
};
// for add photo
exports.getAddPhoto = async (req, res) => {
    res.render('add');
};
// for contact
exports.getContact = async (req, res) => {
    res.render('contact');
};
// for send email
exports.sendEmail = async (req, res) => {
    try { 
    const outputMessage = `
      <h1> Mail Details </h1>
      <ul>
        <li> Name: ${req.body.name} </li>
        <li> Email: ${req.body.email} </li>
      </ul>
      <h1> Message </h1>
      <p> ${req.body.message} </p>
    `
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "omercanhocaoglu53@gmail.com", // gmail account
        pass: "kwjhjgwtunxzjacp", // gmail password
      },
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Freelancer Contact Form" <omercanhocaoglu53@gmail.com>', // sender address
      to: "omercanhocaoglu53@gmail.com", // list of receivers
      subject: "Freelancer Contact Form New Message ✔", // Subject line
      html: outputMessage, // html body
    });
      
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    req.flash("success", "We received your message succesfully");
    res.status(200).redirect('contact');
  } catch (err) {
    console.log(err);
    req.flash("error", `Something happened!`);
    res.status(200).redirect('contact');
  }
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