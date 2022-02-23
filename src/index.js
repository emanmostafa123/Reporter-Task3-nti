const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT 

const reporterRouter = require('./router/reporter')
const newsRouter = require('./router/news')

require('./db/mongoose')   

app.use(express.json())
app.use(newsRouter)
app.use(reporterRouter)



app.listen(port,()=>{
    console.log("It's Running")
})