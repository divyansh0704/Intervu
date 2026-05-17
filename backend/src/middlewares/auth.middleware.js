const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

const authUser= async(req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({error:"Unauthorized"})
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blackListModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ error: "token not provided" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({error:"Unauthorized"})

    }
    
}

module.exports = authUser;