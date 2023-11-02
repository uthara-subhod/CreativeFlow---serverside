// models/Comment.js
import mongoose from "mongoose";
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const commentSchema:Schema = new mongoose.Schema({
    comment_id:{
        type: String,
        dafault:'',
    },
    message: {
        type: String,
        required: true
    },
    location: {
        place: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reply:{
        type:Boolean,
        default:false
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    dateAt:{
        type:Date,
        default:Date.now()
    },
    edited:{
        type:Boolean,
        default:false
    }
});

commentSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = uuidv4(); 
      const existingOrder= await mongoose.model("comment").findOne({ comment_id: uniqueCode })
      isUnique = !existingOrder;
    }
      this.comment_id = uniqueCode;
    next();
  });

const Comment = mongoose.model('comment', commentSchema);
export default Comment
