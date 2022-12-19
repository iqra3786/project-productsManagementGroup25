const express = require('express')
const router = express.Router()

router.get('/test', async function(req,res){
    res.send("Test success")
})

router.all('/*', async function(req,res){
    res.send("Provided route url is wrong")
})

module.exports = router