const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');

const User = require('../model/user');
const { checkout } = require('../routes/front');

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');
    console.log(message);
    if(message.length > 0)
    {
        message = message[0];
    }
    else
    {
        message = null;
    }

    res.render('auth/signup',{
        pageTitle: "Sign Up",
        errorMessage: message,
        path: "/signup"
    })
}

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            path: "/signup"
          });
    }
    User.findOne({email : email}).then(userDoc => {
        if(userDoc)
        {
            console.log('email already exist please use another email');
            req.flash('error','email already exist please use another email');
            return res.redirect('/signup');
        }

        return bcrypt.hash(password,12).then(hashedPassword => {
            const user = new User({email : email , password: hashedPassword});
            return user.save();  
        }).then(result => {
            console.log(result);
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })

    }).catch(err => {
        console.log(err);
    })
}

exports.getLogin = (req,res,next) => {
    let message = req.flash('error');
    console.log(message);
    if(message.length > 0)
    {
        message = message[0];
    }
    else
    {
        message = null;
    }

    res.render('auth/login',{
        pageTitle: "Log in",
        errorMessage: message,
        path: "/login"
    })
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            path: "/login"
          });
    }

    User.findOne({email : email}).then(user => {
        if(!user)
        {
            console.log('please signup first');
            req.flash('error','email id do not exist, please sign up first');
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password)
        .then(match => {
            if(!match)
            {
                console.log('password doesn;t match');
                req.flash('error','Wrong Password, Please try again !');
                return res.redirect('/login');
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
            
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    }).catch(err => {
        console.log(err);
    });

}

exports.getLogout = (req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
}

exports.getReset = (req,res,next) => {
    let message = req.flash('error');
    console.log(message);
    if(message.length > 0)
    {
        message = message[0];
    }
    else
    {
        message = null;
    }

    res.render('auth/reset',{
        pageTitle: "Reset Password",
        errorMessage: message,
        path: "/reset"
    })

}

var resetOtp;
var resetEmail;
exports.postReset = (req,res,next) => {
    const email = req.body.email;
    resetEmail = email;

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(422).render('auth/reset', {
            pageTitle: 'Reset Password',
            errorMessage: errors.array()[0].msg,
            path: "/reset"
          });
    }

    User.findOne({email : email}).then(user => {
        if(!user)
        {
            console.log('please signup first');
            req.flash('error','email id do not exist, please sign up first');
            return res.redirect('/login');
        }
        const otp = Math.floor((Math.random() * 1000000) + 100000);
        resetOtp = otp;
        req.session.isResetIn = true;
        req.session.save(err => {
            console.log(err);
            });
        async function main() {

            let transporter = nodemailer.createTransport({
     
               service: 'gmail',
              auth: {
                user: ' ', //use your gmail account
                pass: ' ', // password of that account
              },
            });
          
            let info = await transporter.sendMail({
              from: '', 
              to: email, 
              subject: "CarTechKeeda change Password", 
              html: "<b>Otp for password changing request is :"+otp+"</b>", // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            req.flash('error','check your emailId for otp');
            return res.redirect('/reset/verify');
          }
          
          main().catch(console.error);
        
        })
        .catch(err => {
        console.log(err);
    });

}
exports.getVerify = (req,res,next) => {
    let message = req.flash('error');
    console.log(message);
    if(message.length > 0)
    {
        message = message[0];
    }
    else
    {
        message = null;
    }

    res.render('auth/otp',{
        pageTitle: "Verify",
        errorMessage: message,
        path: "/reset/verify"
    })

}
exports.postVerify = (req,res,next) => {
    const otp = req.body.otp;
    //console.log(otp);
    //console.log(resetOtp);
    if(otp === resetOtp.toString())
    {
        return res.redirect('/reset/resetPassword');
    }
    req.flash('Wrong otp,try again');
    return res.redirect('/reset/verify');

}
exports.getResetPassword = (req,res,next) => {
    let message = req.flash('error');
    console.log(message);
    if(message.length > 0)
    {
        message = message[0];
    }
    else
    {
        message = null;
    }

    res.render('auth/resetPassword',{
        pageTitle: "Change Password",
        errorMessage: message,
        path: "/reset/resetPassword"
    })

}

exports.postResetPassword = (req,res,next) => {
    const email = resetEmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(422).render('auth/resetPassword', {
            pageTitle: 'Change Password',
            errorMessage: errors.array()[0].msg,
            path: "/reset/resetPassword"
          });
    }
    return bcrypt.hash(password,12).then(hashedPassword => {
        User.findOne({email: email}).then(user => {
            user.password = hashedPassword;
            return user.save(); 
         })
         .then(result => {
            console.log(result);
            req.flash('error','Password changes successfully, try login again');
            req.session.destroy(err => {
                console.log(err);
              });
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}