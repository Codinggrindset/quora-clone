const express = require('express')
const router = require('./routes')
const connectdb = require('./connectdb')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()


app.use(express.json())
app.use('', router)
app.use(cookieParser())

const startserver = async() =>{
try {
    await connectdb(process.env.MONGOURI).then(()=> console.log('connected to the database'))
app.listen(process.env.PORT, ()=>console.log('connected to the server'))    
} catch (error) {
    res.status(500).json(fatalerror(error))
}
}  

startserver()