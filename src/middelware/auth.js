const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporter')
const reporterAuth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const reporter = await Reporter.findOne({_id:decode._id,tokens:token})
        if(!reporter){
            throw new Error()
        }
        req.reporter= reporter
        req.token = token

        next()
    }
    catch(e){
        res.status(500).send({error:'Please Authorization'})
    }


}


const requiresAdmin = async (req,res,next) =>{
    if(req.reporter.roles !== 'admin'){
      return  res.status(401).send({error:'You are not admin'})
    }
    next()
}

module.exports = {
    reporterAuth,requiresAdmin
}