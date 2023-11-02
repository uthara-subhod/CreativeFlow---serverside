import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IUser{
    _id?:string;
    user_id?:string;
    fullname?: string;
    email?: string;
    password: string;
    joinedAt?: Date;
    profile?: string;
    access?: boolean;
    bio?:string;
    followers?:string[];
    following?:string[];
    blocked?:string[];
    artist?:boolean;
    author?:boolean;
    premium?:Date;
    plan?:string;
    pro?:boolean;
    warning?:number;
    isSocial?:boolean;
    banner?:string;
}

const userSchema: Schema = new mongoose.Schema({
    user_id:{
        type:String,
        default: "",
    },
    fullname: {
        type: String,
        default: "",
    },
    banner:{
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: "",
    },
    joinedAt: {
        type: Date,
        default: Date.now(),
    },
    profile: {
        type: String,
        default: "",
    },
    bio:{
        type:String,
        default:"",
    },
    access: {
        type: Boolean,
        default: true,
    },
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }],
    blocked: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }],
    chat:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    message:{
        type:Boolean,
        default:false,
    },
    artist:{
        type:Boolean,
        default:false,
    },
    author:{
        type:Boolean,
        default:false,
    },
    plan:{
        type:String,
        default:'' 
    },
    premium:{
        type:Date,
        default:Date.now()
    },
    country:{
        type:String,
        default:''
    },
    pro:{
        type:Boolean,
        default:false
    },
    warning:{
        type:Number,
        default:0
    },
    isSocial:{
        type:Boolean,
        default:false,
    },
});
userSchema.pre("save", async function (next) {
    if(this.user_id==''||!this.user_id){

        let uniqueCode;
        let isUnique = false;
    
        while (!isUnique) {
          uniqueCode = uuidv4(); 
          const existingOrder= await mongoose.model("user").findOne({ user_id: uniqueCode })
          isUnique = !existingOrder;
        }
          this.user_id = uniqueCode;
        next();
    }
  });

const User = mongoose.model<IUser>("user", userSchema);

export default User;