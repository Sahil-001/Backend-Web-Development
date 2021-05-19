
const express = require('express');
const router = express.Router();
const frontController = require('../controllers/front');
const isAuth = require('../middleware/auth');

router.get('/',frontController.getHomepage);

router.get('/electric',frontController.getElectric);

router.get('/self',frontController.getSelfDriving);

router.get('/racing',frontController.getRacing);

router.get('/racing/aston',frontController.getRacingAston);

router.get('/racing/bmw',frontController.getRacingBmw);

router.get('/racing/bugatti',frontController.getRacingBugatti);

router.get('/racing/ferrari',frontController.getRacingFerrari);

router.get('/racing/koei',frontController.getRacingKoei);

router.get('/racing/lambo',frontController.getRacingLambo);

router.get('/racing/mac',frontController.getRacingMac);

router.get('/racing/pagani',frontController.getRacingPagani);

router.get('/racing/porsche',frontController.getRacingPorsche);



router.get('/gallery',isAuth,frontController.getGallery);

router.get('/gallery/:imageId',isAuth,frontController.deleteGalleryImage);

router.get('/gallery/download/:imageId',isAuth,frontController.downloadImage);

router.post('/gallery',isAuth,frontController.postGallery);

router.post('/register',frontController.postRegister);






module.exports = router;