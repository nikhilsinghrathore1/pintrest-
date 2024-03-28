const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterestDB");

const userSchema = mongoose.Schema({
  username : String,
  password:String,
  email:String,
  profileImg:{
    type:String,
    default:null
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }],
  date:{
    type:Date,
    default : Date.now
  },
  savedpost:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }],

  
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);