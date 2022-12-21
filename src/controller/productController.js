const productModel=require("../models/productModel")
const {isValidObjectId} = require("mongoose")
const { uploadFile } = require("./aws");
const {isValidString, isValidPrice, isValidStyle, isValidInstallment} = require("../validator/validation");

const createProduct = async function(req,res){
    try{
      let data = req.body
      let files = req.files 
      let {title,description,price,currencyId,currencyFormat,productImage,availableSizes} = data
    
      /*------------------------- Checking fields are present or not -----------------------------------*/
      if(!title)return res.status(400).send({status:false, message:"title is required"})
      if(!description)return res.status(400).send({status:false, message:"description is required"})
      if(!price)return res.status(400).send({status:false, message:"price is required"})
      if(!currencyId)return res.status(400).send({status:false, message:"currencyId is required"})
      if(!currencyFormat)return res.status(400).send({status:false, message:"currencyFormat is required"})
  
      /*------------------------- Checking fields values are empty or not -----------------------------------*/
      if(!(isValidString(title)))return res.status(400).send({status:false, message:"title is empty"})
      if(!(isValidString(description)))return res.status(400).send({status:false, message:"description is empty"})
      if(!(isValidString(currencyId)))return res.status(400).send({status:false, message:"currencyId is empty"})
      if(!(isValidString(currencyFormat)))return res.status(400).send({status:false, message:"currencyFormat is empty"})

      /*---------------------performing validation & checking valid available size value--------------------*/
      let arr = availableSizes.split(',')
      let wants = ["S", "XS","M","X", "L","XXL", "XL"]
      let r = []
      for(let i of arr){
        if(wants.includes(i)){
          r.push(i)
        }
      }
      data.availableSizes = r
      if(r.length==0)return res.status(400).send({status:false, message:"please provide valid size ex: S, XS,M,X, L,XXL, XL"}) 

      /*-------------------------checking regex validation ---------------------------*/
      if(!(isValidPrice(price)))return res.status(400).send({status:false, message:"Invalid price value"})
      
      if(data.style){
        if(!(isValidStyle(data.style)))return res.status(400).send({status:false, message:"Please provide valid style"})
      }
      
      if(data.installments){
        if(!(isValidInstallment(data.installments)))return res.status(400).send({status:false, message:"Please provide valid installment between one and two numbers"})
      }

      /*-------------------------some more validation---------------------------*/
      if(currencyId!='INR')return res.status(400).send({status:false, message:`please provide valid currencyId ex: 'INR'`})
      if(currencyFormat!='₹')return res.status(400).send({status:false, message:`please provide valid currencyFormat ex: '₹'`})

      /*------------------------- Checking title is unique or not -----------------------------------*/
      let duplicateTitle = await productModel.findOne({title:title})
      if(duplicateTitle)return res.status(400).send({status:false, message:"title is already registered"})
  
      /*------------------------validation, adding & uploading productImage------------------------------*/
      if (files && files.length > 0) {
        let uploadedFileURL = await uploadFile(files[0]);
        data.productImage = uploadedFileURL
      }else{
        return res.status(400).send({status:false, message:"productImage is required"})
      } 
  
      /*------------------------creating product data------------------------------*/
      const createData = await productModel.create(data) 
      return res.status(201).send({status:true, message:"Success", data:createData})
    }
    catch(err){
      return res.status(500).send({ status: false, message: err.message })
    }
  }
  

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


const getProductByID = async function (req, res) {
    try {
      const productId = req.params.productId;
      if (!isValidObjectId(productId))
        return res.status(400).send({ status: false, message: "Invalid Product Id" });
  
      const checkProduct = await productModel.findOne({ _id: productId, isDeleted: false, });
  
      if (!checkProduct)
        return res.status(400).send({ status: false, message: "Product does not exist" });
  
      return res.status(200).send({ status: true, message: "Success", data: checkProduct});
  
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
 module.exports= {getProductsByFilter, createProduct, getProductByID}