/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import dotenv from 'dotenv';

import indexRouter from './routes/index';
import userRouter from './routes/users';
import initializeDatabase from './libs/database';

dotenv.config();

const app = express();
app.use(bodyParser.json());
const port = process.env.SERVER_PORT || 3000;

app.use('/', indexRouter);
app.use('/users', userRouter);
function onListening() {
  console.log(`Listening on port ${port}`);
}

function onError(err) {
  console.log('Failed to start server', err);
}

const startServer = async () => {
  await initializeDatabase(app);

  const server = http.createServer(app);

  /**
  * Listen on provided port, on all network interfaces.
  */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
};

startServer();
