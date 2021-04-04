# restful-user-database
 
 
## 🌳環境
- **Node.js**：跨平台運行JavaScript執行環境
- **MongoDB**：非關聯式的文件導向資料庫管理系統
- **Visual Studio Code**：原始碼編輯器
- **Robo 3T**：MongoDB GUI
- **Postman**：HTTP Request工具
 
## 🚩模組 
- **express**：Node.js的web應用框架
- **mongoose**：操作mongoDB API
- **validator**：方便驗證字串是否符合形式
- **bcrypt**：使用各種算法加密字串

## 📃筆記
1. 建構express
 ```js
 //在index.js下
 
 const mongoose = require('mongoose');
 const userRouter = require('./routers/userRouter.js')

 //確保database有在運行(2.連結至資料庫)
 require('./db/mongoose.js');

 const app = express();
 const port = process.env.PORT || 3000;

 // It parses incoming requests with JSON payloads and is based on body-parser.
 app.use(express.json());

 //使用路由
 app.use(userRouter);

 app.listen(port, ()=>{
     console.log('server is up on port 3000');
 })
 ```
2. 連結至資料庫
 ```js
 //在mongoose.js下

 const express = require('express');

 //連結至mongoDB address/資料庫
 //user-manager為資料庫的名稱
 mongoose.connect('mongodb://127.0.0.1:27017/user-manager', {
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true
 })
 ```
3. 建構資料模型
 ```js
 //在user.js下

 const mongoose = require('mongoose');
 const validator = require('validator');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken')

 //建立一個User Schema(概要, 議程)
 const userSchema = new mongoose.Schema({
     email: {
         type: String,  //資料型別
         unique: true,  //唯一性
         required: true,  //是否為必須
         trim: true,  //修剪多餘空格
         lowercase: true,  //轉換成小寫
         validate(value) {  //驗證輸入
             //用validator library 的isEmail來驗證value是否為email格式
             if (!validator.isEmail(value)) {
                 throw new Error('Email is invalid')
             }
         }
     },
     password: {
         type: String,
         required: true,
         trim: true,
         minLength: 6,  //最小長度
         validate(value) {
             if (value.toLowerCase().includes('password')) {
                 throw new Error('密碼裡面不能有password')
             }
         }
     }
 })

 //建立一個資料模型
 const User = mongoose.model('User', userSchema)

 module.exports = User
 ```
4.建構路由
 ```js
 //在userRouter.js下
 
const express = require('express');
//資料模型(3. 建構資料模型)
const User = require('../model/user.js');

//實現一個express路由
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

module.exports = router;

 ```
 
5.新增路由
 ```js
 //在userRouter.js下

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
         
         //save前會執行(6.對資料模型增加功能)的userSchema.pre
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
 ```
6.對資料模型增加middleware
 ```js
 //在save()前執行
 userSchema.pre('save', async function (next) {

     const user = this;

     //isModified('key值') 檢查特定KEY值是否有被更改
     if (user.isModified('password')) {
         console.log('執行hash加密');
         //若password有被更改，把password加密，用hash方法跑8次
         user.password = await bcrypt.hash(user.password, 8);
     }
     next()
 })
 ```
7.對資料模型增加static function
 ```js
 //在User.js下
 
 //schema.statics 就是一個資料模型的 static functione
 //checkUserLogin(自定義) 用於驗證登入帳密是否正確，並回傳用戶訊息。
 userSchema.statics.checkUserLogin = async function (email, password) {
     const user = await this.findOne({ email })
     if (!user) {
         throw new Error('找不到EMAIL，無法登入')
     }
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
         throw new Error('密碼錯誤，無法登入')
     }
     return user
 }
 ```
8.對資料模型增加methods
 ```js
 //在User.js下
 
 userSchema.methods.createAuthToken = async function () {
     const user = this;
     const token = jwt.sign({ _id: user._id.toString() }, 'thisiskey');
     //token如下被分為三段並用base64編碼加密過 私鑰為'thisiskey'
     //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MTc0MzA1NjF9.QWgVHwyr2vBqXtAfpylDRb-3JS2TtR86svOhO3yQMak
     //第一段.第二段.第三段
     //第一段 就是header  >> {"alg":"HS256","typ":"JWT"}  alg演算法, typ格式
     //第二段 我們傳的payload  >>  {"_id":"abc123","iat":1617428166} _id我們給的, iat(Issued at)創建的時間戳
     //第三段 Signature
     
     user.tokens = user.tokens.concat({ token });
     await user.save()

     return token
 }
 ```
 
9.增加express middleware (request -> middleware -> route handler)
```js

//驗證用戶是否登入
const auth = async (req, res, next)=>{
    try {
        //用戶登入會傳一個token在header裡 >> { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....." }
        const token = req.header('Authorization').replace('Bearer ', '')
        //用公鑰'thisiskey'驗證token是否為真
        const decoded = jwt.verify(token, 'thisiskey')
        //並確認是否有登入token
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
    
        if(!user){
            throw new Error('User沒有登入')
        }
        
        //如果有，可以直接傳給router那邊，不用再次尋找該user
        req.user = user;
        req.token = token;
        next()
    
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
}

//查看User自己的檔案
//(request -> middleware -> route handler)
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: 'cauth error' });
    }
})
 ```

10.隱藏私有資料
```js
//在user.js下

//傳送密碼外的資料
//toJSON的方法在JSON.stringify()裡都會呼叫
//當router send()回客戶端時也會用JSON.stringify()，也就都會使用到toJSON了
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}
```

11.創建 account
 ```js
//在accountRouter.js下

//創建 account
router.post('/accounts/create', auth, async (req, res) => {
    //實現一個Account的資料模型
    const account = new Account({
        ...req.body, //其他來自body的參數 { "deposit" : 0, "loan" : 0, "description" : "my bank account :))" }
        owner: req.user._id  //來自User的user._id
    });
    try {
        await account.save()
        res.status(201).send(account);
    } catch (error) {
        res.status(404).send(error);
    }
})
 ```

12.透過onwer對 user collection搜尋
 ```js

//在account.js下

const Account = mongoose.model('Account', {
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

//練習account -> user
const Account = require('./model/account.js')
const myFunction = async ()=>{
    //用account collection的_id去搜尋
    const account = await Account.findById('60694dce4523e4590c6f92be')
    
    //populate('owner')可以用owner作為外鍵搜尋，並暫時儲存到owner欄位裡(還沒save()到database)
    await account.populate('owner').execPopulate()//加上.execPopulate()則是回傳Promise，不加是callback
    
    //此時account有 _id === owner的User資料
    console.log(account);
}
myFunction()

 ```


13.透過user._id對 account collection搜尋
 ```js
//在user.js下

//建立一個虛擬欄位accounts ，並不會真的儲存到user collection，而是參照到其他collection
userSchema.virtual('accounts', {
    ref: 'Account',
    localField: '_id',
    foreignField: 'owner'
})

 //在account.js下
 
 //回傳自己所有的account
 router.get('/accounts/me', auth, async (req, res) => {
     try {
         // 直接從Account collection 找的方法
         // const account = await Account.findOne({ owner: req.user._id })

         //populate('accounts')用建立的虛擬欄位'accounts'作為外鍵搜尋，並暫時儲存到accounts欄位裡(還沒save()到database)
         await req.user.populate('accounts').execPopulate()  //加上.execPopulate()則是回傳Promise，不加是callback
         res.send(req.user.accounts);  //此時user.accounts有所有account.owner === user._id 的Account
     } catch (error) {
         console.log(error);
         res.status(500).send('error');
     }
 })
 ```
