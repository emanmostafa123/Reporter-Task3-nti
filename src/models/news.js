const mongoose = require('mongoose')

const News = mongoose.model('News',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporter'
    }

    
})
module.exports = News