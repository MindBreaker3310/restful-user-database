const express = require('express');
const User = require('../model/user.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();


//創建 user
router.post('/users/create', async (req, res) => {
    //實現一個User的資料模型
    const user = new User(req.body);
    try {
        //儲存到database
        await user.save()
        const token = await user.createAuthToken()
        res.status(201).send({ user, token });

    } catch (error) {
        res.status(404).send(error);
    }
})

//回傳User自己的檔案
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: 'cauth error' });
    }
})



//回傳所有 user
router.get('/users/all', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);

    } catch (error) {
        res.status(500).send(error);
    }
})


//刪除 user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error);
    }
})

//修改 user
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: '母湯亂改!' })
    }

    try {
        //直接更新的方法
        //new:true 會回傳更新後的數值而非更新前的值
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });


        //如要更改密碼，需要先hash加密密碼再儲存到database
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//登入
router.post('/users/login', async (req, res) => {
    try {
        //checkUserLogin()自己在user.js創的方法
        const user = await User.checkUserLogin(req.body.email, req.body.password)
        const token = await user.createAuthToken();
        res.send({ user, token })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

//登出
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

//登出全部token
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

module.exports = router;

