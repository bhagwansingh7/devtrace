import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema({

    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },

    endpoint:{
        type:String
    },

    method:{
        type:String
    },

    statusCode:{
        type:Number
    },

    responseTime:{
        type:Number
    },

    ipAddress:{
        type:String
    }

},{timestamps:true})

const ApiLog = mongoose.model("ApiLog",apiLogSchema)

export default ApiLog