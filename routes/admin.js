const express = require('express');
const router = express.Router();
const {check,body} = require('express-validator');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/auth');
const isAuth2 = require('../middleware/auth2');

router.get('/signup',adminController.getSignup);

router.post('/signup',
[check('email')
.isEmail()
.withMessage('please enter a valid email')
.custom((value,{req}) => {
    if(value === 'kadyansahil702@gmail.com')
    {
        throw new Error('Access Forbidden');
    }
    return true;
}),body('password', 'Password must be 8 characters long')
.isLength({min: 7})
.isAlphanumeric()
,body('confirmPassword')
.custom((value,{req}) => {
    if(value !== req.body.password)
    {
        throw new Error('Passwords dont matches');
    }
    return true;
})],adminController.postSignup);

router.get('/login',adminController.getLogin);

router.get('/logout',isAuth,adminController.getLogout);

router.post('/login',[check('email')
.isEmail()
.withMessage('please enter a valid email')
],adminController.postLogin);

router.get('/reset',adminController.getReset);
router.post('/reset',[check('email')
.isEmail()
.withMessage('please enter a valid email')
],
adminController.postReset);

router.get('/reset/verify',isAuth2,adminController.getVerify);

router.post('/reset/verify',adminController.postVerify);

router.get('/reset/resetPassword',isAuth2,adminController.getResetPassword);

router.post('/reset/resetPassword',[body('password', 'Password must be 8 characters long')
.isLength({min: 7})
.isAlphanumeric()
,body('confirmPassword')
.custom((value,{req}) => {
    if(value !== req.body.password)
    {
        throw new Error('Passwords dont matches');
    }
    return true;
})],adminController.postResetPassword);




module.exports = router;

