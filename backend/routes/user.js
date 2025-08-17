const express = require('express');
const zod = require('zod');
const { User } = require('../db');
const router = express.Router();
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

const signupBody = zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()

})

router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    const data = req.body;

    if(!success){
        return res.status(411).json({
            message:"Email already Taken/Invalid tokens"
        })
    }

    const existingUser = await User.findOne({
        username: data.username
    });

    if(existingUser){
        return res.status(411).json({
            message:"User already exists"
        })
    }

    const user = await User.create({
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname
    });

    const userID = user._id;
    console.log("jwtsecret", JWT_SECRET);

    const token = jwt.sign({ userID }, JWT_SECRET);

    res.status(200).json({
        message:"signup successful",
        token:token
    });
})

router.post('/signin', async (req, res) => {
    const signinBody = zod.object({
        username:zod.string().email(),
        password:zod.string()
    })

    const data = req.body;
    const { success } = signinBody.safeParse(data);
    
    if(!success){
       return res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username:data.username,
        password:data.password
    });

    const userID = user._id;

    if(user){
        const jwt_token = jwt.sign({ userID }, JWT_SECRET)
        
        return res.status(200).json({
            message: "signin successful",
            token:jwt_token
      })
    }
    res.status(411).json({
        message:"user doesnot exist!"
    })

})

module.exports = router;