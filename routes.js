const express = require('express')
const {getrequest, postrequest} = require('./functions')
const router = express()

router.route('/').get(getrequest).post(postrequest)




module.exports = router