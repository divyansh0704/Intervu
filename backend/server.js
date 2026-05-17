require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
// const {resume,jobdescription,selfdescription} = require("./src/services/temp")
// const generateInterviewReport = require("./src/services/ai.service")

connectDB()
// generateInterviewReport({resume,jobdescription,selfdescription})


app.listen(3000, () => console.log("Server running on port 3000"));