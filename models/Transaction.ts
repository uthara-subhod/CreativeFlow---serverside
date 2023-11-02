import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const transactionSchema: Schema = new mongoose.Schema({
    transaction_id:{
        type:String,
        default: "",
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    seller:{
        type: String,
        required: true,
    },
    paymentID:{
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        required:true,
    },
    detail:{
        type:String,
        required:true
    },
    paid:{
        type:Boolean,
        default:false
    },
    status:{
        type:String
    }
    
});
transactionSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("transaction").findOne({ transaction_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.transaction_id = uniqueCode;
    next();
  });

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;