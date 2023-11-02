import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const moderatorSchema: Schema = new mongoose.Schema({
    mod_id:{
        type:String,
        default: "",
    },
    role:{

    },
    username: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now(),
    },
    access: {
        type: Boolean,
        default: true,
    },
});
moderatorSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("moderator").findOne({ mod_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.mod_id = uniqueCode;
    next();
  });

const Mod = mongoose.model("moderator", moderatorSchema);

export default Mod;