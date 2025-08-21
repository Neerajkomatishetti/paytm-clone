const express = require('express');
const mongoose = require('mongoose');
const zod = require('zod');
const { Account } = require('../db');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Transactions } = require('../db');
const { User } = require('../db');

// router.get('/balance', authMiddleware, async (req, res) =>{
//     console.log(req.userID);
//     const account = await Account.findOne({
//         userID: req.userID
//     });
//     console.log(account);

//     res.status(200).json({
//         balance:account.balance
//     });
// })


router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userID: req.userID });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        return res.status(200).json({ balance: account.balance });
    } catch (err) {
        console.error("Error fetching account:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();


    try{
        session.startTransaction();
        const { amount, to } = req.body;

        const account = await Account.findOne({ userID:req.userID}).session(session);

        if(!account || account.balance < amount){
            return res.status(400).json({
                message:"insufficent balance"
            });
        }

        const toAccount = await Account.findOne({userID:to}).session(session);
        const toUserName = await User.findOne({userID:to}).session(session);

        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Invalid account"
            });
        }

        await Account.updateOne({userID:req.userID}, { $inc:{balance: -amount} }).session(session);
        await Account.updateOne({userID:to}, { $inc:{balance: amount} }).session(session);


        await Transactions.create({
            username:req.username,
            userID:userID,
            Amount:amount,
            paymentmode:"Sent"
        }).session(session);
        await Transactions.create({
            username:toUserName.firstname,
            userID:to,
            Amount:amount,
            paymentmode:"Received"
        }).session(session);


        await session.commitTransaction();
    }catch(e){
        if(e.codeName === "WriteConflict"){
            console.log("write conflict! occured")
            session.abortTransaction();
        }
    }finally{
        session.endSession();
    }
    res.status(200).json({
        message:"Transaction successful"
    });
})


router.get('/history', authMiddleware, async (req, res) =>{
    const userID = req.userID;
    const transactions = await Transactions.find({
        userID:userID
    });

    res.status(200).json({
        transactions:transactions.map(transaction =>({
            username:transaction.username,
            Amount:transaction.Amount,
            paymentmode:transaction.paymentmode

        })),
        message:"Success"
    })

})


module.exports = router;
