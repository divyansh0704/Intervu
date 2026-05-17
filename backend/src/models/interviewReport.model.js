const  mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention behind the question is required"]
    },
    answer:{
        type:String,
        required:[true,"answer to the question is required"]
    }
},{
    _id:false
})
const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention behind the question is required"]
    },
    answer:{
        type:String,
        required:[true,"answer to the question is required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"skill name is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity of the skill gap is required"]

    }

},{
    _id:false
})
const preparationalPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"day number is required for preparational plan"]
    },
    focus:{
        type:String,
        required:[true,"focus of the day is required for preparational plan"]
    },
    tasks:[{
        type:String,
        required:[true,"tasks for the day are required for preparational plan"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobdescription:{
        type:String,
        required:[true,"job description is required"]

    },
    resume:{
        type:String
    },
    selfdescription:{
        type:String
    },
    matchscore:{
        type:Number,
        min:0,
        max:100
    },
    technicalquestions:[technicalQuestionSchema],
    behavioralquestions:[behavioralQuestionSchema],
    skillgaps:[skillGapSchema],
    preparationalplan:[preparationalPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:[true,"title of the interview report is required"]
    }
},{
    timestamps:true
})

const InterviewReportModel = mongoose.model("InterviewReport",interviewReportSchema);

module.exports = InterviewReportModel;