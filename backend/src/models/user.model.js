const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already taken"],
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:[true,"email already exists with this email address"]
    },
    password:{
        type:String,
        required:true
    }
})

const User = mongoose.model("User",userSchema);

module.exports = User;