const express = require('express');
const Account = require('../model/account.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();


//創建 account
router.post('/accounts/create', auth, async (req, res) => {
    //實現一個Account的資料模型
    const account = new Account({
        ...req.body,
        owner: req.user._id
    });
    try {
        //儲存到database
        await account.save()
        res.status(201).send(account);

    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
})

//回傳自己所有的account
router.get('/accounts/me', auth, async (req, res) => {
    try {
        // 直接從Account collection 找的方法
        // const account = await Account.findOne({ owner: req.user._id })

        // 從User透過外鍵搜尋的方法
        await req.user.populate('accounts').execPopulate()
        res.send(req.user.accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
})

//回傳所有的account
router.get('/accounts/all', async (req, res) => {
    try {
        const accounts = await Account.find({})
        res.send(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
})


//指定戶頭存提款
router.patch('/accounts/deal/:accId', auth, async (req, res) => {
    try {
        const account = await Account.findById(req.params.accId);
        if (req.body.deposit) {
            account.deposit += req.body.deposit;
        }
        if (req.body.withdraw) {
            account.deposit -= req.body.withdraw;
        }
        await account.save();
        res.send(account);
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
})

//刪除account
router.delete('/accounts/:accId', auth, async (req, res) => {
    try {
        const accounts = await Account.findOneAndDelete({ _id: req.params.accId, owner: req.user._id })
        res.send(accounts);
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
})


module.exports = router;

