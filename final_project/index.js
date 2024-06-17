const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const ApiError = require('./utils/ApiErrors.js');
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(!req.session.authorization)
    {
        throw new ApiError(403,"User Not LogIn");
    }
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(err){
            throw new ApiError(403,"User Not Authenticated");
           
        }
        else{
            req.user = user;
            next();
        }
     });
    
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
