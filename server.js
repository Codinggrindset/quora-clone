const express = require('express')
const router = require('./routes')
require('dotenv').config()

const app = express()


app.use(express.json())
app.use('', router)


app.listen(process.env.PORT, ()=>console.log('connected to the server'))