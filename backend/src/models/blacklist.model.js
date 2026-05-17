const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    }
},{
    timestamps:true
}) 

const blackList = mongoose.model("BlackList",blacklistSchema);

module.exports = blackList;