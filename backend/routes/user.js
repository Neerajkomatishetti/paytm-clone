const express = require('express');
const zod = require('zod');
const { User } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware')
const bcrypt = require('bcrypt');
const { Account } = require('../db');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

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

    const saltRounds = 10;

    const hash = bcrypt.hashSync(data.password, saltRounds);

    const user = await User.create({
        username: data.username,
        password: hash,
        firstname: data.firstname,
        lastname: data.lastname
    });

    const userID = user._id;

    await Account.create({
        userID:userID,
        balance:10000
    });

    const token = jwt.sign({ userID }, JWT_SECRET);

    res.status(200).json({
        message:"signup successful",
        token:token
    });
})

const signinBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post('/signin', async (req, res) => {

    const data = req.body;
    const { success } = signinBody.safeParse(data);
    
    if(!success){
       return res.status(401).json({
            message:"Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username:data.username,
    });

    if(user){
        const isMatched = await bcrypt.compare(data.password, user.password);

        if(isMatched){
                const userID = user._id;
                const jwt_token = jwt.sign({ userID }, JWT_SECRET)
                
                return res.status(200).json({
                    message: "signin successful",
                    token:jwt_token
            })
                
        }
    }

    res.status(401).json({
        message:"wrong password or username"
    })

})

const updateBody = zod.object({
    password:zod.string(),
    firstname: zod.string(),
    lastname:zod.string()
})


router.put('/', authMiddleware, async (req, res) =>{

    const data = req.body;
    const { success } = updateBody.safeParse(data);

    if(!success) {
        return res.status(411).json({
            message:"invalid inputs"
        })
    }
    
    await User.updateOne({_id:data.userID}, data)

    res.status(200).json({
        message:"User Updated Successfully!"
    })

})

router.get('/bulk', async (req, res) => {
    console.log("hi there fromm /bulk");
    const filter = req.query.filter || "";

    const users = await User.find({
        "$or":[{
                firstname:{
                    "$regex": filter, "$options": "i"
            }
        },
            {
                lastname:{
                    "$regex": filter, "$options": "i"

                }
            }]
    })

    console.log("hit there 2");

    res.status(200).json({
        users: users.map(user =>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id

        })),
        message:"success"
    })

})

module.exports = router;