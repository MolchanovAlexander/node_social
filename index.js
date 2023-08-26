const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const app = express()
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const multer = require("multer")

dotenv.config()

//process.env.MONGO_URL
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected')).catch((err) => console.log(err))

//middleware req.body.name
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/MolchanovCode/node_social/public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    
    try {
        return res.status(200).json("File uploaded")
    } catch (err) {
        console.log(err);
    }})

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)


app.listen(8800, () => {
    console.log("server runing");
})