import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require: true,
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require: false,
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        require:function(){
            return this.messageType==="text";
        },
    },
    fileUrl:{
        type:String,
        require:function(){
            return this.messageType==="file";
        },
    },
    Timestamp:{
        type:Date,
        default:Date.now,
    },
});

const Message = mongoose.model("Messages",messageSchema);

export default Message;  