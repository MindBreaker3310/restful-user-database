const express = require('express');
const User = require('../model/user.js');

const router = new express.Router();


//創建 user
router.post('/users', async (req, res) => {
    try {
        //實現一個User的資料模型
        const user = new User(req.body);
        //儲存到database
        await user.save()
        res.status(201).send(user);

    } catch (error) {
        res.status(404).send(erroe);
    }
})

//回傳所有 user
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})

//刪除 user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error);
    }
})

//修改 user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //直接更新的方法
        //new:true 會回傳更新後的數值而非更新前的值
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });


        //如要更改密碼，需要先hash加密密碼再儲存到database
        const user = await User.findById(req.params.id);

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})


router.post('/users/login', async (req, res)=>{
    try {
        //checkUserLogin()自己在user.js創的方法
        const user = await User.checkUserLogin(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router;



