import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const bookSchema: Schema = new mongoose.Schema({
    book_id:{
        type:String,
        default: "",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    title: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    copyright: {
        type: String,
        default: "",
    },
    mature:{
        type:Boolean,
        default:false
    },
    tags:[{
        type: String,
        default:''
    }],
    language:{
        type: String,
        default: "",
    },
    chapters:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chapter' 
    }],
    premium:{
        type:Boolean,
        default:false,
    },
    pricing:{
        type: Number,
        default:0,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genre' 
    },
    published:{
        type:Boolean,
        default:false,
    },
    publishedAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    complete:{
        type:Boolean,
        default:false,
    },
    warning:{
        type:Number,
        default:0
        
    },
    deleted:{
        type:Boolean,
        default:false
    },

});
bookSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("book").findOne({ book_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.book_id= uniqueCode;
    next();
  });

const Book = mongoose.model("book", bookSchema);

export default Book;