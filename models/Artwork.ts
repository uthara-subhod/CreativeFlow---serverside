import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const artworkSchema: Schema = new mongoose.Schema({
    artwork_id:{
        type:String,
        default: "",
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    title: {
        type: String,
        required: true,
    },
    artwork: {
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
        ref: 'artfield' 
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
    warning:{
        type:Number,
        default:0
        
    },
    votes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    deleted:{
        type:Boolean,
        default:false
    }

});
artworkSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("artwork").findOne({ artwork_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.artwork_id= uniqueCode;
    next();
  });

const Artwork = mongoose.model("artwork", artworkSchema);

export default Artwork;