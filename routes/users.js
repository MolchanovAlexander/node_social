const router=require("express").Router()

router.get("/",(req,res)=>{
    res.send("<div style=background:black;color:white;height:300px;width:340px;>USERROUTES</div>")
})

module.exports =router