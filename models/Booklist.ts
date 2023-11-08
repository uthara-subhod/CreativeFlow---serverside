import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';



const listSchema: Schema = new mongoose.Schema({
    list_id: {
        type: String,
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
    name: {
        type: String,
        default: "",
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    }]

});
listSchema.pre("save", async function (next) {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
        uniqueCode = uuidv4();
        const existingOrder = await mongoose.model("booklist").findOne({ list_id: uniqueCode })
        isUnique = !existingOrder;
    }
    this.list_id = uniqueCode;
    next();
});

const Booklist = mongoose.model("booklist", listSchema);

export default Booklist;