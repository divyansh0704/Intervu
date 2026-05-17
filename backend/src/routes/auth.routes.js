const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const {registerUser,loginUser,logoutUser,getUser} = require("../controllers/user.controller")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/getme",authMiddleware,getUser)

module.exports = router;