// const userModel = require("../models/userModel");
const productModel=require("../models/productModel")
// const mongoose = require("mongoose")
// const { uploadFile } = require("./aws");
// const { valid, isValidName } = require("../validator/validation");



const getProductsByFilter=async function(req,res){
    try{
     const {size,name,priceGreaterThan,priceLessThan,priceSort }=req.query
     let data = {isDeleted:false}
     if(size){
         data['availableSizes']= {$in: size}
     } 
     if(name){
         
         data['title']= name
     }
     if(priceGreaterThan){
         data['price']= {$gt:priceGreaterThan}
     }
     if(priceLessThan){
         data['price']= {$lt:priceLessThan}
     }
     if(priceSort){
         if(!(priceSort==1 || priceSort==-1)){
             return res.status(400).send({status:false,message:"price sort can have only two values 1 or -1"})
         }
     }
     let filteredData=await productModel.find(data).sort({price:priceSort})

     
     if(filteredData.length==0){return res.status(404).send({status:false,message:"data is not present"})}
     res.send(filteredData)
}
    catch(err){
       res.status(500).send({status:false,msg:err.message})
    }
 }

 module.exports= {getProductsByFilter}