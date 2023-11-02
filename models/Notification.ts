import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const notificationSchema: Schema = new mongoose.Schema({
    notification_id:{
        type:String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    item:{
        type:String,
        required:false,
    },
    types:{
        type:String,
        required:true,
    },
    content:{
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
    },
    deleted: {
        type:Boolean,
        default:false
    }
    
});
notificationSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("notification").findOne({ notification_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.notification_id = uniqueCode;
    next();
  });

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;