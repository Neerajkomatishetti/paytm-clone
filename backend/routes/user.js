const express = require("express");
const zod = require('zod');
const { User } = require('../db')
const router = express.Router();
const JWT_SECRET = require('../config');

const signupBody = zod.object({
    username:zod.String().email(),
    password:zod.String(),
    firstname:zod.String(),
    lastname:zod.String()

})

router.post('/signup', (req, res) => {
    const success = signupBody.safeParse(req.body);
    const data = req.body;

    if(!success){
        res.status(411).json({
            message:"Email already Taken/Invalid tokens"
        })
    }

    const existingUser = User.findOne({
        username: data.username
    });

    if(existingUser){
        res.status(411).json({
            message:"User already exists"
        })
    }

    const user = User.Create({
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname
    });

    const userID = user._id;

    const token = jwt.sign({ userID }, JWT_SECRET);

    res.status(200).json({
        message:"signup successful",
        token:token
    });
})

router.post('/signin', (req, res) => {
    const signinBody = zod.object({
        username:zod.String().email(),
        password:zod.String()
    })

    const data = req.body;
    const success = signinBody.safeParse(data);
    
    if(!success){
        res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    const user = User.findOne({
        username:data.username,
        password:data.password
    });

    const userID = user._id;

    if(user){
        const jwt_token = jwt.sign({ userID }, JWT_SECRET)
        
        res.status(200).json({
            message: "signin successful",
            token:jwt_token
      })
    }else{
        res.status(411).json({
            message:"user doesnot exist!"
        })
    }

})

module.exports = router;