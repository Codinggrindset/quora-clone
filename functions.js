/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const { setEx } = require('./redis');
const { User } = require('./schema');
const {
  getSuccess,
  postSuccess,
  onesYouFollow,
  yourFollowers,
  getQuestionRes,
} = require('./subFunctions');
const asyncWrapper = require('./asyncWrapper');
const { createCustomError } = require('./errClass');

const getRequest = asyncWrapper(async (req, res) => {
  res.status(200).json(getSuccess);
});

const postRequest = asyncWrapper(async (req, res) => {
  res.status(201).json(postSuccess('post request successful'));
});

const register = asyncWrapper(async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string()
      .min(8)
      .required()
      .regex(/^[a-zA-Z0-9]*$/),
    firstname: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9]*$/),
    lastname: Joi.string()
      .required()
      .regex(/^[a-zA-Z0-9]*$/),
  });

  const validateRequest = schema.validate(req.body);

  if (validateRequest.error) {
    createCustomError(validateRequest.error.message, 400);
  }
  const { email } = req.body;
  const checkIfExists = await User.findOne({ email });

  if (checkIfExists) {
    createCustomError('User already exists', 400);
  }

  const user = await User.create(req.body);

  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    console.log('token created');
    return jwt.sign({ id }, process.env.TOKENSECRET, { expiresIn: maxAge });
  };
  const token = createToken(user._id);

  user.token = token;

  res.status(201).json(user);
});

const login = asyncWrapper(async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  });

  const validateRequest = schema.validate(req.body);

  if (validateRequest.error) {
    createCustomError(validateRequest.error.message, 400);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    createCustomError('Could not find user', 400);
  }

  const check = await bcrypt.compare(password, user.password);

  if (!check) {
    createCustomError('Incorrect password entered', 400);
  }
  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    console.log('token created');
    return jwt.sign({ id }, process.env.TOKENSECRET, { expiresIn: maxAge });
  };
  const token = createToken(user._id);

  user.token = token;

  return res.json(user);
});

const checkToken = asyncWrapper((req, res, next) => {
  if (!req.headers.authorization) {
    createCustomError(
      'Invalid or no authorization token provided',
      401,
    );
  }

  const [, token] = req.headers.authorization.split(' ');

  console.log(token);

  if (!token) {
    createCustomError(
      'Invalid or no authorization token provided',
      401,
    );
  }

  jwt.verify(token, process.env.TOKENSECRET, async (err, decodedToken) => {
    if (err) {
      createCustomError(
        'Invalid or no authorization token provided',
        401,
      );
    }

    const thisuser = await User.findById(decodedToken.id);

    res.locals.thisuser = thisuser;

    console.log('token verified');

    next();
  });
});

const changePassword = asyncWrapper(async (req, res) => {
  const { password } = req.body;

  const schema = Joi.string().min(8).required();

  const validateRequest = schema.validate(password);

  if (validateRequest.error) {
    createCustomError(validateRequest.error.message, 400);
  }

  const salt = await bcrypt.genSalt();

  const newpassword = await bcrypt.hash(password, salt);

  await User.findByIdAndUpdate(res.locals.thisuser._id, { password: newpassword }, { new: true });

  res.status(201).json(postSuccess('Password updated'));
});

// eslint-disable-next-line consistent-return
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const schema = Joi.string().required().email({ minDomainSegments: 2 });

  const validateRequest = schema.validate(email);

  if (validateRequest.error) {
    createCustomError(validateRequest.error.message, 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(201).json(postSuccess('Check your email inbox for a 5-digit code to complete the password reset process'));
  }

  const randno = Math.floor(Math.random() * 100000);

  await setEx(`password-reset-token-${user._id}`, randno, 600).then(() => console.log('saved to redis'));

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.REACT_APP_EMAIL,
      serviceClient: process.env.SERVICE_CLIENT,
      privateKey: process.env.PRIVATE_KEY,
      // accessToken: process.env.ACCESS_TOKEN,
      // expires: process.env.EXPIRES
    },
  });

  console.log(process.env.REACT_APP_EMAIL);

  console.log(process.env.REACT_APP_EMAIL_PASS);

  const mailOptions = {
    from: 'opesanyahayy@gmail.com',
    to: 'opesanyahayy7@gmail.com',
    subject: `Here is your 5 digit code to change your account- ${randno}`,
    html: 'The body of the email goes here in HTML',
    attachments: [{}],
  };

  // eslint-disable-next-line no-unused-vars
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('mail sent');
    }
  });

  res.status(201).json(postSuccess('Check your email inbox for a 5-digit code to complete the password reset process'));
});

const getProfile = asyncWrapper(async (req, res) => {
  const { mail } = req.params;

  const schema = Joi.string().required().email({ minDomainSegments: 2 });

  const validateRequest = schema.validate(mail);

  if (validateRequest.error) {
    createCustomError(validateRequest.error.message, 400);
  }

  const user = await User.findOne({ email: mail });

  if (!user) {
    createCustomError('This user does not exist', 400);
  }

  res.status(200).json(user.data.Profile);
});

const follow = asyncWrapper(async (req, res) => {
  const { id } = req.body;

  const schema = Joi.string();

  const validateRequest = schema.validate(id);

  if (validateRequest.error) {
    createCustomError(validateRequest.error, 400);
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    createCustomError('There is no user with this id', 400);
  }

  await User.findByIdAndUpdate(id, { $push: { Followers: res.locals.thisuser.data.Profile } });

  await User.findByIdAndUpdate(res.locals.thisuser._id, { $push: { Following: user.data.Profile } });

  res.status(201).json(postSuccess('Follow request successful'));
});

const getOnesYouFollow = asyncWrapper(async (req, res) => {
  res.status(201).json(onesYouFollow(res.locals.thisuser.Following));
});

const getUrFollowers = asyncWrapper(async (req, res) => {
  res.status(201).json(yourFollowers(res.locals.thisuser.Followers));
});

const postAQuestion = asyncWrapper(async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  });

  const validateRequest = schema.validate(req.body);

  if (validateRequest.error) {
    createCustomError(validateRequest.error, 400);
  }

  const { title, description } = req.body;

  await User.findByIdAndUpdate(res.locals.thisuser._id, {
    $push: { Questions: { title, description } },
  });

  res.status(201).json(postSuccess('Question posted successfully'));
});

const getQuestions = asyncWrapper(async (req, res) => {
  res.status(200).json(getQuestionRes(res.locals.thisuser._id, res.locals.thisuser.Questions));
});

module.exports = {
  getRequest, postRequest, register, login, checkToken, changePassword, forgotPassword, getProfile, follow, getOnesYouFollow, getUrFollowers, postAQuestion, getQuestions,
};
