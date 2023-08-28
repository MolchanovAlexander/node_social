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
// GET A USER  old - router.get("/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         const {password, updatedAt, ...other} = user._doc
//         res.status(200).json(other)
//     } catch (err) {
//         return res.status(500).json(err);
//     }

// })
router.get("/", async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username })

        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err);
    }

})

// get friends
router.get("/friends/:userId", async (req, res) => {
   
    if (req.params.userId == undefined ) {
        console.log(req.params.userId);
        return;
       
    } else {
        console.log(req.params.userId);
         try {
            const user = await User.findById(req.params.userId)
            const friends = await Promise.all(
                user.followings.map(friendId => {
                    return User.findById(friendId)
                })
            )
            let friendList = []
            friends.map(f => {
                const { _id, username, profilePicture } = f;
                friendList.push({ _id, username, profilePicture })
            })
            res.status(200).json(friendList)
        } catch (err) {
            console.log(err);
        }
    }


})

//FOLLOW USER
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {

        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json("follow success")
            } else {
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

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {

        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("unfollow success")
            } else {
                res.status(403).json("you are already unfollow this user")
            }
        } catch (err) {
            return res.status(500).json(err);
        }


    } else {
        return res.status(403).json("you can't unfollow yourself")
    }

})
module.exports = router