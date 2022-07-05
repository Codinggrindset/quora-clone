const express = require('express')
const {getrequest, postrequest, register, login} = require('./functions')
const router = express()

router.route('/').get(getrequest).post(postrequest)
router.route('/auth/register').post(register)
router.route('/auth/login').post(login)



module.exports = router