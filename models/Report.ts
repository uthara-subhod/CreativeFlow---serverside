import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const reportSchema: Schema = new mongoose.Schema({
    report_id: {
        type: String,
        default: "",
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    violation: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    links:[{
        type:String
    }],
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
    resolved:{
        type:Boolean,
        default:false
    },
    reported_date: {
        type: Date,
        default: Date.now(),
    },
    resolved_date:{
        type: Date,
    },
    action:{
        type:String,
    }
    
});
reportSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
        uniqueCode = uuidv4();
        const existingOrder = await mongoose.model("report").findOne({ report_id: uniqueCode })
        isUnique = !existingOrder;
    }
    this.report_id = uniqueCode;
    next();
});

const Report = mongoose.model("report", reportSchema);

export default Report;