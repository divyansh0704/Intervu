require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
// const {resume,jobdescription,selfdescription} = require("./src/services/temp")
// const generateInterviewReport = require("./src/services/ai.service")

connectDB()
// generateInterviewReport({resume,jobdescription,selfdescription})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));