const errorJson = (error) => ({
  success: false,
  error,
});

const getSuccess = {
  success: true,
  message: 'Get request successful',
  data: {
    firstName: '',
    lastName: '',
  },
};

const getQuestionRes = (eyedee, objxts) => ({
  success: true,
  message: 'Successfully retrieved questions',
  data: { questions: objxts },
});

const postSuccess = (message) => ({
  success: true,
  message,
});

const onesYouFollow = (net) => ({
  success: true,
  message: 'You follow the following users',
  data: {
    following: net,
  },
});

const yourFollowers = (chase) => ({
  success: true,
  message: 'List of users following you',
  data: {
    following: chase,
  },
});

module.exports = {
  getSuccess,
  postSuccess,
  errorJson,
  onesYouFollow,
  yourFollowers,
  getQuestionRes,
};
