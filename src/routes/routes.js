const express = require('express')
const {createUser, userLogin, getUserById,updateUser}= require("../controller/userController")
const router = express.Router()
const mid = require('../middleware/midware')
const {getProductsByFilter, createProduct, getProductByID}= require("../controller/productController")

router.get('/test', async function(req,res){
    res.send("Test success")
})


router.post("/register",createUser )
router.post("/login",userLogin )
router.get("/user/:userId/profile", mid.authentication, getUserById)
router.put('/user/:userId/profile', mid.authentication, mid.authorization, updateUser)
//---------------- Products---------------------------------------//

router.post("/products", createProduct)
router.get("/products", getProductsByFilter)
router.get("/products/:productId",getProductByID)




module.exports = router