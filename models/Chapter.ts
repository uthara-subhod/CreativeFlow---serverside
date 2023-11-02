import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const chapterSchema: Schema = new mongoose.Schema({
    chapter_id:{
        type:String,
        default: "",
    },
    title: {    
        type: String,
        default: "Untitled",
    },
    content: {
        type: String,
        default: "",
    },
    words:{
        type:Number,
        default:0
    },
    published:{
        type:Boolean,
        default:false,
    },
    publishedAt:{
        type:Date,
        default:Date.now()
    },
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    },
    votes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]

});
chapterSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("chapter").findOne({ chapter_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.chapter_id = uniqueCode;
    next();
  });

const chapter = mongoose.model("chapter", chapterSchema);

export default chapter;