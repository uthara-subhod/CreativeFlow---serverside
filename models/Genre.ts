import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const genreSchema: Schema = new mongoose.Schema({
  cat_id:{
        type:String,
        default: "",
    },
    name: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    items:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book' 
    }],

});

genreSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("genre").findOne({ cat_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.cat_id = uniqueCode;
    next();
  });

const Genre = mongoose.model("genre", genreSchema);

export default Genre;