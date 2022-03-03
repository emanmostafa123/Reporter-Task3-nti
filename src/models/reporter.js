const mongoose = require('mongoose')
const validate = require('validator')
const bcryptjs = require('bcryptjs')
const { report } = require('process')
const jwt = require('jsonwebtoken')



const reporterSchema = new mongoose.Schema({
    name:{
        type:String ,
        required:true,
        trim:true
    },
    address:{
        type:String ,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true.valueOf,
        lowercase:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if (value<0){
                throw new Error('Age must be positive')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            if(!reg.test(value)){
                throw new Error('Invalid password')
            }
        }
    },
    phonenumber:{
        type:String,
        required:true,
        trim:true,
        length:11,
        validate(value){
            var reg = new RegExp("^(01)[0-2,5]{1}[0-9]{8}$")
            if(!reg.test(value)){
                throw new Error('invalid phone number .. ')
            }
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    roles:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    avatar:{
        type:Buffer
    }

})

reporterSchema.pre('save',async function(){
    // this --> our document
    const reporter = this
    if(reporter.isModified('password')){
        reporter.password = await bcryptjs.hash(reporter.password,8)
    }
})


reporterSchema.virtual('news',{
    ref:'News', 
    localField:'_id',
    foreignField:'author' 
})


reporterSchema.statics.findByCredentials = async(email,password)=>{
    const reporter = await Reporter.findOne({email})
    console.log(reporter)
    if(!reporter){
        throw new Error('unable email or password')
    }
    const isMatch = await bcryptjs.compare(password,reporter.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error('unable pass or email')
    }
    return reporter
}


reporterSchema.methods.generateToken = async function (){
    const reporter = this
    const token =jwt.sign({_id:reporter._id.toString()},process.env.JWT_SECRET)
    reporter.tokens =reporter.tokens.concat(token)
    await reporter.save()
    return token
}


reporterSchema.methods.toJSON = function () {
    const reporter = this
    const reporterObject = reporter.toObject()

    delete reporter.password
    delete reporter.tokens
    return reporterObject
}

const Reporter = mongoose.model('reporter',reporterSchema)
module.exports = Reporter