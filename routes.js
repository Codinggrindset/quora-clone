const express = require('express')
const {getrequest, postrequest, register} = require('./functions')
const router = express()

router.route('/').get(getrequest).post(postrequest)
router.route('/auth/register').post(register)



module.exports = router