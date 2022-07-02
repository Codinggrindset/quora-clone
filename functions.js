const {getsuccess, postsuccess, fatalerror} = require('./errors')

const getrequest = (req, res) =>{
try {
    res.status(200).json(getsuccess)
} catch (err) {
    res.status(500).json(fatalerror(err))
}
}

const postrequest = (req, res) =>{
try {
    res.status(200).json(postsuccess)
} catch (err) {
    res.status(500).json(fatalerror(err))
}
}

module.exports = {getrequest, postrequest}