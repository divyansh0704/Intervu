const userModel = require("../models/user.model");
const blackListModel = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide username,email and password" })
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }]

    })
    if (user) {
        return res.status(400).json({ error: "Account already exists with this email address or username" })

    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = await jwt.sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)
    res.status(201).json({

        message: "Account created successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    })





}

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({error:"Invalid email or password"})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({error:"Invalid email or password"})
    }

    const token =  await jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)
    res.status(200).json({

        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}
const logoutUser = async(req,res)=>{
    const token = req.cookies.token;
    if(token){
        await blackListModel.create({token});


    }
        res.clearCookie("token");
        res.status(200).json({message:"Logout successful"})


}
const getUser = async(req,res)=>{
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        message:"User fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = { registerUser, loginUser, logoutUser, getUser };
