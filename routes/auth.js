const router = require("express").Router()
const User = require("../models/user")

//REGISTER
router.post("/register", async (req, res) => {
    const user = await new User({
        username:"guf",
        email:"guf@gufmail.com",
        password:"1111"
    })
   await user.save()
   res.send("<div style=background:lightblue;height:300px;width:340px;>AUTH ok</div>")
})

module.exports = router