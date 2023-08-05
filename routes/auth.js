const router = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

//REGISTER
router.post("/register", async (req, res) => {

    try {
        // generate new password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //save user and return response
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.send(500).json(err);
    }
    //    
    //    res.send("<div style=background:lightblue;height:300px;width:340px;>AUTH ok</div>")
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password )
        !validPassword && res.status(400).json("Password not valid ")

        res.status(200).json(user)
    } catch (err) {
       res.send(500).json(err);
    }

})

module.exports = router