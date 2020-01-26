//===========================================
//   ALL IMPORTS 
//=========================================
var mongoose = require("mongoose");
bodyParser = require("body-parser");
express = require("express");
app = express();
passport = require("passport");
LocalStrategy = require("passport-local");
User = require("./models/user");
methodOverride = require("method-override");
nodemailer = require("nodemailer");
//INCLUDE THE AUTH FILE TO THIS FILE
var
    authRoutes = require("./routes/auth");


//ADD PUBLIC AS A STANDERD FOLDER    
app.use(express.static(__dirname + '/public'));
//BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
//METHOD OVERRIDE INIT
app.use(methodOverride("_method"));
//CONFIG FOR MONGOOSE
mongoose.set('useFindAndModify', false);
//CONNECT TO DATABASE
mongoose.connect("mongodb://localhost/kpn-dash");

app.use(authRoutes);




//START SERVER ON PORT 3000
app.listen(4500, function () {
    console.log("It's Alive");
});
