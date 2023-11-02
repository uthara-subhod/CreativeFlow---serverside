import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const tokenSchema: Schema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: false },
    moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'moderator', required: false },
    expires: { type: Date, required: true },
    
});


const Token = mongoose.model("token", tokenSchema);


export default Token;