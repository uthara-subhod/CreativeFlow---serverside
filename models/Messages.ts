import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const messageSchema: Schema = new mongoose.Schema({
    message_id:{
        type:String,
        default: "",
    },
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    message:{
        type:String,
        default:'',
    },
    read:{
        type:Boolean,
        default:false,
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
    
});
messageSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("message").findOne({ message_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.message_id = uniqueCode;
    next();
  });

const Message = mongoose.model("message", messageSchema);

export default Message;