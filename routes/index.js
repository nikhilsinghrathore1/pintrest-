var express = require('express');
const passport = require('passport');
var router = express.Router();
var userModel = require("./users");
var postModel = require("./posts");
var localStrategy = require("passport-local");
var upload = require("./multer");
const { Router } = require('express');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/profile",isLoggedIn,async(req,res)=>{
  let user = await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts")
  res.render("profile",{user,saved:false});
})

router.post("/register",(req,res)=>{
  let userData = new userModel({
    username:req.body.username,
    email:req.body.email
  });

  userModel.register(userData,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),(req,res)=>{
});

router.get("/login",(req,res)=>{
 res.render("login",{error:req.flash("error")});
});
router.get("/saved",isLoggedIn,async(req,res)=>{
const user = await userModel.findOne({username:req.session.passport.user}).populate("savedpost")
res.render("profile",{user,saved:true});
})

router.get("/logout",(req,res)=>{
  req.logOut(function(err){
    if(err)return next(err);
    res.redirect("/login")
  })
})

router.post("/upload",isLoggedIn,upload.single("file"),async(req,res)=>{
  if(!req.file){
    return res.status(404).send("no file were uploaded");
  }
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  const postdata = await postModel.create({
    image : req.file.filename,
    userId : user._id,
    imageText : req.body.caption
  })
  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile")
})

router.get("/feeds",async(req,res)=>{
  let posts = await postModel.find()
  console.log(posts)
  res.render("feeds" ,{posts});
})

router.post("/profileImage",isLoggedIn,upload.single("profileImage"),async (req,res)=>{
const user = await userModel.findOne({username:req.session.passport.user})

user.profileImg = req.file.filename;
await user.save()
res.redirect("/profile");

})

router.post("/savePost",isLoggedIn,async(req,res,next)=>{
  const user = await userModel.findOne({username:req.session.passport.user})
  // console.log(req.body.postID);
  user.savedpost.push(req.body.postID);
  user.save(); 
  res.redirect("/feeds")
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}



module.exports = router;
