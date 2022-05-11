const Usermodel = require("../models/userModels");
const Validation = require("../validators/validation");
const jwt = require("jsonwebtoken")

const UserCreate = async function(req, res)
{
    try {
        const requestBody = req.body;
        if (!Validation.isValidRequestBody(requestBody)){
        res.status(400).send({status: false, msg: "user is required, invaild request in body"})
        return
        }
   if(!Validation.isValidField (requestBody.name))
   return res.status(400).send({ status: false, message: 'name is required!' });
 
   
 if(!Validation.isValidTitle(requestBody.title))
 return res.status(400).send({ status: false, message: 'title is required!' });
 
 if(!Validation.isValidField(requestBody.phone))
 return res.status(400).send({ status: false, message: 'Phone no. is required!' });
 
 let existphoneNo = await Usermodel.findOne({phone: requestBody.phone})
 if (existphoneNo)
 return res.status(400).send({status: false, message: 'Phone no. is already exist!'})

 if(!Validation.isValidField(requestBody.password))
 return res.status(400).send({ status: false, message: 'password is required!' });
 
 
 if(!Validation.isValidEmail(requestBody.email))
 return res.status(400).send({ status: false, message: 'email is required!' });

 let existemail= await Usermodel.findOne({email: requestBody.email});
 if (existemail)
 return res.status(400).send({status: false, message: 'email is already exist!'});


 let Userdata = await Usermodel.create(requestBody)
 console.log({status: true, data: Userdata});
 return res.status(201).send({ status: true, message: 'New details created successfully.', data: Userdata });


    }catch(error){

     return   res.status(500).send({ status: false, msg: error.message });

    }
    
}






const LoginCreate = async function (req, res) 
{
    try 
    {
        const requestBody = req.body;
        
        if (!Validation.isValidRequestBody(requestBody)) 
        
            return res.status(400).send({ status: false, message: 'Invalid request body. Please provide login details.' });
        
        if (!Validation.isValidEmail(requestBody.email)) 
        
            return res.status(400).send({ status: false, message: 'E-Mail is required.' });
        
        if (!Validation.isValidField(requestBody.password)) 
        
            return res.status(400).send({ status: false, message: 'Password is required.' });
        
        
        const user = await Usermodel.findOne({ email: requestBody.email, password: requestBody.password });
        if (user==null) 
            
            return res.status(400).send({ status: false, msg: "Invalid login credentials!" });
            
        let payload = { userId : user._id };
        let token = jwt.sign(payload, 'ProjectThird');
        res.header('x-api-key', token);
        res.status(201).send({ status: true, msg: " New Login Successfull !", token: token});
    } 
    catch (error) 
    {
        res.status(500).send({ status: false, error: error.message });
    }
};

module.exports.UserCreate = UserCreate
module.exports.LoginCreate = LoginCreate