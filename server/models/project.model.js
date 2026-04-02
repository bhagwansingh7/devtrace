import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    apiKey:{
        type:String,
        required:true
    }

},{timestamps:true})

const Project = mongoose.model("Project",projectSchema)

export default Project