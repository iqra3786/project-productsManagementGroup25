const express = require('express')
const {createUser, userLogin, getUserById,updateUser}= require("../controller/UserController")
const router = express.Router()

router.get('/test', async function(req,res){
    res.send("Test success")
})


router.post("/register",createUser )
router.post("/login",userLogin )
router.get("/user/:userId/profile",getUserById)
router.put('/user/:userId/profile',updateUser)


module.exports = router