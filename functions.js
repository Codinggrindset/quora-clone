const {getsuccess, postsuccess, fatalerror, registererrhandler} = require('./errors')
const User = require('./schema')
const jwt = require('jsonwebtoken')


const getrequest = async (req, res) =>{
try {
    res.status(200).json(getsuccess)
} catch (err) {
    res.status(500).json(fatalerror(err))
}
}

const postrequest = async (req, res) =>{
try {
    res.status(200).json(postsuccess)
} catch (err) {
    res.status(500).json(fatalerror(err))
}
}


const maxAge = 3 * 24 * 60 * 60
const createToken = (id)  => {
    return jwt.sign({id}, 'longsecret', {expiresIn: maxAge})
}


const register = async (req, res) =>{
try {
   const user = await User.create(req.body)
   const token =createToken(user._id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
   res.status(201).json(user)
} catch (err) {
    const saveerr = fatalerror(err)
    
    saveerr.error = registererrhandler(err)
if(!saveerr.error){
    res.status(500).json(fatalerror(err))
}
else {
    res.status(400).json(saveerr)
}
}
}

module.exports = {getrequest, postrequest, register, createToken}