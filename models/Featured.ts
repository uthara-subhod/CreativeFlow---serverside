import { Schema, Document } from "mongoose";
import mongoose from "mongoose";


const FeauturedSchema: Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    image: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        default: "",
    },
    description:{
        type: String,
        default: "",
    },
    item:{
        type:String,
        required:true
    }

});

const Feautured = mongoose.model("featured", FeauturedSchema);

export default Feautured;