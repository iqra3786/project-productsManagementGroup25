const express = require('express')
const {createUser, userLogin, getUserById,updateUser}= require("../controller/UserController")
const router = express.Router()
const mid = require('../middleware/midware')

router.get('/test', async function(req,res){
    res.send("Test success")
})


router.post("/register",createUser )
router.post("/login",userLogin )
router.get("/user/:userId/profile", mid.authentication, getUserById)
router.put('/user/:userId/profile', mid.authentication, mid.authorization, updateUser)


router.all('/*', function(req, res){
    res.status(400).send({status:false, message:"Provided route url is wrong"})
})

module.exports = router