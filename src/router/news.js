const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')


router.post('/news',auth.reporterAuth,async(req,res)=>{
    try{
        
        const news = new News({...req.body,author:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})




router.get('/allnews',auth.reporterAuth,auth.requiresAdmin,async(req,res)=>{
    try{
        const news = await News.find({})
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/news',auth.reporterAuth,async(req,res)=>{
    try{
       await req.reporter.populate('news')
       res.send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


module.exports=router