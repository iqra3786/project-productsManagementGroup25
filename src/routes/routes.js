const express = require('express')
const {createUser, userLogin, getUserById,updateUser,createProduct}= require("../controller/UserController")
const router = express.Router()
const mid = require('../middleware/midware')

router.get('/test', async function(req,res){
    res.send("Test success")
})


router.post("/register",createUser )
router.post("/login",userLogin )
router.get("/user/:userId/profile", mid.authentication, getUserById)
router.put('/user/:userId/profile', mid.authentication, mid.authorization, updateUser)

router.post("/products", createProduct)



module.exports = router