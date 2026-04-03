import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema({

    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },

    endpoint:{
        type:String,
        required:true,
        trim:true
    },

    method:{
        type:String,
        enum:["GET","POST","PUT","DELETE","PATCH"],
        required:true
    },

    errorMessage:{
        type:String,
        required:true
    },

    stackTrace:{
        type:String
    },

    statusCode:{
        type:Number,
        default:500
    },

    ipAddress:{
        type:String
    },

    userAgent:{
        type:String
    }

},{
    timestamps:true
})

const ErrorLog = mongoose.model("ErrorLog",errorLogSchema)

export default ErrorLog