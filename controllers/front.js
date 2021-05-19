const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");

const Image = require('../model/image');
const Gallery = require('../model/gallery');
exports.getHomepage = (req,res,next) => {
    res.render('home',{
        pageTitle: 'CarTechKeeda',
        path: "/"
    });
}
exports.getElectric = (req,res,next) => {
    res.render('electric/electric',{
        pageTitle: 'Electric Cars',
        path: "/electric"
    });
}

exports.getSelfDriving = (req,res,next) => {
    res.render('self/self',{
        pageTitle: 'Self Driving Cars',
        path: "/self"
    });
}

exports.getRacing = (req,res,next) => {
    res.render('racing/racing',{
        pageTitle: 'Racing Car',
        path: "/racing"
    });
}

exports.getRacingAston = (req,res,next) => {
    Image.find({name: "aston"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/aston',{
            pageTitle: 'Aston Martin',
            fileName: 'aston',
            images:imageArray,
            path: "/racing"
        });
        
    })
    .catch(err => console.log(err));
   
}

exports.getRacingBmw = (req,res,next) => {
    Image.find({name: "bmw"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            return;
        }
        res.render('racing/bmw',{
            pageTitle: 'BMW',
            fileName: 'bmw',
            images:imageArray,
            path: "/racing"
        });
    })
    .catch(err => console.log(err));
    
}

exports.getRacingBugatti = (req,res,next) => {
    Image.find({name: "bugatti"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/bugatti',{
            pageTitle: 'Bugatti',
            images:imageArray,
            path: "/racing"
        }); 
        
    })
    .catch(err => console.log(err));
}

exports.getRacingFerrari = (req,res,next) => {
    Image.find({name: "ferrari"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/ferrari',{
            pageTitle: 'Ferrari',
            images:imageArray,
            path: "/racing"
        });
        
    })
    .catch(err => console.log(err));
    
}

exports.getRacingKoei = (req,res,next) => {
    Image.find({name: "koei"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/koei',{
            pageTitle: 'Koenigsegg',
            images:imageArray,
            path: "/racing"
        });
        
    })
    .catch(err => console.log(err));
   
}

exports.getRacingLambo = (req,res,next) => {
    Image.find({name: "lambo"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/lambo',{
            pageTitle: 'Lamborghini',
            images:imageArray,
            path: "/racing"
        });
        
    })
    .catch(err => console.log(err));
    
}

exports.getRacingMac = (req,res,next) => {
    Image.find({name: "mac"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/mac',{
            pageTitle: 'Maclaren',
            images:imageArray,
            path: "/racing"
        });
        
    })
    .catch(err => console.log(err));
    
}

exports.getRacingPagani = (req,res,next) => {
    Image.find({name: "pagani"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/pagani',{
            pageTitle: 'Pagani',
            images:imageArray,
            path: "/racing"
        });
        
        
    })
    .catch(err => console.log(err));
    
}

exports.getRacingPorsche = (req,res,next) => {
  
    Image.find({name: "porsche"})
    .then(imageArray => {
        if(imageArray.length === 0)
        {
            console.log("images are not available");
            next();
        }
        res.render('racing/porsche',{
            pageTitle: 'Porsche',
            images:imageArray,
            path: "/racing"
        });   
    })
    .catch(err => console.log(err));
}

exports.getGallery = (req,res,next) => {
    Gallery.find({userId: req.user._id}).then(images => {
        if(images.length === 0)
        {
            console.log("No image in the gallery");
            next();
        }
        res.render('gallery',{
            pageTitle : "Gallery",
            images: images,
            path: "/gallery"
        })
    })
    .catch(err => console.log(err));
}
exports.postGallery = (req,res,next) => {
    const imageId = req.body.imageId;

    Image.findById(imageId).then(image => {
        const galleryImage = new Gallery({userId: req.user._id,imageId: imageId,imageUrl: image.imageUrl});
         galleryImage.save()
          .then(result => {
               console.log(result);
               return res.redirect('/gallery');
             })
    })   
    .catch(err => console.log(err));
}

exports.deleteGalleryImage = (req,res,next) => {
    const imageId = req.params.imageId;
    Gallery.deleteOne({userId: req.user._id ,  _id: imageId}).then(result => {
        res.redirect('/gallery');
        console.log(result);
    }
    ).catch(err => {
        console.log(err);
    })
}

exports.downloadImage = (req,res,next) => {
    const imageId = req.params.imageId;
    Gallery.findById(imageId).then(image => {
        const imageUrl = image.imageUrl;
        const imagePath = path.join(__dirname,'..','images',imageUrl);
        fs.readFile(imagePath, (err,data) => {
            if(err)
            {
                return next(err);
            }
            res.send(data);
        })
    }
    ).catch(err => {
        console.log(err);
    })
}

exports.postRegister = (req,res,next) => {
    const email = req.body.registerEmail;
    async function main() {
   
        let transporter = nodemailer.createTransport({
        
           service: 'gmail',
          auth: {
            user: '', 
            pass: '', 
          },
        });
      
        
        let info = await transporter.sendMail({
          from: '', // sender address
          to: email, // list of receivers
          subject: "CarTechKeeda Registration", // Subject line
          html: "<b>You have registered successfully, we will keep you update about latest products and images</b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
           
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.redirect('/');
      }
      
      main().catch(console.error);
}



