const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware");

router.post("/",authMiddleware,upload.single("resume"),interviewController.generateReport)
router.get("/",authMiddleware,interviewController.getAllReportsByUserId)
router.get("/report/:interviewId",authMiddleware,interviewController.getReportById)
router.post("/resume/pdf/:interviewReportId",authMiddleware,interviewController.generateResume)


module.exports = router;