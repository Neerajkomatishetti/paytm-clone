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

const accountSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account = mongoose.model('Account', accountSchema);

const transactionSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username:{
        type:String,
        ref:'User',
        required:true,
        trim:true
    },
    Amount:{
        type:Number,
        required:true
    },
    paymentmode:{
        type:String,
        required:true,
        trim:true
    }
})

const Transactions = mongoose.model('transactions', transactionSchema);

module.exports = {
    User,
    Account,
    Transactions
}