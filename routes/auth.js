//===========================================
//   ALL IMPORTS 
//=========================================
var express        = require("express");
    router         = express.Router();  
    passport       = require("passport");
    LocalStrategy  = require("passport-local");
    User           = require("../models/user");
    bodyParser     = require("body-parser");
    app            = express();
    methodOverride = require("method-override");  
    nodemailer     = require("nodemailer");
    inLineCss = require('nodemailer-juice');
    // toEmail          = User.email;
//METHOD OVERRIDE INIT
    app.use(methodOverride("_method"));
//PASSPORT SETUP SECRET
    app.use(require("express-session")({
        secret: "I Love Cheeseburgers",
        resave: false,
        saveUninitialized: false
    }));

    app.use(bodyParser.urlencoded({ extended : true }));
    
//PASSPORT
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

//SET DEFAULT FILE TYPE
    app.set('view engine', 'ejs');

//MAKE A VAR FOR INSIDE ALL VIEWS FILES
    app.use(function(req,res, next){
        currentUser = req.user;
        next();
    });

    //LOGIN ROUTES
    app.get("/login", function(req, res){
        res.render("login");
    });

    app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }) ,function(req, res){
    });
//END LOGIN ROUTES

//SIGN UP ROUTES
    app.get("/signup", function(req, res){
        res.render("signup");
    });
    
    app.post("/signup", function(req, res){
        User.register(new User ({username: req.body.username, email: req.body.email}), req.body.password, function(err, email){
            if(err){
                console.log(err);
                return res.render('signup');
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/");
                });
            }
        });
    });

//END SIGNUP ROUTES

//PROFILE ROUTE  
      app.get("/profile", isLoggedIn, function(req, res){
        res.redirect("profile/" + req.user._id);
    });


    app.get("/profile/:id", isLoggedIn, function(req,res){
        res.render("profile");
        
    });

    app.put("/profile/:id",  function(req, res){        
      User.findByIdAndUpdate(req.params._id,{username: req.body.username, email: req.body.email},  function(err, updatedCurrentUser){
          if(err){
              res.redirect("/profile" + req.params._id);
          }else{

              res.redirect("/");
              console.log(req.body.username);
              console.log(req.body.email);
          }
      }) 
    });

// END PROFILE ROUTE

//ROOT ROUTE

    app.get("/", isLoggedIn, function(req, res){
        
        res.render("home");
    });

//END ROOT ROUTE

//CHECK IF LOGGED IN MIDDLEWARE
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
        
    }
    
    /* Node Mailer */

    app.post('/mail', (req, res) => {
        const email = req.user.email;
        const output = `
        <style>
            .btn-bevestigd{
                background-color:#FFC154;
                border-radius:10px;
                display:inline-block;
                cursor:pointer;
                color:white;	
                font-size:17px;
                padding:13px 41px;
                text-decoration:none;
                border: none;
                height: 3rem;
                width: 20rem;
            } a {
                color: white;
                text-decoration: none;
            } .btn-edit {
                background-color:#78C64D;
                border-radius:10px;
                display:inline-block;
                cursor:pointer;
                color:white;	
                font-size:17px;
                padding:13px 41px;
                text-decoration:none;
                border: none;
                height: 3rem;
                width: 10rem;
                bottom: 5%;
                left: 15%;
                transform: translate(-15%, -5%);
                position: absolute;
            }
        </style>
        
        <p>Bedankt voor u bestelling</p>
       
          <h1> Mooi he zo'n bestelling </h1>
          <p> Bedankt voor de bestelling om de bestelling te bevestigen kunt u op het 
          knopje hieronder klikken</p>
          <button class="btn-bevestigd"><a href="www.orderbevestigd.nl/bevestigd">Bevestigen</a></button>
          
          <p> Wilt u het wijzigen click dan hieronder <p>
          <button class=" btn-edit"><a href="www.orderbevestigd.nl/ditiswelweerjammer">Editen</a></button>

          
        `;
           

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.zxcs.nl',
    port: 465 ,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'gefeliciteerd@orderbevestigd.nl', // generated ethereal user
        pass: 'M56#kp#l'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
  transporter.use('compile', inLineCss(), req ,res);
  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Orderbevestigingssysteem" <gefeliciteerd@orderbevestigd.nl>', // sender address
      to: "luke@lukedixon.nl", // list of receivers
      subject: 'Order bevestigd', // Subject line      
      html: output
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s');   
      console.log('Preview URL: %s');

      res.send(' It works');
  });
});  


    app.get("/logout", function(req, res){
        req.logout();
        res.redirect("/login");
    });

  

module.exports = router;