var mongoose              = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose");

//SCHEMA IS KIND OF LIKE TABLES IN A SQL DATABASE
var UserSchema = new mongoose.Schema( {
    username: String,
    password: String,
    email: String,
    deviceId: String
});
//MAKING SURE YOU CAN USE IT AS A LOGIN CREDENTIAL
UserSchema.plugin(passportLocalMongoose);
//EXPORT THE SCHEMA(MODEL) AS THE NAME User
module.exports = mongoose.model("User", UserSchema);
