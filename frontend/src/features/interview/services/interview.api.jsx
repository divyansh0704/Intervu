import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})

export const generateReport = async({resume,jobdescription,selfdescription})=>{
    console.log("inServices:",resume)
    const formData = new FormData();
    formData.append("resume",resume);
    formData.append("jobdescription",jobdescription);
    formData.append("selfdescription",selfdescription);
    console.log("formData",formData)

    const response = await api.post("/interview/",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });

    return response.data;

}

export const getReportById = async(interviewId)=>{
    const response = await api.get(`/interview/report/${interviewId}`);
    return response.data;


}

export const getAllReportsByUserId = async()=>{
    const response = await api.get("/interview/");
    return response.data;
}

export const generateResumePdf = async({interviewReportId})=>{
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`,null,{
        responseType:"blob"
    });
    return response.data;
}


    
