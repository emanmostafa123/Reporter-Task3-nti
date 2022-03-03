const express = require('express')
const Reporter = require('../models/reporter')
const router = new express.Router()
const auth = require('../middelware/auth')
const multer = require('multer')



router.post('/reporters',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        await reporter.save()
        const token = await reporter.generateToken()
        console.log(new Date().toISOString());
        res.status(200).send({reporter,token})

    }
    catch(e){
        res.status(404).send(e)
    }
})


router.post('/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/profile',auth.reporterAuth,async(req,res)=>{
    const reporter = req.reporter
    res.status(200).send(reporter)
})

router.patch('/profile',auth.reporterAuth,async(req,res)=>{
    try{

        const updates = Object.keys(req.body)
        const reporter = await req.reporter
        updates.forEach((el)=>(reporter[el]=req.body[el]))
        await reporter.save()
        if(!reporter){
            return res.status(404).send('Error')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(404).send(e)
    }
})


router.delete('/profile',auth.reporterAuth,async(req,res)=>{
    try{
        const reporter = await Reporter.findByIdAndDelete(req.reporter)
        if(!reporter){
            return res.status(404).send('Error')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(404).send(e)
    }
})



const uploads = multer({
    limits:{
        fileSize:1000000  
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Please upload small image'))
        }
        cb(null,true)
    }
}) 

router.post('/profile/avatar',auth.reporterAuth,uploads.single('avatar'),async(req,res)=>{
try{
    req.reporter.avatar = req.file.buffer
    await req.reporter.save()
    res.send(req.reporter)
}
catch(e){
    res.status(500).send(e)
}
})




router.delete('/logout',auth.reporterAuth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el !== req.reporter.tokens
        })
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.send(e)
    }
})







module.exports = router