const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer")





const interviewReportSchema = z.object({
    matchscore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalquestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralquestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillgaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationalplan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    systemInstruction: "You are a specialized JSON generator. You must only output valid JSON based on the provided schema."
})

/**
 * Clean AI response by removing markdown backticks if present
 */
function cleanJson(text) {
    return text
        .replace(/^```json\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
}

async function generateInterviewReport({ resume, jobdescription, selfdescription }) {

    const prompt = `
        You are an expert technical recruiter specialized in generating structured interview reports.
        Your task is to analyze the provided Job Description, Resume, and Self Description.
        Based on this analysis, generate a comprehensive interview report.
        
        Job Description: ${jobdescription}
        Resume: ${resume}
        Self Description: ${selfdescription}
        
        ---
        
        You MUST return ONLY a JSON object. This JSON object must strictly conform to the following JSON schema:
        ${JSON.stringify(zodToJsonSchema(interviewReportSchema))}
        
        Here are crucial guidelines for the JSON output structure:
        
        1.  **Top-Level Structure**: The response must be a single JSON object. Do NOT wrap it in an outer key like "interview_report".
        2.  **Exact Keys**: Use the exact keys: \`matchscore\`, \`technicalquestions\`, \`behavioralquestions\`, \`skillgaps\`, \`preparationalplan\`, and \`title\`.
        3.  **Array of Objects**: For arrays such as \`technicalquestions\`, \`behavioralquestions\`, \`skillgaps\`, and \`preparationalplan\`, EACH element within these arrays MUST be a JSON object, not a simple string.
        4.  **Nested Fields**: Ensure all nested fields (e.g., \`question\`, \`intention\`, \`answer\` within questions,\`day\`, \`focus\`, \`tasks\` within preparationalplan or \`skill\`, \`severity\` within skill gaps) are correctly populated with strings, numbers, or enum values as specified in the schema. Do not leave any field as \`undefined\`.
        5.  **Enum Adherence**: For the \`severity\` field in \`skillgaps\`, the value MUST be one of "low", "medium", or "high".
        6.  **Number Format**: For the 'day' field in 'preparationalplan', the value MUST be a plain integer (e.g., 1, 2, 3), not a string like "Day 1" or "Day 1-2".
        
        Example of expected format for a single technical question:
        \`\`\`

        Generate the report in a JSON format based on the schema below:
        ${zodToJsonSchema(interviewReportSchema)}

        IMPORTANT: You must return ONLY a JSON object that matches the provided schema EXACTLY. 
        Do not wrap the response in a top-level key like "interview_report". 
        Use the exact keys: matchscore, technicalquestions, behavioralquestions, skillgaps, preparationalplan, and title.

        For arrays like 'technicalquestions', 'behavioralquestions', 'skillgaps', and 'preparationalplan', each element must be an OBJECT with the specified fields, not just a string.
        `;

    


    const response = await ai.models.generateContent({

        model: "gemini-3-flash-preview",
        contents: prompt,

        config: {
            
            responseFormat: {
                text: {
                    mimeType: "application/json",
                    schema: zodToJsonSchema(interviewReportSchema)
                }
            }
        }
    });

    return JSON.parse(response.candidates[0].content.parts[0].text)

}

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent,{waitUntil:"networkidle2"});
    const pdfBuffer = await page.pdf({
        format: "A4",margin:{
            top:"16mm",
            left:"10mm",
            right:"10mm",
            bottom:"16mm"
        }
    });
    await browser.close();
    return pdfBuffer


}

async function generateResumePdf({resume, jobdescription, selfdescription}){
    const resumePdfSchema  = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using Puppeteer"),
        
    })

    const prompt = `
        You are an expert resume builder. Generate a professional HTML resume for a candidate.
        
        Candidate Resume Data: ${resume}
        Target Job Description: ${jobdescription}
        Candidate Self-Description: ${selfdescription}

        while building an resume content take reference from already existed resume ${resume},try to make existed resume more better as better as you can according to job role and make changes in this according to ${jobdescription} try to keep format same as ${resume} keep it clean simple and professional.
        The resume should be tailored for the given jobdesription and should highlight the candidate's skills, experience, and qualifications.the content should be well formatted and well-structured to make it easy to read and understand.
        The content of resume should be not sound like its generated by AI and should be close as possible to real human written resume.
        You can highlight the content using some colors or diffrent font styles but the overall design should be simple and professional.
        The content should be ATS friendly, i.e. it should be easily parsable by ATS system.
        The resume should not be too lengthy, it should be ideally be 1-2 pages long when converted to PDF.Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an  interviewcall for given jobdescription.
        ---
        
        You MUST return ONLY a JSON object. Do NOT wrap it in markdown code blocks.
        The JSON object must have a single field: "html".
        The "html" field should contain a complete, well-styled HTML string optimized for A4 PDF conversion.
                   
                    `
    const response = await ai.models.generateContent({

        model: "gemini-3-flash-preview",
        contents: prompt,

        config: {
            
            responseFormat: {
                text: {
                    mimeType: "application/json",
                    schema: zodToJsonSchema(resumePdfSchema)
                }
            }
        }
        
    });    
    const jsonContent =  JSON.parse(response.candidates[0].content.parts[0].text)    
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer


}


module.exports = {generateInterviewReport,generateResumePdf}
