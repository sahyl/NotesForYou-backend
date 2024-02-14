const jwt = require("jsonwebtoken");

const jwt_secret = "mohammedsahilkhan@1stnode";
// function to get the id from the ojwt token
const fetchuser =(req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:'Authenticate using valid token'})
    }

    try {
        const data = jwt.verify(token,jwt_secret)
        req.user = data.user
        next()
        
    } catch (error) {
        res.status(401).send({error:"Authenticate using valid token"})
        
    }
}

module.exports = fetchuser