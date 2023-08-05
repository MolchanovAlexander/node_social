const router = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

//UPDATE USER  const hashedPassword = 
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }


    } else {
        return res.status(403).json("you can do it only with your account")
    }

})

//DELETE USER
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err);
        }


    } else {
        return res.status(403).json("you can do it only with your account")
    }

})
// GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err);
    }

})

//FOLLOW USER
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id ) {
        
            try {
                const user = await User.findById(req.params.id)
                const currentUser = await User.findById(req.body.userId)
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{followers:req.body.userId}})
                    await currentUser.updateOne({$push:{followings:req.params.id}})
                    res.status(200).json("follow success")
                }else{
                    res.status(403).json("you are already follow this user")
                }
            } catch (err) {
                return res.status(500).json(err);
            }
        
        
    } else {
        return res.status(403).json("you can't follow yourself")
    }

})
// UNFOLLOW USER

module.exports = router