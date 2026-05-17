const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173", "https://intervu-brown.vercel.app/","https://intervu-5sw3yv1iv-divyanshs-projects-e0500169.vercel.app/"],
    credentials:true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app;