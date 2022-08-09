/* eslint-disable max-len */
const express = require('express');
const {
  getRequest, postRequest, register, login, changePassword, forgotPassword, getProfile, follow, getOnesYouFollow, checkToken, getUrFollowers, postAQuestion, getQuestions,
} = require('./functions');

const router = express();

router.route('/').get(getRequest).post(postRequest);

router.route('/auth/register').post(register);

router.route('/auth/login').post(login);

router.route('/auth/password').post(checkToken, changePassword);

router.route('/auth/password-reset').post(forgotPassword);

router.route('/search/accounts?email=:mail').get(checkToken, getProfile);

router.route('/accounts/follow').post(checkToken, follow);

router.route('/accounts/following').post(checkToken, getOnesYouFollow);

router.route('/accounts/followers').post(checkToken, getUrFollowers);

router.route('/questions').post(checkToken, postAQuestion);

router.route('/questions').get(checkToken, getQuestions);

module.exports = router;
