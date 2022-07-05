const {
  getsuccess,
  postsuccess,
  fatalerror,
  registererrhandler,
} = require("./errors");
const User = require("./schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const getrequest = async (req, res) => {
  try {
    res.status(200).json(getsuccess);
  } catch (err) {
    res.status(500).json(fatalerror(err));
  }
};

const postrequest = async (req, res) => {
  try {
    res.status(200).json(postsuccess);
  } catch (err) {
    res.status(500).json(fatalerror(err));
  }
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  console.log("token created");
  return jwt.sign({ id }, process.env.TOKENSECRET, { expiresIn: maxAge });
};

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    user.token = token
    res.status(201).json(user);
  } catch (err) {
    const saveerr = fatalerror(err);

    saveerr.error = registererrhandler(err);
    if (!saveerr.error) {
      res.status(500).json(fatalerror(err));
    } else {
      res.status(400).json(saveerr);
    }
  }
};

const login = async (req, res) => {
try {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json(fatalerror("Could not find user"));
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    const error = "Incorrect password entered";
    return res.status(400).json(fatalerror(error));
  }
  const token = createToken(user._id)
  user.token = token
  return res.json(user)
} catch (error) {
    const err = 'Something went wrong, try again'
    return res.status(500).json(fatalerror(err));
}
};

module.exports = { getrequest, postrequest, register, createToken, login };
