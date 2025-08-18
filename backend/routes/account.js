const express = require('express');
const mongoose = require('mongoose');
const zod = require('zod');
const { Account } = require('../db');
const router = express.Router();
const { authMiddleware } = require('../middleware');

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

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userID:req.userID}).session(session);

    if(!account || account.balance < amount){
        return res.status(400).json({
            message:"insufficent balance"
        });
    }

    const toAccount = await Account.findOne({userID:to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        });
    }

    await Account.updateOne({userID:req.userID}, { $inc:{balance: -amount} }).session(session);
    await Account.updateOne({userID:to}, { $inc:{balance: amount} }).session(session);

    await session.commitTransaction();
    res.status(200).json({
        message:"Transaction successful"
    });
})


module.exports = router;
