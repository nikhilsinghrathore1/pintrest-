const mongoose = require("mongoose");
const users = require("./users");

mongoose.connect("mongodb://127.0.0.1:27017/pinterestDB");

const postSchema = mongoose.Schema({
 imageText: String,
 image:String,
 userId : {
               type:mongoose.Schema.Types.ObjectId,
               ref:"user"
 },
});

module.exports = mongoose.model("post",postSchema);