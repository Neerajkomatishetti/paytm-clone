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

// router.post('/transfer', authMiddleware, async (req, res) => {
//     const session = await mongoose.startSession();


//     try{
//         session.startTransaction();
//         const { amount, to } = req.body;

//         const account = await Account.findOne({ userID:req.userID}).session(session);

//         if(!account || account.balance < amount){
//             return res.status(400).json({
//                 message:"insufficent balance"
//             });
//         }

//         const toAccount = await Account.findOne({userID:to}).session(session);
//         const toUserName = await User.findOne({userID:to}).session(session);

//         if(!toAccount){
//             await session.abortTransaction();
//             return res.status(400).json({
//                 message:"Invalid account"
//             });
//         }

//         await Account.updateOne({userID:req.userID}, { $inc:{balance: -amount} }).session(session);
//         await Account.updateOne({userID:to}, { $inc:{balance: amount} }).session(session);


//         await Transactions.create({
//             username:req.username,
//             userID:userID,
//             Amount:amount,
//             paymentmode:"Sent"
//         }).session(session);
//         await Transactions.create({
//             username:toUserName.firstname,
//             userID:to,
//             Amount:amount,
//             paymentmode:"Received"
//         }).session(session);


//         await session.commitTransaction();
//     }catch(e){
//         if(e.codeName === "WriteConflict"){
//             console.log("write conflict! occured")
//             session.abortTransaction();
//         }
//     }finally{
//         session.endSession();
//     }
//     res.status(200).json({
//         message:"Transaction successful"
//     });
// })
router.post('/transfer', authMiddleware, async (req, res) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		let { amount, to } = req.body;
		amount = Number(amount);

		if (!to || !mongoose.Types.ObjectId.isValid(to) || !Number.isFinite(amount) || amount <= 0) {
			await session.abortTransaction();
			return res.status(400).json({ message: "Invalid request" });
		}

		const fromUserId = req.userID;

		const fromAccount = await Account.findOne({ userID: fromUserId }).session(session);
		if (!fromAccount || fromAccount.balance < amount) {
			await session.abortTransaction();
			return res.status(400).json({ message: "insufficent balance" });
		}

		const toAccount = await Account.findOne({ userID: to }).session(session);
		if (!toAccount) {
			await session.abortTransaction();
			return res.status(400).json({ message: "Invalid account" });
		}

		const [fromUser, toUser] = await Promise.all([
			User.findById(fromUserId).session(session),
			User.findById(to).session(session)
		]);

		await Account.updateOne({ userID: fromUserId }, { $inc: { balance: -amount } }).session(session);
		await Account.updateOne({ userID: to }, { $inc: { balance: amount } }).session(session);

		const sentTx = new Transactions({
            username: toUser?.firstname || "User",
            userID: fromUserId,
            Amount: amount,
            paymentmode: "Sent"
        });
        await sentTx.save({ session });
        
        const recvTx = new Transactions({
            username: fromUser?.firstname || "User",
            userID: to,
            Amount: amount,
            paymentmode: "Received"
        });
        await recvTx.save({ session });

		await session.commitTransaction();
		return res.status(200).json({ message: "Transaction successful" });
	} catch (e) {
		try { await session.abortTransaction(); } catch {}
		console.error("Transfer error:", e);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		session.endSession();
	}
});


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
