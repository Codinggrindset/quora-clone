const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const acc = new Schema({
    Firstname: {
        type: String,
        required: [true, 'please input firstname']
    },

    Lastname: {
        type: String,
        required: [true, 'please input lastname']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'please input email'],
        validate: [isEmail, 'please enter a valid email address']
    },

    password: {
        type: String,
        minlength: [8, 'password must be at least 8 characters']
    },

    token: {
        type: String,
        required: false
    }
})

acc.pre('save', async function(next){
const salt = await bcrypt.genSalt()
this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('Module', acc)