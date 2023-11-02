import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const collectionSchema: Schema = new mongoose.Schema({
    collection_id:{
        type:String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    access: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    artworks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artwork' 
    }]

});
collectionSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("collection").findOne({ collection_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.collection_id= uniqueCode;
    next();
  });

const Collection = mongoose.model("collection", collectionSchema);

export default Collection;