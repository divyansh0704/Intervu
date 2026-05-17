
const pdfParse = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const InterviewReport = require("../models/interviewReport.model")
async function generateReport(req,res){
    const resumeFile = req.file;
    // const resumeContent  = await pdfParse(resumeFile.buffer);
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
    const {selfdescription,jobdescription} = req.body;

    const report = await generateInterviewReport({resume:resumeContent.text,selfdescription,jobdescription});

    const newReport = await InterviewReport.create({
        user: req.user.id,
        resume:resumeContent.text,
        selfdescription,
        jobdescription,
        ...report

    })
    res.status(201).json({
        message:"Interview report generated successfully",
        report:newReport
    })




}

async function getReportById(req,res){
    const {interviewId} = req.params;
    console.log("interviewId:",interviewId)

    const interviewReport = await InterviewReport.findById(interviewId);
    if(!interviewReport){
        return res.status(404).json({message:"Interview report not found"})
    }
    res.status(200).json({
        message:"Interview report fetched successfully",
        report:interviewReport
    });
}

async function getAllReportsByUserId(req,res){
    const interviewReports = await InterviewReport.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfdescription -jobdescription -__v -technicalquestions -behavioralquestions -skillgaps -preparationalplan");

    res.status(200).json({
        message:"Interview reports fetched successfully",
        reports:interviewReports
    });



}

async function generateResume(req,res){
    const {interviewReportId}= req.params;

    const interviewReport = await InterviewReport.findById(interviewReportId);
    if(!interviewReport){
        return res.status(404).json({message:"Interview report not found"})
    }
    const {resume,selfdescription,jobdescription} = interviewReport
    const pdfBuffer = await generateResumePdf({
        resume,
        selfdescription,
        jobdescription
    });
    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })
    // res.status(200).json({message:"Resume generated successfully",resume});
    res.send(pdfBuffer)

}

module.exports = {generateReport,getReportById,getAllReportsByUserId,generateResume}