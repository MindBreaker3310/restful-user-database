
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//建立一個User Schema(概要, 議程)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('年齡不可以為負數')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('密碼裡面不能有password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


userSchema.methods.createAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisiskey');

    user.tokens = user.tokens.concat({ token });
    await user.save()

    return token
}

//schema.statics 就像一個model的 static function
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

//建立一個資料模型
const User = mongoose.model('User', userSchema)

module.exports = User