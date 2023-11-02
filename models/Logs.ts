import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const logSchema: Schema = new mongoose.Schema({
    log_id: {
        type: String,
        default: "",
    },
    moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moderator'
    },
    action: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    book_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    },
    artwork_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artwork'
    },
    chapter_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chapter'
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    provider_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider'
    },
    reason:{
        type: String,
        required: true,
    },
    approve:{
        type:Boolean,
    },
    log_date: {
        type: Date,
        default: Date.now(),
    },
    
});
logSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
        uniqueCode = uuidv4();
        const existingOrder = await mongoose.model("log").findOne({ log_id: uniqueCode })
        isUnique = !existingOrder;
    }
    this.log_id = uniqueCode;
    next();
});

const Logs = mongoose.model("log", logSchema);

export default Logs;