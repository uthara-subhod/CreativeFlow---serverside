import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const adminSchema: Schema = new mongoose.Schema({
    username: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model("admin", adminSchema);

export default Admin;