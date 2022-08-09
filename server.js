const express = require('express');
const errorHandlerMiddleware = require('./errHandler');
const router = require('./routes');
const connectDb = require('./connectDb');
const asyncWrapper = require('./asyncWrapper');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use('', router);
app.use(errorHandlerMiddleware);
app.use('*', (req, res) => {
  res.status(404).send('Route does not exist');
});

const startserver = asyncWrapper(async () => {
  await connectDb(process.env.MONGOURI);
  app.listen(process.env.PORT, () => console.log('connected to the server'));
});

startserver();
