const express= require("express")
const mongoose= require("mongoose")
const dotenv= require("dotenv")
const helmet= require("helmet")
const morgan= require("morgan")
const app = express()
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

dotenv.config()

//process.env.MONGO_URL
mongoose.connect(process.env.MONGO_URL,
{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected')).catch((err) => console.log(err))

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
// app.get("/", (req,res)=>{
//     res.send("<div style=background:green;color:white;height:300px;width:340px;>welcome to homepage</div>")
// })
// app.get("/users", (req,res)=>{
//     res.send("<div style=background:red;height:300px;width:340px>welcome to user page</div>")
// })


app.listen(8800,() => {
    console.log("server runing");
})