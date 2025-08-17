const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);


const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        minlength: 3,
        maxlength: 30,
        trim: true,
        required: true,
        lowercase: true
    },
    password:{
        type:String,
        minlength: 6,
        required: true,
    },
    firstname:{
        type:String,
        maxlength:50,
        trim:true,
        required:true,
    },
    lastname:{
        type:String,
        maxlength:50,
        trim:true,
        required:true,
    }
})

const User = mongoose.model('User', userSchema);


module.exports = {
    User
}