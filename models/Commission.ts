import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const commissionSchema: Schema = new mongoose.Schema({
    commission_id: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        required: true,
    },
    amount:{
        type:Number
    },
    description: {
        type: String,
        required: true,
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    provider:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider'
    },
    agree1:{
        type:Boolean,
    },
    agree2:{
        type:Boolean,
    },
    agreeDate:{
        type:Date
    },
    status:{
        type:String,
        default:"pending"
    },
    date:{
        type:Date,
        default:Date.now()
    },
    paymentOrder:{
        type:String
    },
    paymentId:{
        type:String
    },
    paid:{
        type:Boolean,
        default:false
    }

});

commissionSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;
    while (!isUnique) {
        uniqueCode = uuidv4();
        const existingOrder = await mongoose.model("commission").findOne({ commission_id: uniqueCode })
        isUnique = !existingOrder;
    }
    this.commission_id = uniqueCode;
    next();
});

const Commission = mongoose.model("commission", commissionSchema);

export default Commission;