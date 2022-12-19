const userModel=require("../models/userModel")

const userLogin = async function (req, res) {
    try {
      let data = req.body;
      let { email, password } = data;
  
      if (Object.keys(data).length == 0)
        return res.status(400).send({ status: false, message: "Please Enter data" });
  
      if (!email)
        return res.status(400).send({ status: false, message: "Please enter email" })
  
      if (!password)
        return res.status(400).send({ status: false, message: "Please enter password" });
  
      const Login = await userModel.findOne({ email });
      if (!Login)
        return res.status(404).send({ status: false, message: "Email Id does Not exist"});
 
      return res.status(200).send({status: true,message: "User login successfull"});

    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };

  module.exports.userLogin=userLogin