import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const providerSchema: Schema = new mongoose.Schema({
    provider_id: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        required: true,
    },
    lower: {
        type: Number,
        required: true,
    },
    higher: {
        type: Number,
        required: true,
    },
    deliveryTime:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    links: [{
        type: String,
        required: true,
    }],
    approved:{
        type:Boolean,
    },
    rating:{
        type:Number
    },
    customers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    raters:{
        type:Number,
        default:0,            
    },
    date:{
        type:Date,
        default:Date.now()
    }

});

providerSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;
    while (!isUnique) {
        uniqueCode = uuidv4();
        const existingOrder = await mongoose.model("provider").findOne({ cat_id: uniqueCode })
        isUnique = !existingOrder;
    }
    this.provider_id = uniqueCode;
    next();
});

const Provider = mongoose.model("provider", providerSchema);

export default Provider;