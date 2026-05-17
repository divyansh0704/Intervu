import { generateReport, getAllReportsByUserId, getReportById,generateResumePdf } from "../services/interview.api"
import { useContext,useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router-dom"
export const useInterview = () => {
    const context = useContext(InterviewContext);
    const {interviewId} = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports ,setReports} = context;

    const generateInterviewReport = async ({ resume, jobdescription, selfdescription }) => {
        console.log("inHooks:", resume)
        setLoading(true);
        let response = null;
        try {
            response = await generateReport({ jobdescription, resume, selfdescription });
            setReport(response.report);
        } catch (error) {
            console.error("Error generating report:", error);
            throw error;
        } finally {
            setLoading(false);

        }
        return response.report

    }

    const getInterviewReportById = async (interviewId) => {
        setLoading(true);
        let response = null
        try {
            response = await getReportById(interviewId);
            setReport(response.report);
        } catch (error) {
            console.error("Error getting report:", error);
            throw error;
        } finally {
            setLoading(false);

        }
        console.log("report:",response.report)
        return response.report
    }

    const getAllInterviewReportsByUserId = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllReportsByUserId();
            setReports(response.reports);
        } catch (error) {
            console.error("Error getting reports:", error);
            throw error;
        } finally {
            setLoading(false);

        }

        return response.reports

    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([response],{type:"application/pdf"}));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error("Error getting resume:", error);
            // throw error;
        } finally {
            setLoading(false);
        }
    }

     useEffect(() => {
        if (!interviewId) {
            getAllInterviewReportsByUserId()
        } 
    }, [ interviewId ])

    return { loading, report, reports,getResumePdf, generateInterviewReport, getInterviewReportById, getAllInterviewReportsByUserId };


}