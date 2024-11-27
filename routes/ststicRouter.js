const express = require("express")
const URL = require("../models/url")
const router = express.Router()
const User = require("../models/user")

router.get("/",async(req,res)=>{
   const allurls = await URL.find({})
   return res.render('home',{
      urls : allurls,
   })
})

router.get("/signup", async (req, res) => {
   const allUrls = await URL.find({});
   return res.render("signup", {
      urls: allUrls, // make sure to pass 'urls' here if needed
   });
});

router.get("/login",(req,res)=>{
   return res.render("login")
})

module.exports = router;