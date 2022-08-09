const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const acc = new Schema({
  data: {
    Profile: {
      id: {},
      Lastname: {},
      Firstname: {},
    },
  },

  Questions: [{
    title: {},
    description: {},
  }],

  Followers: [],

  Following: [Object],

  Firstname: {},

  Lastname: {},

  email: {},

  password: {},

  token: {},
});

// eslint-disable-next-line func-names
acc.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.data.Profile.Lastname = this.Lastname;
  this.data.Profile.Firstname = this.Lastname;
  // eslint-disable-next-line no-underscore-dangle
  this.data.Profile.id = this._id;
  next();
});

const User = mongoose.model('Module', acc);
module.exports = { User, acc };
