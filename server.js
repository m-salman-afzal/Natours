import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app.js';

process.on('unhandledException', (err) => {
  console.log(`Error Name: ${err.name}\nError Message: ${err.message}`);
  process.exit(1);
});

// * give path for the config file
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// * connect mongoose to the DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(
      '--------------------------------\n Mongoose Connection Successful\n--------------------------------'
    );
  });

// * start the server and listen to the following port
const port = process.env.PORT || 8000;
const ip = process.env.IP || '127.0.0.1';

const server = app.listen(port, ip, () => {
  console.log(`
-----------------------------
 Listening to ${ip}:${port}
-----------------------------`);
});

// * define some unhandeled promises and exceptions
process.on('unhandledRejection', (err) => {
  console.log(`Error Name: ${err.name}\nError Message: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
