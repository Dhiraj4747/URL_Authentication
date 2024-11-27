const express = require("express")
const {connectToMongoDb} = require("./connection")
const URL = require("./models/url")
const path = require("path")
const urlRouter = require("./routes/url")
const staticRoute = require("./routes/ststicRouter")
const cookieParser = require("cookie-parser")

//User model (Authentication) task import file
const User = require("./models/user")
const userRoute = require("./routes/user")
const {redirectToLoginUserOnly,checkAuth} = require("./middleware/auth")


connectToMongoDb("mongodb://localhost:27017/short-url")
.then(()=>{
   console.log("mongodb connected suucessfully")
})
.catch((err)=>{
   console.log("mongodb is not connected",err)
})

const app = express()
const port = 8000

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser()) //middleware

app.use("/url",redirectToLoginUserOnly,urlRouter)
app.use("/",checkAuth,staticRoute)
app.use("/user",userRoute)



app.get("/",async(req,res)=>{
   if(!req.user) return res.redirect("/login");
   const allurls = await URL.find({createdBy:req.user._id})
   return res.render('home',{
      urls : allurls,
   })
})

app.get("/url/:shortId",async(req,res)=>{
   const shortId = req.params.shortId;
   const entry = await URL.findOneAndUpdate({
      shortId,
   },{
      $push:{
         visiHistory: {
            timestamp:Date.now()
         }
      }
   })
   res.redirect(entry.redirectURL)
})






app.listen(port,()=>{
   console.log(`server is listening on this port ${port}`)
})