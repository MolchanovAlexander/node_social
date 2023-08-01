const express= require("express")
const mongoose= require("mongoose")
const dotenv= require("dotenv")
const helmet= require("helmet")
const morgan= require("morgan")
const app = express()

dotenv.config()

mongoose.connect("mongodb+srv://Olexander:<Pasternak16>@secserv.rkiaq87.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true })




app.listen(8800,() => {
    console.log("server runing");
})