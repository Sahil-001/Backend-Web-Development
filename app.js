const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');

const frontRoutes = require('./routes/front');
const adminRoutes = require('./routes/admin');

const User = require('./model/user');
const user = require('./model/user');

const MONGODB_URI = ' ';

const app = express();

const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'images')));



app.use(session({
  secret: "my name is sahil",
  resave: false,
  saveUninitialized: false,
  store: store
}))


const csrfProtection = csrf();

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
    if(!req.session.user)
    {
      return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
         next();
    }).catch(err => {
      console.log(err);
    })
    
})

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})


app.use(adminRoutes);
app.use(frontRoutes);

mongoose.connect(MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
   console.log('Client connected');   
   app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

//app.listen(3000);