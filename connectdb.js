const mongoose = require('mongoose');

module.exports = (url) => mongoose.connect(url).then(() => console.log('connected to the database'));
